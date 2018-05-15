import { Component } from "@angular/core";
import { CategoryService, PaginationService } from 'mahrio-header/src/services';
import { Product } from 'mahrio-header/src/models';
import template from './list-my-products.template.html';
import style from './list-my-products.style.scss';

@Component({
  selector: 'list-my-products',
  template,
  styles: [style]
})

export class ListMyProductsComponent {
  static get parameters(){
    return [CategoryService, PaginationService];
  }
  constructor ( productService, PaginationService ){
    this.productService = productService;
    this.pagingService = PaginationService;
    this.products = [];
  }

  ngOnInit() {
    this._subs = this.productService.token
      .flatMap( token => this.productService.list('all', true, token) )
      .catch( () => {
        //
      })
      .subscribe( res => {
        res.categories.forEach( (product, i) => {
          this.products.push( Product.fromPayload(product) );
        });
        this.pagingService.items = this.products;
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
