import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CourseService } from 'mahrio-header/src/services';
import { Course } from 'mahrio-header/src/models';

import template from './create-my-course.template.html';

@Component({
  selector: 'create-my-course',
  template
})

export class CreateMyCourseComponent {
  static get parameters(){
    return [Router, CourseService, FormBuilder];
  }
  constructor( router, course, formBuilder){
    this.router = router;
    this.courseService = course;
    this.course = new Course( formBuilder );
  }
  save(){
    this.courseService.post(this.course.payload).then( res => {
      this.courseService.currentCourse = Course.fromPayload( res.course );
      this.router.navigate(['/', 'courses', res.course._id, 'edit']);
    }, err => {

    });
  }
}