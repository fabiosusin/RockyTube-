import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../../app/modules/app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from 'src/app/pages/products-list/products-list.component';

export const CURRENT_ROUTES: Routes = [
  { path: 'products-list', component: ProductListComponent},  
  { path: '', redirectTo: 'products-list', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    ProductListComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class ProductsListModule { }