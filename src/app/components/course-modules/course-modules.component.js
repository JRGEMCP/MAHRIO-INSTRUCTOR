import { Component, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CourseService, ModuleService } from 'mahrio-header/src/services';
import { Module } from 'mahrio-header/src/models';
import template from './course-modules.template.html';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

var articles = [];
var features = [];
var products = [];
@Component({
  selector: 'course-modules',
  template,
  inputs: ['course', 'articles', 'features'],
  outputs: ['callback']
})

export class CourseModulesComponent {
  static get parameters(){
    return [CourseService, ModuleService, FormBuilder];
  }

  constructor(CourseService, ModuleService, FormBuilder){
    this.courseService = CourseService;
    this.moduleService = ModuleService;
    this.module = new Module(null, FormBuilder);
    this.formBuilder = FormBuilder;
    this.callback = new EventEmitter();
    this.articleSelected;
    this.featureSelected;
    this.searchArticles = Observable.create((observer) => {
      observer.next(this.articleSelected);
    }).mergeMap((token) => this.getArticlesAsObservable(token));
    this.searchFeatures = Observable.create((observer) => {
      observer.next(this.featureSelected);
    }).mergeMap((token) => this.getFeaturesAsObservable(token));
  }
  ngOnChanges(changes){
    if( changes.course && changes.course.currentValue ){
      this.course = changes.course.currentValue;
      this.module = new Module(this.course.id, this.formBuilder);
    }
    if( changes.articles && changes.articles.currentValue ){
      articles = changes.articles.currentValue;
    }
    if( changes.features && changes.features.currentValue ){
      features = changes.features.currentValue;
      console.log(features);
    }
    if( changes.products && changes.products.currentValue ){
      products = changes.products.currentValue;
    }
  }

  save(){
    this.courseService.put(this.course.id, this.course.payload, 'info').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Course info saved',
        change: 'edit',
        value: this.course.payload
      });
    }, err => {
      this.callback.emit({
        type: 'danger',
        msg: 'Unable to save info'
      });
    });
  }
  updateBody(){

  }
  updateTitle(){
    this.courseService.put(this.course.id, {modules: Array.from(modules)}, 'articles').then(res => {
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

  getArticlesAsObservable(token) {
    let query = new RegExp(token, 'ig');

    return Observable.of(
      articles.filter((state) => {
        return query.test(state.title);
      })
    );
  }

  getFeaturesAsObservable(token) {
    let query = new RegExp(token, 'ig');

    return Observable.of(
      features.filter((state) => {
        return query.test(state.title);
      })
    );
  }
  selectItem(module, type, event) {
    const item = event.item;
    var updateObj = {};
    switch(type){
      case 'articles':
        updateObj['articles'] = module.articles.map( art => art.id);
        updateObj['articles'].push(item._id);
        break;
      case 'features':
        updateObj['features'] = module.features.map( feat => feat.id);
        updateObj['features'].push(item._id);
        break;
      case 'products':
        updateObj['products'] = [];
        break;
      default:
        return;
    }
    this.moduleService.put(module.id, updateObj, type).then( res => {
      console.log('Added Article');
      this.callback.emit({
        type: 'success',
        msg: type == 'articles' ? 'Article added' : 'Feature added',
        action: type == 'articles' ? 'add-article' : 'add-feature',
        item: item,
        moduleId: module.id
      });
      let art = document.getElementsByClassName('articles');
      let fea = document.getElementsByClassName('features');
      for(var y=0; y < art.length; y++){ art[y].value = ""; fea[y].value = "";  }
    });
  }

  addModule(){
    this.moduleService.post(this.module.payload).then( res => {
      this.module.loadForm( this.formBuilder);
      this.course.addModule( Module.fromPayload(res.module, this.formBuilder ) );
    })
  }
  removeModule(id){
    this.moduleService.remove(id, this.course.id).then( res => {
      this.course.removeModule( id );
    });
  }
  removeArticle(module, articleId){
    let i = module.articles.map(a => a.id).indexOf( articleId );
    module.articles.splice(i, 1);
    this.moduleService.put(module.id, {articles: module.articles.map(a => a._id)}, 'articles').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Article removed',
        action: 'remove-article'
      });
    });
  }
  bumpArticleUp(i, module, article){
    module.articles.splice(i, 1);
    module.articles.splice(i-1, 0, article);
    this.moduleService.put(module.id, {articles: module.articles.map(a => a._id)}, 'articles')
  }
  bumpArticleDown(i, module, article){
    module.articles.splice(i, 1);
    module.articles.splice(i+1, 0, article);
    this.moduleService.put(module.id, {articles: module.articles.map(a => a._id)}, 'articles')
  }
  bumpFeatureUp(i, module, feature){
    module.features.splice(i, 1);
    module.features.splice(i-1, 0, feature);
    this.moduleService.put(module.id, {features: module.features.map(a => a._id)}, 'features')
  }
  bumpFeatureDown(i, module, feature){
    module.features.splice(i, 1);
    module.features.splice(i+1, 0, features);
    this.moduleService.put(module.id, {features: module.features.map(a => a._id)}, 'features')
  }
  removeFeature(module, featureId){
    let i = module.features.map(a => a.id).indexOf( featureId );
    module.features.splice(i, 1);
    this.moduleService.put(module.id, {features: module.features.map(a => a._id)}, 'features').then( res => {
      this.callback.emit({
        type: 'success',
        msg: 'Feature removed',
        action: 'remove-feature'
      });
    });
  }
}