import { Component } from "@angular/core";
import { CourseService, PaginationService } from 'mahrio-header/src/services';
import { Course } from 'mahrio-header/src/models';
import template from './list-my-courses.template.html';
import style from './list-my-courses.style.scss';

@Component({
  selector: 'list-my-features',
  template,
  styles: [style]
})

export class ListMyCoursesComponent {
  static get parameters(){
    return [CourseService, PaginationService];
  }
  constructor ( courseService, PaginationService ){
    this.courseService = courseService;
    this.pagingService = PaginationService;
    this.features = [];
  }

  ngOnInit() {
    this._subs = this.courseService.token
      .flatMap( token => this.courseService.list('all', true, token) )
      .catch( () => {
        //
      })
      .subscribe( res => {
        res.topics.forEach( (feature, i) => {
          this.features.push( Feature.fromPayload(feature) );
        });
        this.pagingService.items = this.features;
        this.pagingService.setPage(0);

        this.loaded = true;
      });
  }
  ngOnDestroy(){

  }
}
