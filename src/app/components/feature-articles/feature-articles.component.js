import { Component, EventEmitter } from '@angular/core';
import { TopicService } from 'mahrio-header/src/services';
import template from './feature-articles.template.html';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

var articles = [];

@Component({
  selector: 'feature-articles',
  template,
  styles: [],
  inputs: ['feature', 'articles'],
  outputs: ['callback']
})


export class FeatureArticlesComponent {
  static get parameters() {
    return [TopicService];
  }

  constructor(TopicService) {
    this.featureService = TopicService;
    this.callback = new EventEmitter();
  }
  ngOnChanges(changes){
    if( changes.articles && changes.articles.currentValue ){
      articles = changes.articles.currentValue;
    }
    if( changes.feature && changes.feature.currentValue ) {
      this.feature = changes.feature.currentValue;
      console.log( this.feature.currentArticles );
    }
  }

  search(text$) {
    return text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : articles.filter(v => new RegExp(term, 'gi').test(v.title)).slice(0, 10));
  }

  selectItem(event) {
    const item = event.item;
    let articles = this.feature.articles;
    articles.add(item._id);
    this.featureService.put(this.feature.id, {articles: Array.from(articles)}, 'articles').then(res => {
      this.callback.emit({
        type: 'success',
        msg: 'Articles saved',
        articles: articles
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save articles'
      });
    });
  }

  removeItem(id) {
    let articles = this.feature.articles;
    articles.delete(id);
    this.featureService.put(this.feature.id, {articles: Array.from(articles)}, 'articles').then(res => {
      this.callback.emit({
        type: 'success',
        msg: 'Articles removed',
        articles: articles
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to remove article'
      });
    });
  }
}