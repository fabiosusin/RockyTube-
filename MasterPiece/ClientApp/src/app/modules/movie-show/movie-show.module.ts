import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { MovieShowComponent } from 'src/app/pages/movie-show/movie-show.component';


export const CURRENT_ROUTES: Routes = [
  { path: '', component: MovieShowComponent}
];

@NgModule({
  declarations: [
    MovieShowComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class MovieShowModule { }