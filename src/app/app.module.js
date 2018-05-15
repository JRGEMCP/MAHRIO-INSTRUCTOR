import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
// //import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule, TabsModule, AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { HeaderModule } from 'mahrio-header/src/header.module';
//
import { MarkdownModule } from 'ngx-markdown';
//
import { AppRoutingModule } from './app.routing.js';
import { MainPage } from './main/main.page';

import { ListMyFeaturesComponent } from './pages/features-list-mine/list-my-features.component';
import { CreateMyFeatureComponent } from './pages/features-create-mine/create-my-feature.component';
import { EditMyFeatureComponent } from './pages/features-edit-mine/edit-my-feature.component';
import { CreateFeatureComponent } from './components/create-feature/create-feature.component';
import { FeatureArticlesComponent } from './components/feature-articles/feature-articles.component';
import { FeatureBodyComponent } from './components/feature-body/feature-body.component';
import { FeaturePublishComponent } from './components/feature-publish/feature-publish.component';
import { FeatureInfoComponent } from './components/feature-info/feature-info.component';

import { ListMyProductsComponent } from './pages/products-list-mine/list-my-products.component';
import { UpdateMyProductsComponent } from './pages/products-update-mine-form/update-my-products.component'
import { ProductFeaturesComponent } from './components/product-features/product-features.component';
import { ProductPreviewComponent } from './components/product-preview/product-preview.component';
import { ProductBodyComponent } from './components/product-body/product-body.component';

import { CreateMyCourseComponent } from './pages/courses-create-mine/create-my-course.component';
import { EditMyCourseComponent } from './pages/courses-edit-mine/edit-my-course.component';
import { ListMyCoursesComponent } from './pages/courses-list-mine/list-my-courses.component';
import { CourseInfoComponent } from './components/course-info/course-info.component';
import { CourseModulesComponent } from './components/course-modules/course-modules.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { CoursePublishComponent } from './components/course-publish/course-publish.component';


//import { Components } from './components';

// @NgModule({
//   declarations: [
//     MainPage,
//     ...Pages,
//     ...Components,
//   ],
//   imports: [
//     // Angular 2 related modules
//     BrowserModule,
//     FormsModule,
//     ReactiveFormsModule,
//     HttpModule,
//
//     HeaderModule.forRoot(),
//
//     CollapseModule.forRoot(),
//     MarkdownModule.forRoot(),
//     // Put this one last to avoid the 404 route capturing all requests
//     AppRoutingModule,
//   ],
//   bootstrap: [
//     MainPage
//   ]
// })
@NgModule({
  declarations: [
    MainPage,

    ListMyFeaturesComponent,
    CreateMyFeatureComponent,
    CreateFeatureComponent,
    FeatureInfoComponent,
    FeatureBodyComponent,
    FeatureArticlesComponent,
    FeaturePublishComponent,
    EditMyFeatureComponent,

    ListMyProductsComponent,
    UpdateMyProductsComponent,
    ProductFeaturesComponent,
    ProductPreviewComponent,
    ProductBodyComponent,

    ListMyCoursesComponent,
    CreateMyCourseComponent,
    EditMyCourseComponent,
    CourseInfoComponent,
    CourseModulesComponent,
    CreateCourseComponent,
    CoursePublishComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    HeaderModule.forRoot(),
    MarkdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    TypeaheadModule.forRoot(),
    AppRoutingModule
  ]
})
export class InstructorModule { }
