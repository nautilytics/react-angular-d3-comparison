import { Component } from '@angular/core';
import { randomLogNormal, randomNormal } from 'd3-random';

export interface DistributionItem {
  id: string;
  fn: any;
  isActive: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  distributions = [
    { 'id': 'normal', fn: randomNormal(.5, 1), isActive: true },
    { 'id': 'log-normal', fn: randomLogNormal(.5, 1), isActive: false }
  ];

  onDistributionChange = dist => {
    this.distributions = this.distributions.map(d => {
      return {
        ...d,
        isActive: d.id === dist.id
      }
    })
  };

  get activeDistribution(): any {
    return this.distributions.find(d => d.isActive);
  }
}
