import { Component, EventEmitter } from '@angular/core';
import { CategoryService } from 'mahrio-header/src/services';
import template from './product-features.template.html';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

var features = [];

@Component({
  selector: 'product-features',
  template,
  styles: [],
  inputs: ['product', 'features'],
  outputs: ['callback']
})


export class ProductFeaturesComponent {
  static get parameters() {
    return [CategoryService];
  }

  constructor(CategoryService) {
    this.productService = CategoryService;
    this.callback = new EventEmitter();
  }
  ngOnChanges(changes){
    if( changes.features && changes.features.currentValue ){
      features = changes.features.currentValue;
    }
    if( changes.product && changes.product.currentValue ) {
      this.product = changes.product.currentValue;
    }
  }

  search(text$) {
    return text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : features.filter(v => new RegExp(term, 'gi').test(v.title)).slice(0, 10));
  }

  selectItem(event) {
    const item = event.item;
    let features = this.product.features;
    features.add(item._id);
    this.productService.put(this.product.id, {topics: Array.from(features)}, 'topics').then(res => {
      this.callback.emit({
        type: 'success',
        msg: 'Feature saved',
        features: features
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save features'
      });
    });
  }

  removeItem(id) {
    let features = this.product.features;
    features.delete(id);
    this.productService.put(this.product.id, {topics: Array.from(features)}, 'topics').then(res => {
      this.callback.emit({
        type: 'success',
        msg: 'Feature removed',
        features: features
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to remove feature'
      });
    });
  }
}