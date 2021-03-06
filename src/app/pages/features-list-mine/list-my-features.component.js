import { Component } from "@angular/core";
import { TopicService, PaginationService } from 'mahrio-header/src/services';
import { Feature } from 'mahrio-header/src/models';
import template from './list-my-features.template.html';
import style from './list-my-features.style.scss';

@Component({
  selector: 'list-my-features',
  template,
  styles: [style]
})

export class ListMyFeaturesComponent {
  static get parameters(){
    return [TopicService, PaginationService];
  }
  constructor ( featureService, PaginationService ){
    this.featureService = featureService;
    this.pagingService = PaginationService;
    this.features = [];
  }

  ngOnInit() {
    this._subs = this.featureService.token
      .flatMap( token => this.featureService.list('all', true, token) )
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
  // PAGINATION
  change($event){
    switch($event.type){
      case 'first':
        this.pagingService.first();
        break;
      case 'prev':
        this.pagingService.prev();
        break;
      case 'next':
        this.pagingService.next();
        break;
      case 'last':
        this.pagingService.last();
        break;
      case 'page':
        this.pagingService.setPage( $event.num );
    }
  }
}
