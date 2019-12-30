import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VisualizationComponent } from './visualization/visualization.component';
import { MarkerComponent } from './visualization/marker/marker.component';
import { AxesComponent } from './visualization/axes/axes.component';
import { SvgTransitionDirective } from '../directives/svg-transition.directive';

@NgModule({
  declarations: [
    AppComponent,
    VisualizationComponent,
    MarkerComponent,
    AxesComponent,
    SvgTransitionDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
