import { Component, Input, OnInit } from '@angular/core';
import { EthereumConnectorService } from 'src/services/ethereum-connector.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  @Input() votes: Map<string, number>;
  totalVotes = 0;

  percentage(voteId): string {
    if (this.votes) {
      const votes = this.votes.get(voteId);
      this.totalVotes = Array.from(this.votes.values()).reduce((sum, current) => sum + current);
      return this.totalVotes !== 0 ? `${Math.round((votes / this.totalVotes) * 100)}%` : '...';
    }
  }

  constructor(
    private connector: EthereumConnectorService

  ) { }

  ngOnInit(): void {
    this.connector.getVotes();
    this.connector.votes$.subscribe( votes => {
      this.votes = votes;
    });
  }

}
