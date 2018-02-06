import { Component, EventEmitter } from '@angular/core';
import { TopicService } from 'mahrio-header/src/services';
import template from './feature-body.template.html';

@Component({
  selector: 'feature-body',
  template,
  styles: [],
  inputs: ['feature', 'articles'],
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
    this.unselectedArticles = [];
  }

  ngOnInit(){
    let usedIds = this.feature.body.filter( body => body.content && body.content._id ).map(
      body => {
        return body.content._id;
      }
    )
    this.unselectedArticles = this.feature.currentArticles.filter( art => usedIds.indexOf(art._id) === -1 );
  }
  updateBody( preInsert ){
    let bodyPayload = this.feature.body.map(
      body => body.content._id ? {type: 'article', content: '___link___article___'+body.content._id+'___inline___'} : body);
    if( !preInsert ) {
      let body = this.feature.body;
      body.push({type: null, content: this.body});
      this.feature.body = body;
      bodyPayload.push( {type: null, content: this.body });
    }
    this.featureService.put(this.feature.id, {body: bodyPayload.map(body => body.content)}, 'body').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Feature content saved',
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
    let toRemove = this.feature.body.filter( (val, i) => i === index )[0];
    this.featureService.put(
      this.feature.id,
      {
        body: this.feature.body.filter( (val, i) => i !== index ).map(body => body.content._id ? '___link___article___'+body.content._id+'___inline___' : body.content)
      }, 'body')
      .then(res => {
        if( toRemove.content && toRemove.content._id ) { debugger;
          this.unselectedArticles.push(toRemove.content);
        }
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
  selectchange( $event ){
    let selected = this.unselectedArticles.filter( art => art._id === this.body )[0];
    this.unselectedArticles = this.unselectedArticles.filter( art => art._id !== this.body );
    this.body = '___link___article___' + this.body + '___inline___';
    let body = this.feature.body;
    body.push({type: 'article', content: selected});
    this.feature.body = body;
    this.updateBody( true );
  }
}