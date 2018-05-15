import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainPage } from './main/main.page';
import { HomePage, FourOhFourPage,
  ListMyFeaturesComponent,
  CreateMyFeatureComponent,
  CreateMyCourseComponent,
  EditMyFeatureComponent,
  EditMyCourseComponent,
  ListMyProductsComponent,
  UpdateMyProductsComponent,
  ListMyCoursesComponent,
} from './pages';

const Routes = [
  {
    path: 'instructor',
    component: MainPage,
    children: [
      { path: 'features', component: ListMyFeaturesComponent},
      { path: 'features/new', component: CreateMyFeatureComponent},
      { path: 'features/:id/:section', component: EditMyFeatureComponent},
      { path: 'products', component: ListMyProductsComponent},
      { path: 'products/:id', component: UpdateMyProductsComponent},
      { path: 'courses', component: ListMyCoursesComponent},
      { path: 'courses/new', component: CreateMyCourseComponent},
      { path: 'courses/:id/:section', component: EditMyCourseComponent},
      // { path: '**', component: FourOhFourPage, pathMatch: 'full' }
    ]},
];

@NgModule({
  imports: [ RouterModule.forRoot(Routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }

