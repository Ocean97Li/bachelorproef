import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EthereumConnectorService } from 'src/services/ethereum-connector.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent {
  form = new FormGroup({
    answer : new FormControl('')
  }, [Validators.required]);

  constructor(
    private router: Router,
    private connector: EthereumConnectorService
  ) {}

  private toResults() {
    this.router.navigate(['results']);
  }

  public vote() {
    console.log(1);
    this.connector.vote(this.form.get('answer').value);
    this.toResults();
  }
}
