import { UsersComponent } from './../../pages/admin/moderate-users/users.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../app-common.module';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from 'src/app/pages/admin/moderate-categories/categories/categories.component';
import { EditCategoryComponent } from 'src/app/pages/admin/moderate-categories/categories/edit/edit-category/edit-category.component';


export const CURRENT_ROUTES: Routes = [
  { path: '', component: UsersComponent, pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'categories/edit', component: EditCategoryComponent },
  { path: 'categories/edit/:id', component: EditCategoryComponent },
];

@NgModule({
  declarations: [
    UsersComponent,
    CategoriesComponent,
    EditCategoryComponent
  ],
  imports: [
    CommonModule,
    AppCommonModule,
    RouterModule.forChild(CURRENT_ROUTES),
  ]
})
export class AdminModule { }