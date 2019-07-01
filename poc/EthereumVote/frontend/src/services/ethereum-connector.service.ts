import { Injectable, OnInit } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';

import * as TruffleContract from 'truffle-contract';
import { Router } from '@angular/router';

const Web3 = require('web3');

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
  public account$ = new Subject<string>();
  private votes = new Map<string, number>();
  public votes$ = new Subject<Map<string, number>>();
  private candidates = new Map<string, number>();
  public candidates$ =  new Subject<Map<string, number>>();
  private refreshVotes$: Observable<number> = timer(0, 2000);
  private state: ElectionState;
  public state$ = new Subject<ElectionState>();
  public error$ = new Subject<string>();
  private votingKey: string;
  private contract: any;

  constructor(private router: Router) {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      if (!Web3.currentProvider) {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
    }

    window.ethereum.enable();
    window.web3 = new Web3(this.web3Provider);
    window.web3.currentProvider.publicConfigStore.on('update', (obj) => {
      if (obj.selectedAddress !== this.account) {
        this.account$.next(obj.selectedAddress);
      }
    });

    this.state = ElectionState.notloggedin;
    this.state$.next(this.state);

    this.state$.subscribe( state => {
      let route: string;
      switch (state) {
        case ElectionState.notloggedin:
          route = 'login';
          this.register();
          break;
        case ElectionState.loggedin:
          route = 'vote';
          break;
        case ElectionState.voted:
          route = 'verify';
          break;
        case ElectionState.verified:
          route = 'results';
          break;
      }
      this.router.navigateByUrl(`/${route}`);
    });

    this.account$.subscribe(account => {
      if (document.hidden && this.state === ElectionState.verified) {
      } else {
        this.state = ElectionState.notloggedin;
        this.state$.next(this.state);
        this.account = account;
      }
    });
  }

  private getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase((err, account) => {
        if (err === null && account !== null) {
          this.account = account;
          window.web3.eth.getBalance(account, (error, balance) => {
            if (error === null && balance > 0) {
              return resolve();
            } else {
              return reject();
            }
          });
        } else {
          return reject();
        }
      });
    });
  }

  public register() {
    return new Promise((resolve, reject) => {
        console.log('start 1');
        return this.truffleContract.deployed().then((instance) => {
          this.electionInstance = instance;
          return this.getAccountInfo();
        }).then(() => {
          console.log('start 2');
          console.log(this.account);
          return this.electionInstance.hasRegistered({from: this.account});
        }).then((registered) => {
          if (registered) {
            this.state = ElectionState.loggedin;
            this.state$.next(this.state);
            throw Error('already registered');
          }
          console.log('not registered yet');
        }).then(() => {
          this.votingKey = (Math.floor(Math.random() * 99) + 1).toString();
          return this.electionInstance.register(window.web3.sha3(this.votingKey), {from: this.account})
            .then(() => {
              this.state = ElectionState.loggedin;
              this.state$.next(this.state);
            });
        }).then(() => {
          resolve();
        }).catch((error) => {
          this.error$.next(error);
          reject(error);
        });
    }).catch((error) => {
      if (error === 'already registered') {
        console.log(error);
      }
      this.error$.next(error);
    });
  }

  private findEachCandidateVotes() {
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

  private findEachCandidateIds() {
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

  public vote(candidate: string) {
    this.state = ElectionState.voted;
    this.state$.next(this.state);
    this.checkVotedYet().then(() => {
      if (this.state.valueOf() < ElectionState.verified.valueOf()) {
        this.truffleContract.deployed().then((instance) => {
            this.electionInstance = instance;
        }).then(() => {
            return this.getAccountInfo();
        }).then(() => {
            return this.electionInstance.hasRegistered({from: this.account});
        }).then((registered) => {
            if (!registered) {
              throw Error('not registered');
            }
            return this.electionInstance.hasVoted({from: this.account});
        }).then((voted) => {
            if (voted) {
              throw Error('already voted');
            }
            this.state = ElectionState.voted;
            this.state$.next(this.state);
            return this.electionInstance.vote(candidate, this.votingKey, {from: this.account});
        }).then(() => {
            this.state = ElectionState.verified;
            this.state$.next(this.state);
        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  public checkVotedYet() {
    return new Promise( (resolve, reject) => {
      return this.truffleContract.deployed().then((instance) => {
        this.electionInstance = instance;
        return this.electionInstance.hasVoted({from: this.account});
      }).then((voted) => {
        if (voted) {
          setTimeout( () => {
            window.alert('It seems you have already voted!');
            this.state = ElectionState.verified;
            this.state$.next(this.state);
          }, 2000);
        }
      }).then(() => {
        resolve();
      }).catch((error) => {
        this.error$.next(error);
        reject();
      });
    });
  }

  public async getVotes() {
    this.truffleContract.deployed().then((instance) => {
      this.electionInstance = instance;
      return this.electionInstance.candidatesCounter();
    }).then((candidatesCounter) => {
        this.candidatesCounter = candidatesCounter;
        return this.findEachCandidateVotes();
    }).then(() => {
        this.votes$.next(this.votes);
    }).catch((error) => {
        this.error$.next(error);
        console.log(error);
    });
  }

  public getCandidates() {
    this.truffleContract.deployed().then((instance) => {
      this.electionInstance = instance;
      return this.electionInstance.candidatesCounter();
    }).then((candidatesCounter) => {
        this.candidatesCounter = candidatesCounter;
        return this.findEachCandidateIds();
    }).then(() => {
        this.candidates$.next(this.candidates);
    }).catch((error) => {
        this.error$.next(error);
        console.log(error);
    });
  }

  get truffleContract() {
    if (!this.contract) {
      const contract = TruffleContract(tokenAbi);
      contract.setProvider(this.web3Provider);
      this.contract = contract;
    }
    return this.contract;
  }

  start(): void {
    this.state = ElectionState.notloggedin;
    this.state$.next(this.state);
    this.getCandidates();
    this.getAccountInfo().then(() => {
      return this.register();
    }).catch();
    this.refreshVotes$.subscribe(() => {
      this.getVotes().catch();
    });
  }
}

export enum ElectionState {
  notloggedin,
  loggedin,
  voted,
  verified
}
