import {
  Directive,
  Input,
  Output,
  OnChanges,
  OnInit,
  KeyValueChanges,
  KeyValueDiffers,
  KeyValueDiffer,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { Selection, ValueFn, select } from 'd3-selection';
import 'd3-transition';
import { Transition } from 'd3-transition';

export type AttrValue = number | string | boolean;

interface Attrs {
  [key: string]: AttrValue;
}

export type EaseFn = (normalizedTime: number) => number;
export type SelectionEl = Selection<HTMLElement, any, null, undefined>;
export type D3Transition = Transition<HTMLElement, any, null, undefined>;
export type TransitionDecorator = (t: D3Transition) => D3Transition;
export type TweenFn = ValueFn<HTMLElement, any, (t: number) => string> | undefined;

@Directive({
  selector: '[appSvgTransition]'
})
export class SvgTransitionDirective implements OnChanges, OnInit {
  private _attr: Attrs = null;
  private _style: Attrs = null;
  private _attrTween: { [key: string]: TweenFn } = null;
  private _styleTween: { [key: string]: TweenFn } = null;
  private _selection: SelectionEl;

  private kvAttrDiffer: KeyValueDiffer<string, any>;
  private kvAttrTweenDiffer: KeyValueDiffer<string, any>;
  private kvStyleDiffer: KeyValueDiffer<string, any>;
  private kvStyleTweenDiffer: KeyValueDiffer<string, any>;
  private transition: Transition<any, any, any, any>;

  @Input() appSvgTransition: TransitionDecorator = t => t;

  @Input() call: any[] = [];

  @Input('d3-attr') set attr(v: Attrs) {
    this.kvAttrDiffer = this.kvDiffers.find(v).create();
    this._attr = v;
  }

  @Input('d3-attr-tween') set attrTween(t: { [key: string]: TweenFn }) {
    this.kvAttrTweenDiffer = this.kvDiffers.find(t).create();
    this._attrTween = t;
  }

  @Input('d3-style') set style(v: Attrs) {
    this.kvStyleDiffer = this.kvDiffers.find(v).create();
    this._style = v;
  }

  @Input('d3-style-tween') set styleTween(t: { [key: string]: TweenFn }) {
    this.kvStyleTweenDiffer = this.kvDiffers.find(t).create();
    this._styleTween = t;
  }

  @Output() onStart: EventEmitter<SelectionEl> = new EventEmitter();

  @Output() onEnd: EventEmitter<SelectionEl> = new EventEmitter();

  @Output() onInterrupt: EventEmitter<SelectionEl> = new EventEmitter();

  constructor(
    private kvDiffers: KeyValueDiffers,
    private el: ElementRef
  ) {
    this.appSvgTransition = t => t;
  }

  ngOnInit() {
    this.transition.on('start', () => this.emitLifeCycle(this.onStart));
    this.transition.on('end', () => this.emitLifeCycle(this.onEnd));
    this.transition.on('interrupt', () => this.emitLifeCycle(this.onInterrupt));

    if (this.call.length > 0) {
      this.call[0](this.transition, ...this.call.slice(1));
    }

    this.ngOnChanges();
  }

  ngOnChanges() {
    this.initTransition();

    // apply tweens
    const attrTweenChanges = this.kvAttrDiffer.diff(this._attrTween);
    if (attrTweenChanges && this.transition) {
      this.applyAttrTweenChanges(attrTweenChanges);
    }

    const stylesTweenChanges = this.kvAttrDiffer.diff(this._styleTween);
    if (stylesTweenChanges && this.transition) {
      this.applyStyleTweenChanges(stylesTweenChanges);
    }

    // set attributes and styles
    const attrChanges = this.kvAttrDiffer.diff(this._attr);
    if (attrChanges && this.transition) {
      this.applyAttrChanges(attrChanges);
    }

    const styleChanges = this.kvAttrDiffer.diff(this._style);
    if (styleChanges && this.transition) {
      this.applyStyleChanges(styleChanges);
    }
  }

  private initTransition() {
    if (this._selection) {
      this._selection.interrupt();
    }
    this.appSvgTransition = this.appSvgTransition || (t => t);
    this.transition = this.appSvgTransition(select(this.el.nativeElement).transition());
  }

  private applyAttrChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setAttr(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setAttr(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setAttr(record.key, null));
  }

  private setAttr(name: string, value: AttrValue): void {
    this.safeExecute(() => this.transition.attr(name, value));
  }

  private applyAttrTweenChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setAttrTween(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setAttrTween(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setAttrTween(record.key, null));
  }

  private setAttrTween(name: string, value: TweenFn): void {
    this.safeExecute(() => this.transition.attrTween(name, value));
  }

  private applyStyleChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setStyle(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setStyle(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setStyle(record.key, null));
  }

  private setStyle(name: string, value: AttrValue): void {
    this.safeExecute(() => this.transition.style(name, value));
  }

  private applyStyleTweenChanges(changes: KeyValueChanges<string, any>): void {
    changes.forEachAddedItem(record => this.setStyleTween(record.key, record.currentValue));
    changes.forEachChangedItem(record => this.setStyleTween(record.key, record.currentValue));
    changes.forEachRemovedItem(record => this.setStyleTween(record.key, null));
  }

  private setStyleTween(name: string, value: TweenFn): void {
    this.safeExecute(() => this.transition.styleTween(name, value));
  }

  private emitLifeCycle(ee: EventEmitter<SelectionEl>): void {
    ee.emit(this._selection);
  }

  private safeExecute(fn: any): void {
    try {
      fn();
    } catch (err) {
      console.log('D3.js: ' + err.message);
    }
  }
}
