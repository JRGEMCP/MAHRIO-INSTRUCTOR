import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomePage, FourOhFourPage,
  ListMyFeaturesComponent,
  CreateMyFeatureComponent,
  EditMyFeatureComponent,
  ListMyProductsComponent,
  ListMyCoursesComponent,
} from './pages';

const Routes = [
  { path: '', component: HomePage},
  { path: 'features', component: ListMyFeaturesComponent},
  { path: 'features/new', component: CreateMyFeatureComponent},
  { path: 'features/:id/:section', component: EditMyFeatureComponent},
  { path: 'products', component: ListMyFeaturesComponent},
  { path: 'courses', component: ListMyFeaturesComponent},
  { path: '**', component: FourOhFourPage, pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(Routes) ],
  exports: [ RouterModule ],
})
export class AppRoutingModule { }

