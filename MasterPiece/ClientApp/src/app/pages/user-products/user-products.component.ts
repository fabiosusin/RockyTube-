import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FiltersProduct } from 'src/models/product/filters-product';
import { Router } from "@angular/router";
import { Product } from "src/models/product/product";
import { ApiService } from "src/shared/services/api.service";
import { Utils } from "src/shared/utils";
import { BaseEdit } from "../base/base-edit.component";
import { CartComponent } from "src/app/cache/cart.component";
import { UserService } from "src/shared/services/user.service";
import { ProductCategoryOutput } from "src/models/category/product-category-output";
import { LoggedUserService } from "src/app/cache/loggedUser.component";
import { ProducstService } from "src/shared/services/products.service";


@Component({
  selector: 'app-user-products-component',
  templateUrl: './user-products.component.html',
  styleUrls: ['./user-products.component.scss']
})

export class UserProductsComponent extends BaseEdit<Product> implements OnInit {
  products: Array<Product>;
  filters: FiltersProduct = new FiltersProduct();


  constructor(
    protected apiService: ApiService,
    protected cartService: CartComponent,
    protected loggedUserService: LoggedUserService,
    protected producstService: ProducstService,
    protected router: Router,
    protected utils: Utils) {
    super(router, utils);
  }
  ngOnInit(): void {
    this.filters.page = 1;
    this.filters.limit = 25;
    this.getProducts();
  }

  getProducts = async () => {
    try {
      this.isLoading = true;
      const loggedUser = this.loggedUserService.getLoggedUser();
      if (!loggedUser)
        return;

      this.filters.userId = loggedUser.user ? loggedUser.user.id : '';
      if (!this.filters.userId)
        return;

      this.products = await this.producstService.getProducts(this.filters);
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  deleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir o produto?'))
      return;
    try {
      this.isLoading = true;
      await this.apiService.deleteProduct(id);
      this.utils.successMessage('Produto excluído com sucesso!')
      this.getProducts();
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  decrementPage = () => {
    this.filters.page--;
    this.changePage();
  }
  incrementPage = () => {
    this.filters.page++;
    this.changePage();
  }

  changePage = () => {
    if (!this.filters.page || typeof this.filters.page != 'number')
      this.filters.page = 1.

    this.getProducts();
  }
}
