import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/shared/services/auth-guard.service';

const routes: Routes = [

  //Admin
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },

  //Home 
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuardService]  },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuardService]  },

  //Login
  { path: 'login', loadChildren: () => import('./login/login-screen.module').then(m => m.LoginScreenModule) },
  { path: 'register', loadChildren: () => import('./register/register-screen.module').then(m => m.RegisterScreenModule)  },
  { path: 'register/:id', loadChildren: () => import('./register/register-screen.module').then(m => m.RegisterScreenModule), canActivate: [AuthGuardService]  },
  { path: 'movies', loadChildren: () => import('./movies-register/movies-register.module').then(m => m.MoviesRegisterModule), canActivate: [AuthGuardService]  },

  //Listagens
  { path: 'movies-list', loadChildren: () => import('./movies-list/movies-list.module').then(m => m.ProductsListModule), canActivate: [AuthGuardService]  },
  
  //Gerais
  { path: 'movie-show', loadChildren: () => import('./movie-show/movie-show.module').then(m => m.MovieShowModule), canActivate: [AuthGuardService]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }