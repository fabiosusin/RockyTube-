import { LoggedUserModel } from './../../../models/logged-user/logged-user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../base/base-edit.component';
import { Product, ProductType } from 'src/models/product/product';
import { Category } from 'src/models/category/category';
import { LoggedUserService } from 'src/app/cache/loggedUser.component';
import { FiltersCategory } from 'src/models/category/filters-category';

@Component({
  selector: 'app-products-register',
  templateUrl: './products-register.component.html',
  styleUrls: ['./products-register.component.scss']
})
export class ProductsRegisterComponent extends BaseEdit<Product> implements OnInit {
  constructor(
    protected apiService: ApiService,
    protected formBuilder: FormBuilder,
    protected loggedUserService: LoggedUserService,
    protected activatedRoute: ActivatedRoute,
    protected utils: Utils,
    protected router: Router) {
    super(router, utils);
  }

  categories: Array<Category>;
  product: Product = new Product();
  productTypes: {}[] = [
    { value: ProductType.Donation, label: 'Doação' },
    { value: ProductType.ForSale, label: 'Venda' }
  ];

  async ngOnInit(): Promise<void> {
    await this.getCategories();
  }

  ngAfterViewInit(): void {
    const loggedUser = this.loggedUserService.getLoggedUser();
    this.product.userId = loggedUser ? loggedUser.user.id : '';
    this.assignForm();
  }

  getImage = () => this.form.get('auxiliaryProperties.pictureBase64').value;
  getFreeProduct = () => this.form.get('type').value == ProductType.Donation;
  onClickRemoveImage = () => this.form.controls['pictureBase64'].setValue(null)
  assignForm = async () => {
    this.form = this.formBuilder.group({
      userId: [this.product.userId, [Validators.required]],
      name: [this.product.name, [Validators.required]],
      description: [this.product.description, Validators.required],
      type: [this.dataReceived ? this.dataReceived.type : ProductType.Donation, Validators.required],
      price: [this.product.price],
      balance: [this.product.balance],
      auxiliaryProperties: this.formBuilder.group({
        pictureBase64: [this.product.auxiliaryProperties.pictureBase64],
        categoryName: [this.product.auxiliaryProperties.categoryName, Validators.required],
      })
    })
  };

  errors = () => {
    const invalidFields: string[] = [];
    if (!this.product.userId) {
      super.showValidationsError(['Você deve estar logado']);
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product.name)
      invalidFields.push('Nome')
    if (!this.product.description)
      invalidFields.push('Descrição')
    if (!this.product.auxiliaryProperties.categoryName)
      invalidFields.push('Categoria')

    super.showValidationsError(invalidFields, 'Os campos devem ser informados');
  }

  onSubmit = async (product: Product) => {
    if (await this.inValidateForm()) {
      this.errors();
      return;
    }

    try {
      this.isLoading = true;
      await this.apiService.saveProduct(product);
      this.router.navigate(['/home']);
    }
    catch (e) {
      this.utils.errorMessage(e)
    }
    finally {
      this.isLoading = false;
    }
  }

  async getCategories() {
    this.categories = await this.apiService.categories();
  }


  async attachFile(event: any) {
    if (event.target.files.length <= 0) {
      this.utils.errorMessage('Ocorreu um erro ao importar a imagem!');
      return;
    }

    const file = <File>event.target.files[0];
    if (file.size / 1024 / 1024 > 5) { //5MB
      this.utils.warningMessage('O tamanho máximo para os arquivos é de 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        this.form.controls['auxiliaryProperties']['controls']['pictureBase64'].setValue(reader.result.toString());
      } catch (e) {
        this.utils.errorMessage(e);
      }
    };
  }

}
