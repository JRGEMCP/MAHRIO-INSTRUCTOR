import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ArticleService, TopicService, CategoryService, CourseService } from 'mahrio-header/src/services';
import { Course } from 'mahrio-header/src/models';

import template from './edit-my-course.template.html';

@Component({
  selector: 'edit-my-course',
  template
})


export class EditMyCourseComponent {
  static get parameters(){
    return [ActivatedRoute, ArticleService, TopicService, CategoryService, CourseService, FormBuilder];
  }
  constructor( route, articleService, topicService, categoryService, courseService, formBuilder ){
    this.route = route;
    this.articleService = articleService;
    this.featureService = topicService;
    this.productService = categoryService;
    this.courseService = courseService;
    this.course = new Course(formBuilder);
    this.formBuilder = formBuilder;
    this.state = 'edit';

    this.articles = [];
    this.features = [];
    this.products = [];

  }
  ngOnInit(){
    this.loadPublishedArticles();
    this.loadPublishedFeatures();
    switch(this.route.params.value.section){
      case 'A':
      case 'B':
      case 'C':
        this.state = this.route.params.value.section;
        break;
      default:
        this.state = 'edit';
    }

    if( !this.courseService.currentCourse ) {
      this._subs = this.courseService.token
        .flatMap( token => this.courseService.list(this.route.params.value.id, true) )
        .catch( () => { console.log('catcheeed') })
        .subscribe( res => {
          this.course = Course.fromPayload(res.courses[0], this.formBuilder);
          this.courseService.currentCourse = this.course;
         });
    } else {
      this.course = this.courseService.currentCourse;
      this.course.loadForm(this.formBuilder);
    }
  }

  ngOnDestroy(){
    if(this._subs) {
      this._subs.unsubscribe();
    }
  }

  loadPublishedArticles(){
    this.articleService.getPublished()
      .subscribe( res => {
        this.articles = res.articles;
      });
  }
  loadPublishedFeatures(){
    this.featureService.getPublished()
      .subscribe( res => {
        this.features = res.topics;
      });
  }

  callback(obj){
    let i;
    switch(obj.action){
      case 'add-article':
        i = this.course.modules.map( m => m.id).indexOf( obj.moduleId );
        this.course.modules[i].addArticle( obj.item );
        break;
      case 'add-feature':
        i = this.course.modules.map( m => m.id).indexOf( obj.moduleId );
        this.course.modules[i].addFeature( obj.item );
        break;
      case 'add-product':
        i = this.course.modules.map( m => m.id).indexOf( obj.moduleId );
        this.course.modules[i].addProduct( obj.item );
        break;
    }

    this.type = obj.type;
    this.msg = obj.msg;
    // if( obj.type === 'body' ){
    //   this.feature.body
    // }
    // if( obj.articles ) {
    //   this.feature.articles = obj.articles;
    //   let arrIds = Array.from( this.feature.articles );
    //   this.feature.currentArticles = this.articles.filter( art => arrIds.indexOf( art._id) !== -1 );
    // }
  }
}