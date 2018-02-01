import { Component, EventEmitter } from '@angular/core';
import { TopicService } from 'mahrio-header/src/services';
import template from './feature-body.template.html';

@Component({
  selector: 'feature-body',
  template,
  styles: [],
  inputs: ['feature'],
  outputs: ['callback']
})

export class FeatureBodyComponent {
  static get parameters(){
    return [TopicService];
  }

  constructor(TopicService){
    this.featureService = TopicService;
    this.callback = new EventEmitter();
    this.body = '';
  }

  updateBody(){
    let bodyPayload = this.feature.body;
    bodyPayload.push( this.body );
    this.featureService.put(this.feature.id, {body: bodyPayload}, 'body').then( res => {
      this.body = '';
      this.callback.emit({
        type: 'success',
        msg: 'Feature content saved',
        change: 'body',
        value: this.feature.body
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save content'
      });
    });
  }
  removeBody(index) {
    this.featureService.put(this.feature.id, {body: this.feature.body.filter( (val, i) => i !== index )}, 'body')
      .then(res => {
        this.feature.body.splice(index, 1);
        this.callback.emit({
          type: 'success',
          msg: 'Feature content removed',
          value: this.feature.body
        });
      }, err => {
        this.callback.emit({
          type: 'danger',
          msg: 'Unable to remove content'
        });
      });
  }
}