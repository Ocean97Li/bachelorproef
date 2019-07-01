import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EthereumConnectorService } from 'src/services/ethereum-connector.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  form = new FormGroup({
    answer : new FormControl()
  }, [Validators.required]);

  voted = false;
  candidates;


  constructor(
    private connector: EthereumConnectorService
  ) {}

  public vote() {
    this.connector.vote(this.form.get('answer').value);
  }

  ngOnInit(): void {
    this.connector.getCandidates();
    this.connector.candidates$.subscribe(candidates => {
      this.candidates = [];
      candidates.forEach((name, id) => {
        this.candidates.push({id, name});
      });
    });
  }
}
