import { Injectable, OnInit } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { switchMap, takeUntil, catchError, tap } from 'rxjs/operators';

import * as TruffleContract from 'truffle-contract';

const Web3 = require('web3'); // tslint:disable-line

declare let require: any;
declare let window: any;

const tokenAbi = require('../../../backend/build/contracts/Election.json');

@Injectable({
  providedIn: 'root'
})

export class EthereumConnectorService {
  private web3Provider: null;
  private electionInstance;
  private candidatesCounter;
  private account;
  private votes = new Map<string, number>();
  public votes$ = new Subject<Map<string, number>>();
  private candidates = new Map<string, number>();
  public candidates$ =  new Subject<Map<string, number>>();
  private refreshVotes$: Observable<number> = timer(0, 1000);
  private voted: boolean;
  public voted$ = new Subject<boolean>();

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      if (!Web3.currentProvider) {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
    }
    window.ethereum.enable();
    window.web3 = new Web3(this.web3Provider);
  }

  getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase((err, account) => {
        if (err === null) {
          this.account = account;
          window.web3.eth.getBalance(account, (error, balance) => {
            if (error === null) {
              return resolve({fromAccount: account, balance: (window.web3.fromWei(balance, 'ether')).toNumber()});
            } else {
              return reject({fromAccount: 'error', balance: 0});
            }
          });
        }
      });
    });
  }

  findEachCandidateVotes() {
    return new Promise((resolve, reject) => {
      const promises = [];
      for (let i = 1; i <= this.candidatesCounter.toNumber(); i++) {
        promises[i] = this.electionInstance.candidates(i).then((candidate) => {
          this.votes.set(candidate[1], candidate[2].toNumber());
        });
      }
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }

  findEachCandidateIds() {
    return new Promise((resolve, reject) => {
      const promises = [];
      for (let i = 1; i <= this.candidatesCounter.toNumber(); i++) {
        promises[i] = this.electionInstance.candidates(i).then((candidate) => {
          this.candidates.set(candidate[0].toNumber(), candidate[1]);
        });
      }
      Promise.all(promises).then(() => {
        resolve();
      });
    });
  }

  vote(candidate: string) {
    this.notVotedYet().then(() => {
      if (!this.voted) {
        const that = this;
        const contract = TruffleContract(tokenAbi);
        contract.setProvider(that.web3Provider);
        contract.deployed().then((instance) => {
            this.electionInstance = instance;
        }).then(() => {
            return this.getAccountInfo();
        }).then(() => {
            return this.electionInstance.vote(candidate, {from: this.account});
        }).catch(() => {
          return this.getAccountInfo().then(() => {
            return this.electionInstance.vote(candidate, {from: this.account});
          });
        });
      }
    });
  }

  public notVotedYet() {
    const that = this;
    const contract = TruffleContract(tokenAbi);
    contract.setProvider(that.web3Provider);
    return contract.deployed().then((instance) => {
      this.electionInstance = instance;
      return this.electionInstance.hasVoted({from: this.account});
    }).then((voted) => {
      this.voted = voted;
      this.voted$.next(this.voted);
    });
  }

  async getVotes() {
    const that = this;

    const contract = TruffleContract(tokenAbi);
    contract.setProvider(that.web3Provider);

    contract.deployed().then((instance) => {
      this.electionInstance = instance;
      return this.electionInstance.candidatesCounter();
    }).then((candidatesCounter) => {
        this.candidatesCounter = candidatesCounter;
        return this.findEachCandidateVotes();
    }).then(() => {
        this.votes$.next(this.votes);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  getCandidates() {
    const that = this;

    const contract = TruffleContract(tokenAbi);
    contract.setProvider(that.web3Provider);

    contract.deployed().then((instance) => {
      this.electionInstance = instance;
      return this.electionInstance.candidatesCounter();
    }).then((candidatesCounter) => {
        this.candidatesCounter = candidatesCounter;
        return this.findEachCandidateIds();
    }).then(() => {
        this.candidates$.next(this.candidates);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  start(): void {
    this.getCandidates();
    this.getAccountInfo();
    this.refreshVotes$.pipe(
    ).subscribe(() => {
      this.getVotes();
    });
  }


}

