import { Component, ElementRef, Input, NgZone, OnChanges, OnInit } from '@angular/core';
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

  constructor(protected element: ElementRef,
              private zone: NgZone) {
  }

  renderXAxis(): void {
    const elem = this.element.nativeElement.querySelector('.axis');
    const xAxis = select(elem);

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
