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
    answer : new FormControl('')
  }, [Validators.required]);

  voted = false;

  constructor(
    private router: Router,
    private connector: EthereumConnectorService
  ) {}

  private toResults() {
    this.router.navigate(['results']);
  }

  public vote() {
    this.connector.checkVotedYet().then( () => {
      if (!this.voted) {
        this.connector.vote(this.form.get('answer').value);
        this.toResults();
      } else {
        window.alert('It seems that you have already voted.');
        this.toResults();
      }
    });
  }

  public key() {
    this.connector.getVotingKey();
  }

  ngOnInit(): void {
    this.connector.voted$.subscribe((voted: boolean) => {
      this.voted = voted;
    });
  }
}
