import { FiltersCategory } from './../../../../../models/category/filters-category';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseEdit } from 'src/app/pages/base/base-edit.component';
import { Category } from 'src/models/category/category';
import { User } from 'src/models/register-login/user';
import { ApiService } from 'src/shared/services/api.service';
import { Utils } from 'src/shared/utils';
import { MoviesService } from 'src/shared/services/products.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent extends BaseEdit<Category> implements OnInit {
  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils,
    protected moviesService: MoviesService,
    protected formBuilder: FormBuilder) {
    super(router, utils);
  }

  editRoute: string = '/admin/categories/edit/';
  filter: FiltersCategory = new FiltersCategory();
  displayedColumns: string[] = ['name', 'itemsQuantity', 'soldItemsQuantity', 'edit'];
  dataSource = Array<User>();

  ngOnInit() {
    this.assignForm();
    this.getCategories(new FiltersCategory());
  }

  assignForm = async () => {
    this.form = this.formBuilder.group({
      name: [this.filter.name],
      minItems: [this.filter.MinItems],
      minSoldItems: [this.filter.MinSoldItems]
    });
  };

  getCategories = async (filter: FiltersCategory) => {
    filter.hasValidProducts = false;
    this.dataSource = await this.moviesService.getCategories(filter);
  }

  formatLabelSlider = (value: number) => value >= 1000 ? Math.round(value / 1000) : value;

}