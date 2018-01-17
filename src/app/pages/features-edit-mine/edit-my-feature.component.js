import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService, ArticleService } from 'mahrio-header/src/services';
import { Feature } from 'mahrio-header/src/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import template from './edit-my-feature.template.html';
var articles = [];

@Component({
  selector: 'edit-my-feature',
  template
})


export class EditMyFeatureComponent {
  static get parameters(){
    return [ActivatedRoute, Router, TopicService, ArticleService, FormBuilder];
  }
  constructor( route, router, featureService, articleService, formBuilder ){
    this.route = route;
    this.router = router;
    this.featureService = featureService;
    this.feature = new Feature(formBuilder);
    this.formBuilder = formBuilder;
    this.state = 'edit';
    this.articlesService = articleService;
    this.articles = [];
    this.currentArticles = [];
  }
  ngOnInit(){
    this.articlesService.getPublished()
      .subscribe( res => {
        articles = res.articles;
        this.reloadCurrentArticles();
      });

    if( !this.featureService.currentFeature ) {
      this._subs = this.featureService.token
        .flatMap( token => this.featureService.list(this.route.params.value.id, true) )
        .catch( () => { console.log('catcheeed') })
        .subscribe( res => {
          this.feature = Feature.fromPayload(res.topics[0], this.formBuilder);
          this.featureService.currentFeature = this.feature;
          this.reloadCurrentArticles();
         });
    } else {
      this.feature = this.featureService.currentFeature;
      this.feature.loadForm(this.formBuilder);
    }
  }
  ngOnDestroy(){
    if(this._subs) {
      this._subs.unsubscribe();
    }
  }
  save(){
    this.featureService.put(this.feature.id, this.feature.payload, 'info').then( res => {
      this.type = 'success';
      this.msg = 'Feature info saved';
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to save info';
    });
  }
  updateBody(){
    this.featureService.put(this.feature.id, {body: this.feature.body}, 'body').then( res => {
      this.type = 'success';
      this.msg = 'Feature content saved';
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to save content';
    });
  }
  publish( state ) {
    this.featureService.put(this.feature.id, {}, 'publish?' + (state ? 'true' : 'false')).then( res => {
      this.type = 'success';
      this.msg = `Feature ${!state ? 'un' : ''}published`;
      this.feature.published = !!state;
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to save content';
    });
  }
  resetAlert(){
    this.alert = null;
  }
  onTagChanged( tags ){
    this.featureService.put( this.feature.id, {tags: tags}, 'tags' ).then( res => {
      console.log(res);
    })
  }
  search( text$ ){
    return text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : articles.filter(v => new RegExp(term, 'gi').test(v.title)).slice(0, 10));
  }
  selectItem(event) {
    const item = event.item;
    let articles = this.feature.articles;
    articles.add( item._id );
    this.featureService.put( this.feature.id, {articles: Array.from(articles)}, 'articles').then( res => {
      this.type = 'success';
      this.msg = 'Articles saved';
      this.feature.articles = articles;
      this.reloadCurrentArticles();
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to save articles';
    });
  }
  removeItem(id){
    let articles = this.feature.articles;
    articles.delete( id );
    this.featureService.put( this.feature.id, {articles: Array.from(articles)}, 'articles').then( res => {
      this.type = 'success';
      this.msg = 'Article removed';
      this.feature.articles = articles;
      this.reloadCurrentArticles();
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to remove article';
    });
  }
  reloadCurrentArticles(){
    let arr = Array.from( this.feature.articles ); console.log( arr, this.articles );
    this.currentArticles = articles.filter( art => arr.indexOf( art._id) !== -1 );
  }
}