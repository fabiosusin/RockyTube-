import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { MoviesListComponent } from 'src/app/pages/movies-list/movies-list.component';

export const CURRENT_ROUTES: Routes = [
  { path: 'products-list', component: MoviesListComponent},  
  { path: '', redirectTo: 'products-list', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    MoviesListComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class ProductsListModule { }