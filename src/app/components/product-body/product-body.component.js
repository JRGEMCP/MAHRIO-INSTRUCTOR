import { Component, EventEmitter } from '@angular/core';
import { CategoryService } from 'mahrio-header/src/services';
import template from './product-body.template.html';
import style from './product-body.style.scss';

@Component({
  selector: 'product-body',
  template,
  styles: [style],
  inputs: ['product'],
  outputs: ['callback']
})

export class ProductBodyComponent {
  static get parameters(){
    return [CategoryService];
  }

  constructor(CategoryService){
    this.productService = CategoryService;
    this.callback = new EventEmitter();
    this.body = '';
    this.unselectedFeatures = []
  }

  ngOnInit(){
    let usedIds = this.product.body.filter( body => body.content && body.content._id ).map(
      body => {
        return body.content._id;
      }
    )
    this.unselectedFeatures = this.product.currentFeatures.filter( feat => usedIds.indexOf(feat._id) === -1 );
  }
  save(){
    let bodyPayload = this.product.body.map(
      body => body.content._id ? {type: 'feature', content: '___link___topic___'+body.content._id+'___inline___'} : body);

    this.productService.put(this.product.id, {body: bodyPayload.map(body => body.content)}, 'body').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Product content saved',
        change: 'body',
        value: bodyPayload
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save content'
      });
    });
  }
  moveUp(i){
    let body = this.product.body.splice(i,1);
    this.product.body.splice(i-1, 0, body[0]);
    this.save();
  }
  moveDown(i){
    let body = this.product.body.splice(i,1);
    this.product.body.splice(i+1, 0, body[0]);
    this.save();
  }
  updateBody( preInsert ){
    let bodyPayload = this.product.body.map(
      body => body.content._id ? {type: 'feature', content: '___link___topic___'+body.content._id+'___inline___'} : body);
    if( !preInsert ) {
      let body = this.product.body;
      body.push({type: null, content: this.body});
      this.product.body = body;
      bodyPayload.push( {type: null, content: this.body });
    }
    this.productService.put(this.product.id, {body: bodyPayload.map(body => body.content)}, 'body').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Product content saved',
        change: 'body',
        value: bodyPayload
      });
      this.body = '';
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save content'
      });
    });
  }
  removeBody(index) {
    let toRemove = this.product.body.filter( (val, i) => i === index )[0];
    this.productService.put(
      this.product.id,
      {
        body: this.product.body.filter( (val, i) => i !== index ).map(body => body.content._id ? '___link___feature___'+body.content._id+'___inline___' : body.content)
      }, 'body')
      .then(res => {
        if( toRemove.content && toRemove.content._id ) {
          this.unselectedFeatures.push(toRemove.content);
        }
        this.product.body.splice(index, 1);
        this.callback.emit({
          type: 'success',
          msg: 'Product content removed',
          value: this.product.body
        });
      }, err => {
        this.callback.emit({
          type: 'danger',
          msg: 'Unable to remove content'
        });
      });
  }
  selectchange( $event ){
    let selected = this.unselectedFeatures.filter( feat => feat._id === this.body )[0];
    this.unselectedFeatures = this.unselectedFeatures.filter( feat => feat._id !== this.body );
    this.body = '___link___topic___' + this.body + '___inline___';
    let body = this.product.body;
    body.push({type: 'feature', content: selected});
    this.product.body = body;
    this.updateBody( true );
  }
}