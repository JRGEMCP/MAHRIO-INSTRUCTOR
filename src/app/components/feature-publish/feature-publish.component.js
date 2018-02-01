import { Component, EventEmitter } from '@angular/core';
import { TopicService } from 'mahrio-header/src/services';
import template from './feature-publish.template.html';

@Component({
  selector: 'feature-publish',
  template,
  styles: [],
  inputs: ['feature'],
  outputs: ['callback']
})

export class FeaturePublishComponent {
  static get parameters(){
    return [TopicService];
  }

  constructor(TopicService){
    this.featureService = TopicService;
    this.callback = new EventEmitter();
  }

  publish( state ) {
    this.featureService.put(this.feature.id, {}, 'publish?' + (state ? 'true' : 'false')).then( res => {
      this.callback.emit({
        type: 'success',
        msg: `Feature ${!state ? 'un' : ''}published`,
        change: 'publish',
        value: state
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save content'
      });
    });
  }
}