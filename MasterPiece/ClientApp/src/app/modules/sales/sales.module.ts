import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from 'src/app/pages/sales/sales.component';

export const CURRENT_ROUTES: Routes = [
  { path: '', component: SalesComponent}
];

@NgModule({
  declarations: [
    SalesComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class SalesModule { }