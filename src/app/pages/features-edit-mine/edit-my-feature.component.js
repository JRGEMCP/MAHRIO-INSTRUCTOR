import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TopicService, ArticleService } from 'mahrio-header/src/services';
import { Feature } from 'mahrio-header/src/models';

import template from './edit-my-feature.template.html';

@Component({
  selector: 'edit-my-feature',
  template
})


export class EditMyFeatureComponent {
  static get parameters(){
    return [ActivatedRoute, TopicService, ArticleService, FormBuilder];
  }
  constructor( route, featureService, articleService, formBuilder ){
    this.route = route;
    this.featureService = featureService;
    this.feature = new Feature(formBuilder);
    this.formBuilder = formBuilder;
    this.state = 'edit';
    this.articlesService = articleService;
    this.articles = [];
  }
  ngOnInit(){
    switch(this.route.params.value.section){
      case 'articles':
      case 'body':
      case 'publish':
        this.state = this.route.params.value.section;
        break;
      default:
        this.state = 'edit';
    }

    if( !this.featureService.currentFeature ) {
      this._subs = this.featureService.token
        .flatMap( token => this.featureService.list(this.route.params.value.id, true) )
        .catch( () => { console.log('catcheeed') })
        .subscribe( res => {
          this.feature = Feature.fromPayload(res.topics[0], this.formBuilder);
          this.featureService.currentFeature = this.feature;
          this.loadCurrentArticles();
         });
    } else {
      this.feature = this.featureService.currentFeature;
      this.feature.loadForm(this.formBuilder);
      this.loadCurrentArticles();
    }
  }
  loadCurrentArticles(){
    this.articlesService.getPublished()
      .subscribe( res => {
        this.articles = res.articles;
        let arr = Array.from( this.feature.articles );
        this.feature.currentArticles = this.articles.filter( art => arr.indexOf( art._id) !== -1 );
      });
  }
  ngOnDestroy(){
    if(this._subs) {
      this._subs.unsubscribe();
    }
  }

  callback(obj){
    this.type = obj.type;
    this.msg = obj.msg;
    if( obj.articles ) {
      this.feature.articles = obj.articles;
      let arr = Array.from( this.feature.articles );
      this.feature.currentArticles = this.articles.filter( art => arr.indexOf( art._id) !== -1 );
    }
  }
}