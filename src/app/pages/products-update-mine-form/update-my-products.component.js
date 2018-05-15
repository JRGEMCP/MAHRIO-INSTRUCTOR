import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CategoryService, TopicService } from 'mahrio-header/src/services';
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
    return [ActivatedRoute, Router, CategoryService, TopicService, FormBuilder];
  }
  constructor( route, router, product, feature, formBuilder){
    this.route = route;
    this.router = router;
    this.productService = product;
    this.featureService = feature;
    this.product = new Product( formBuilder );
    this.formBuilder = formBuilder;
    this.features = [];
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
            this.loadFeatures();
          });
      } else {
        this.product = this.productService.currentProduct;
        this.product.loadForm(this.formBuilder);
        this.loadFeatures();
      }
    } else {
      this.state = 'new';
    }
  }
  loadFeatures(){
    this.featureService.getPublished()
      .subscribe( res => {
        this.features = res.topics;
        let arrIds = Array.from( this.product.features );
        this.product.currentFeatures = this.features.filter( art => arrIds.indexOf( art._id) !== -1 );
      });
  }
  save(){
    this.productService.post(this.product.payload).then( res => {
      this.productService.currentProduct = Product.fromPayload( res.category, this.formBuilder );
      this.product = this.productService.currentProduct;
      this.router.navigate(['/', 'instructor', 'products', res.category._id]);
      this.state = 'info';
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
  callback(obj){
    this.type = obj.type;
    this.msg = obj.msg;
    if( obj.type === 'body' ){
      this.product.body
    }
    if( obj.features ) {
      this.product.features = obj.features;
      let arrIds = Array.from( this.product.features );
      this.product.currentFeatures = this.features.filter( feat => arrIds.indexOf( feat._id) !== -1 );
    }
  }
}
