import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../../app/modules/app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { ShoppingCartComponent } from 'src/app/pages/shopping-cart/shopping-cart.component';

export const CURRENT_ROUTES: Routes = [
  { path: 'shopping-cart', component: ShoppingCartComponent},  
  { path: '', redirectTo: 'shopping-cart', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class ShoppingCartModule { }