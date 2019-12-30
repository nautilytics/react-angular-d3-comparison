import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { AxesItem } from './axes/axes.component';
import { range, extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { MarkerItem } from './marker/marker.component';
import { DistributionItem } from '../app.component';
import { calculateLayout } from "../../lib/util";

@Component({
  selector: 'app-visualization',
  templateUrl: './visualization.component.html'
})
export class VisualizationComponent implements OnInit, OnChanges {
  @Input() selectedDistribution: DistributionItem;
  xScale = scaleLinear();
  margin = {
    left: 40,
    right: 40,
    bottom: 40,
    top: 40
  };
  markerRadius = 7.5;
  xAccessor = d => d.x;
  data: any[];
  elementId = '.Visualization';
  changeSize = new Subject();

  @HostListener('window:resize', ['$event.target'])
  public onResize() {
    this.changeSize.next();
  }

  constructor(protected element: ElementRef, private cdr: ChangeDetectorRef) {
  }

  get height(): number {
    return this.element.nativeElement.querySelector(this.elementId).offsetHeight;
  }

  get width(): number {
    return this.element.nativeElement.querySelector(this.elementId).offsetWidth;
  }

  get innerHeight(): number {
    return this.height - this.margin.top - this.margin.bottom;
  }

  get innerWidth(): number {
    return this.width - this.margin.left - this.margin.right;
  }

  ngOnInit(): void {
    this.changeSize
      .asObservable()
      .pipe(
        throttleTime(250)
      )
      .subscribe(() => this.setAxisScales());
    this.draw();
  }

  updateData() {

    this.data = range(250).map(d => {
      return {
        x: this.selectedDistribution.fn(),
        y: this.innerHeight / 2,
        r: this.markerRadius,
        id: `marker-${d}`
      }
    });
    this.setAxisScales();
    this.data = calculateLayout(this.data.map(d => {
      return {
        ...d,
        x: this.xScale(this.xAccessor(d)),
        fx: this.xScale(this.xAccessor(d)), // fix the x-position for the markers
      }
    }));
  }

  setAxisScales() {
    this.xScale
      .range([0, this.innerWidth])
      .domain(extent(this.data, this.xAccessor));
  }

  get gTransform(): string {
    return `translate(${this.margin.left},${this.margin.top})`;
  }

  formatAxes(): AxesItem {
    return {
      xScale: this.xScale,
      height: this.innerHeight
    };
  }

  formatMarkerItem(row): MarkerItem {
    return {
      x: row.x,
      y: row.y,
      r: row.r
    }
  }

  protected trackByPoint(item) {
    return item.id;
  }

  private draw() {
    this.updateData();
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    setTimeout(() => {
      this.draw();
    }, 0);
  }
}
