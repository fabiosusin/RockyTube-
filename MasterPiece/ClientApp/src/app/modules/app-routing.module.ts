import { AdminModule } from './admin/admin.module';
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
  { path: 'products', loadChildren: () => import('./products-register/products-register.module').then(m => m.ProductsRegisterModule) },

  //Carrinho de Compras
  { path: 'shopping-cart', loadChildren: () => import('./shopping-cart/shopping-cart.module').then(m => m.ShoppingCartModule) },

  //Listagens
  { path: 'products-list', loadChildren: () => import('./products-list/products-list.module').then(m => m.ProductsListModule) },
  { path: 'user-products', loadChildren: () => import('./user-products/products-list.module').then(m => m.UserProductsModule) },
  { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule) },


  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }