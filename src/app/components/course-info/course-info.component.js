import { Component, EventEmitter } from '@angular/core';
import { CourseService } from 'mahrio-header/src/services';
import template from './course-info.template.html';

@Component({
  selector: 'course-info',
  template,
  inputs: ['course'],
  outputs: ['callback']
})

export class CourseInfoComponent {
  static get parameters(){
    return [CourseService];
  }

  constructor(CourseService){
    this.courseService = CourseService;
    this.callback = new EventEmitter();
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
}