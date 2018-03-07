import { Component } from "@angular/core";
import { CourseService, PaginationService } from 'mahrio-header/src/services';
import { Course } from 'mahrio-header/src/models';
import template from './list-my-courses.template.html';
import style from './list-my-courses.style.scss';

@Component({
  selector: 'list-my-courses',
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
    this.courses = [];
  }

  ngOnInit() {
    this._subs = this.courseService.token
      .flatMap( token => this.courseService.list('all', true, token) )
      .catch( () => {
        //
      })
      .subscribe( res => {
        res.courses.forEach( (course, i) => {
          this.courses.push( Course.fromPayload(course) );
        });
        this.pagingService.items = this.courses;
        this.pagingService.setPage(0);

        this.loaded = true;
      });
  }
  ngOnDestroy(){

  }
}
