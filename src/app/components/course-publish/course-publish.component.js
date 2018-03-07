import { Component, EventEmitter } from '@angular/core';
import { CourseService } from 'mahrio-header/src/services';
import template from './course-publish.template.html';

@Component({
  selector: 'course-publish',
  template,
  styles: [],
  inputs: ['course'],
  outputs: ['callback']
})

export class CoursePublishComponent {
  static get parameters(){
    return [CourseService];
  }

  constructor(CourseService){
    this.courseService = CourseService;
    this.callback = new EventEmitter();
  }

  publish( state ) {
    this.courseService.put(this.course.id, {}, 'publish?' + (state ? 'true' : 'false')).then( res => {
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