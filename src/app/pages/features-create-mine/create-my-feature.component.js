import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { TopicService } from 'mahrio-header/src/services';
import { Feature } from 'mahrio-header/src/models';

import template from './create-my-feature.template.html';

@Component({
  selector: 'create-my-feature',
  template
})

export class CreateMyFeatureComponent {
  static get parameters(){
    return [Router, TopicService, FormBuilder];
  }
  constructor( router, feature, formBuilder){
    this.router = router;
    this.featureService = feature;
    this.feature = new Feature( formBuilder );
  }
  save(){
    this.featureService.post(this.feature.payload).then( res => {
      this.featureService.currentFeature = Feature.fromPayload( res.topic );
      this.router.navigate(['/', 'instructor', 'features', res.topic._id, 'edit']);
    }, err => {

    });
  }
}