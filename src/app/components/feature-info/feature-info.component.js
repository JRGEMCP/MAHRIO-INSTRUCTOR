import { Component, EventEmitter } from '@angular/core';
import { TopicService } from 'mahrio-header/src/services';
import template from './feature-info.template.html';

@Component({
  selector: 'feature-info',
  template,
  inputs: ['feature'],
  outputs: ['callback']
})

export class FeatureInfoComponent {
  static get parameters(){
    return [TopicService];
  }

  constructor(TopicService){
    this.featureService = TopicService;
    this.callback = new EventEmitter();
  }

  onTagChanged( tags ){
    this.featureService.put( this.feature.id, {tags: tags}, 'tags' ).then( res => {
      console.log(res);
    })
  }

  save(){
    this.featureService.put(this.feature.id, this.feature.payload, 'info').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Feature info saved',
        change: 'edit',
        value: this.feature.payload
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save info'
      });
    });
  }
}