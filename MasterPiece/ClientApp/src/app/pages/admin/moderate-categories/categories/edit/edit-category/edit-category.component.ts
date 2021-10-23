import { CategoryMigrationInput } from './../../../../../../../models/category/category-migration-input';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEdit } from 'src/app/pages/base/base-edit.component';
import { Category } from 'src/models/category/category';
import { ApiService } from 'src/shared/services/api.service';
import { Utils } from 'src/shared/utils';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent extends BaseEdit<Category> implements OnInit {
  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils,
    protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder) {
    super(router, utils);
  }

  categories: Array<Category>;
  formMigrationCategory: FormGroup;
  migrationCategoryInput: CategoryMigrationInput = new CategoryMigrationInput();
  category: Category = new Category();

  migrateCategoryActivated = () => this.formMigrationCategory.get('migrate').value;
  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.category = await this.apiService.getCategory(id);
      this.migrationCategoryInput.oldCategoryId = this.category ? this.category.id : null;;
      await this.getCategories();
    }
    this.assignForm();
  }

  async getCategories() {
    this.categories = await this.apiService.categories();
    if (this.category && this.category.name && this.categories && this.categories.length)
      this.categories = this.categories.filter(x => x.name != this.category.name)
  }

  assignForm = async () => {
    this.form = this.formBuilder.group({
      name: [this.category.name, [Validators.required]],
      id: [this.category.id]
    });

    this.formMigrationCategory = this.formBuilder.group({
      migrate: [this.migrationCategoryInput.migrate],
      oldCategoryId: [this.migrationCategoryInput.oldCategoryId],
      newCategoryName: [this.migrationCategoryInput.newCategoryName, [Validators.required]]
    });
  };

  errors = () => {
    const invalidFields: string[] = [];

    if (this.migrationCategoryInput.migrate) {
      if (this.migrationCategoryInput.newCategoryId)
        invalidFields.push('Nova Categoria')
    } else {
      if (!this.category.name)
        invalidFields.push('Nome')
    }
    super.showValidationsError(invalidFields, 'Os campos devem ser informados');
  }

  onSubmit = async (category: Category) => {
    if (this.migrateCategoryActivated()) {
      this.migrateCategory(this.formMigrationCategory.value);
      return;
    }

    if (await this.inValidateForm()) {
      this.errors();
      return;
    }

    try {
      this.isLoading = true;
      await this.apiService.saveCategory(category);
      this.router.navigate(['/admin/categories']);
    }
    catch (e) {
      this.utils.errorMessage(e)
    }
    finally {
      this.isLoading = false;
    }
  }

  migrateCategory = async (migration: CategoryMigrationInput) => {

    if (!this.formMigrationCategory.valid) {
      this.errors();
      return;
    }

    try {
      this.isLoading = true;
      const newCategory = this.categories.find(x => x.name = migration.newCategoryName)
      migration.newCategoryId = newCategory ? newCategory.id : null;
      await this.apiService.migrateCategory(migration)
      this.router.navigate(['/admin/categories']);
    }
    catch (e) {
      this.utils.errorMessage(e)
    }
    finally {
      this.isLoading = false;
    }
  }

}
