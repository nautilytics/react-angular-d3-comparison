import { Component, Input } from '@angular/core';

export interface MarkerItem {
  x: number;
  y: number;
  r: number;
}

@Component({
  selector: '[app-marker]',
  templateUrl: './marker.component.html'
})
export class MarkerComponent {
  @Input() item: MarkerItem;
  protected transition = t => t.duration(1000);
}
