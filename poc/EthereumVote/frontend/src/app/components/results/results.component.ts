import { Component, Input, OnInit } from '@angular/core';
import { EthereumConnectorService } from 'src/services/ethereum-connector.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  votes: Map<string, number>;
  displayPercentage: number[] = [0, 0];

  totalVotes(votes: Map<string, number>): number {
    if (votes) {
      return Array.from(votes.values()).reduce((sum, current) => sum + current);
    }
    return 0;
  }

  percentage(voteId: string): string {
    if (this.votes) {
      const votes = this.votes.get(voteId);
      const totalVotes =  this.totalVotes(this.votes);
      return totalVotes !== 0 ? `${Math.round((votes / totalVotes) * 100)}%` : '...';
    }
  }

  percentageAnimation(voteId: string, newvotes: Map<string, number>, delay: number): Promise<any> {
    return new Promise( (resolve, reject) => {
      if (this.votes) {
        const votes = this.votes.get(voteId);
        const totalVotes = this.totalVotes(this.votes);
        this.displayPercentage[(voteId === 'Yes' ? 0 : 1)] =  Math.round((votes / totalVotes) * 100);
      }

      const newVotes = newvotes.get(voteId);
      const newTotalVotes = this.totalVotes(newvotes);
      const newPercentage = Math.round((newVotes / newTotalVotes) * 100);

      const diff = newPercentage - this.displayPercentage[(voteId === 'Yes' ? 0 : 1)];
      const delaying = setTimeout( () => {
        if (diff > 0) {
          const me1 = setInterval(() => {
            const array = [...this.displayPercentage];
            array[(voteId === 'Yes' ? 0 : 1)] += 1;
            this.displayPercentage = [...array];
            if (this.displayPercentage[(voteId === 'Yes' ? 0 : 1)] === newPercentage) {
              clearInterval(me1);
            }
          }, 1000 / newPercentage);
        }
        if (diff < 0) {
          const me2 = setInterval(() => {
            const array = [...this.displayPercentage];
            array[(voteId === 'Yes' ? 0 : 1)] -= 1;
            this.displayPercentage = [...array];
            if (this.displayPercentage[(voteId === 'Yes' ? 0 : 1)] === newPercentage) {
              clearInterval(me2);
            }
          }, 1000 / newPercentage);
        }
        clearTimeout(delaying);
      }, delay);
      resolve();
    });
  }

  constructor(
    private connector: EthereumConnectorService

  ) { }

  ngOnInit(): void {
    this.connector.getVotes();

    this.connector.votes$.subscribe( votes => {
      if (this.totalVotes(votes) !== this.totalVotes(this.votes)) {
        Promise.all([this.percentageAnimation('Yes', votes, 400), this.percentageAnimation('No', votes, 700)])
          .then(() => {
            this.votes = votes;
          });
      }
    });
  }
}
