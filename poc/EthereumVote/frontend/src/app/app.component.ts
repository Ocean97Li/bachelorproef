import { Component, OnInit } from '@angular/core';
import { EthereumConnectorService } from 'src/services/ethereum-connector.service';
import { Candidate } from 'src/models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'EthereumVote';
  constructor(
    private connector: EthereumConnectorService
  ) {
  }
  ngOnInit(): void {
    this.connector.start();
  }
}
