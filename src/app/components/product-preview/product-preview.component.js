import { Component, EventEmitter } from '@angular/core';
import { CategoryService } from 'mahrio-header/src/services';
import template from './product-preview.template.html';

@Component({
  selector: 'product-preview',
  template,
  styles: [],
  inputs: ['product'],
  outputs: ['callback']
})

export class ProductPreviewComponent {
  static get parameters(){
    return [CategoryService];
  }

  constructor(categoryService){
    this.productService = categoryService;
    this.callback = new EventEmitter();
  }

  publish( state ) {
    this.productService.put(this.product.id, {}, 'publish?' + (state ? 'true' : 'false')).then( res => {
      this.product.published = state;
      this.callback.emit({
        type: 'success',
        msg: `Product ${!state ? 'un' : ''}published`,
        change: 'publish',
        value: state
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to publish content'
      });
    });
  }
}