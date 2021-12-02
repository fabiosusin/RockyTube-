import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { UserMoviesComponent } from 'src/app/pages/user-movies/user-movies.component';

export const CURRENT_ROUTES: Routes = [
  { path: '', component: UserMoviesComponent, pathMatch: 'full' },
  { path: 'list', component: UserMoviesComponent },
];

@NgModule({
  declarations: [
    UserMoviesComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class UserMoviesModule { }