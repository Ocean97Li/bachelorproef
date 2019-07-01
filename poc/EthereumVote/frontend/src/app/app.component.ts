import { Component, OnInit, HostBinding } from '@angular/core';
import { EthereumConnectorService, ElectionState } from 'src/services/ethereum-connector.service';
import { Candidate } from 'src/models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'EthereumVote';
  state = ElectionState.notloggedin;
  constructor(
    private connector: EthereumConnectorService
  ) {
  }

  ngOnInit(): void {
    this.connector.start();
    this.connector.state$.subscribe(state => {
      console.log(state);
      this.state = state;
    });
  }
}
