import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  //Admin
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

  //Home 
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },

  //Login
  { path: 'login', loadChildren: () => import('./login/login-screen.module').then(m => m.LoginScreenModule) },
  { path: 'register', loadChildren: () => import('./register/register-screen.module').then(m => m.RegisterScreenModule) },
  { path: 'register/:id', loadChildren: () => import('./register/register-screen.module').then(m => m.RegisterScreenModule) },
  { path: 'movies', loadChildren: () => import('./movies-register/movies-register.module').then(m => m.MoviesRegisterModule) },

  //Listagens
  { path: 'movies-list', loadChildren: () => import('./movies-list/movies-list.module').then(m => m.ProductsListModule) },
  { path: 'user-movies', loadChildren: () => import('./user-movies/user-movies.module').then(m => m.UserMoviesModule) }
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }