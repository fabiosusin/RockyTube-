import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../../../app/modules/app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { RegisterScreenComponent } from 'src/app/pages/register-screen/register-screen.component';

export const CURRENT_ROUTES: Routes = [
  { path: '', component: RegisterScreenComponent}
];

@NgModule({
  declarations: [
    RegisterScreenComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class RegisterScreenModule { }