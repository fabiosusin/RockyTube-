import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../../app/modules/app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { UserProductsComponent } from 'src/app/pages/user-products/user-products.component';

export const CURRENT_ROUTES: Routes = [
  { path: '', component: UserProductsComponent, pathMatch: 'full' },
  { path: 'list', component: UserProductsComponent },
];

@NgModule({
  declarations: [
    UserProductsComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class UserProductsModule { }