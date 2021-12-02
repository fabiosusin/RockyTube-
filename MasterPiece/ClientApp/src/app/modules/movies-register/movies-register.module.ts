import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { MoviesRegisterComponent } from 'src/app/pages/movies-register/movies-register.component';

export const CURRENT_ROUTES: Routes = [
  { path: '', component: MoviesRegisterComponent},
  { path: '/:id', component: MoviesRegisterComponent},
];

@NgModule({
  declarations: [
    MoviesRegisterComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class MoviesRegisterModule { }