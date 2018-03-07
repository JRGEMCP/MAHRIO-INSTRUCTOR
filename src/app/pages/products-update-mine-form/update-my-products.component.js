import { Component } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CategoryService } from 'mahrio-header/src/services';
import { Product } from 'mahrio-header/src/models';
import template from './update-my-products.template.html';
import style from './update-my-products.style.scss';

@Component({
  selector: 'update-my-products',
  template,
  styles: [style]
})

export class UpdateMyProductsComponent {
  static get parameters(){
    return [ActivatedRoute, CategoryService, FormBuilder];
  }
  constructor( route, product, formBuilder){
    this.route = route;
    this.productService = product;
    this.product = new Product( formBuilder );
    this.formBuilder = formBuilder;
  }
  ngOnInit(){
    if( this.route.params.value.id !== 'new' ) {
      this.state = 'info';
      if( !this.productService.currentProduct ) {
        this._subs = this.productService.token
          .flatMap( token => this.productService.list(this.route.params.value.id, true) )
          .catch( () => { console.log('catcheeed') })
          .subscribe( res => {
            this.product = Product.fromPayload(res.categories[0], this.formBuilder);
            this.productService.currentProduct = this.product;
          });
      } else {
        this.product = this.productService.currentProduct;
        this.product.loadForm(this.formBuilder);
      }
    } else {
      this.state = 'new';
    }
  }
  save(){
    this.productService.post(this.product.payload).then( res => {
      this.productService.currentProduct = Product.fromPayload( res.category );
      this.product = this.productService.currentProduct;
      this.router.navigate(['/', 'products', res.product._id]);
      this.state = 'edit';
      //reload page
      this.type = 'success';
      this.msg = 'Product saved';
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to save info';
    });
  }
  update(){
    this.productService.put(this.product.id, this.product.payload, this.state).then( res => {
      this.type = 'success';
      this.msg = 'Product updated';
    }, err => {
      this.type = 'danger';
      this.msg = 'Unable to update info';
    });
  }
}
