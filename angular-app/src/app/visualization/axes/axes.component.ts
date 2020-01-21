import { Component, ElementRef, Input, NgZone, OnChanges, OnInit, ViewChild } from '@angular/core';
import { select } from 'd3-selection';
import { axisBottom } from 'd3-axis';

export interface AxesItem {
  xScale: any;
  height: number;
}

@Component({
  selector: '[app-axes]',
  templateUrl: './axes.component.html'
})
export class AxesComponent implements OnInit, OnChanges {
  @Input() item: AxesItem;
  @ViewChild('xAxisEl', { static: true }) xAxisEl: ElementRef;

  constructor(private zone: NgZone) {
  }

  renderXAxis(): void {
    const xAxis = select(this.xAxisEl.nativeElement);

    this.zone.runOutsideAngular(() => {
      xAxis
        .call(axisBottom(this.item.xScale));
    });
  }

  renderAxes(): void {
    this.renderXAxis();
  }

  ngOnChanges() {
    this.renderAxes();
  }

  ngOnInit() {
    this.renderAxes();
  }

  get xAxisTransform(): string {
    return `translate(0, ${this.item.height})`;
  }
}
