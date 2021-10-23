import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FiltersProduct } from 'src/models/product/filters-product';
import { Router } from "@angular/router";
import { Product } from "src/models/product/product";
import { ApiService } from "src/shared/services/api.service";
import { Utils } from "src/shared/utils";
import { BaseEdit } from "../../pages/base/base-edit.component";
import { CartComponent } from "src/app/cache/cart.component";
import { UserService } from "src/shared/services/user.service";
import { ProductCategoryOutput } from "src/models/category/product-category-output";
import { ProducstService } from "src/shared/services/products.service";


@Component({
  selector: 'app-products-list-component',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})

export class ProductListComponent extends BaseEdit<Product> implements OnInit {
  products: Array<Product>;
  filters: FiltersProduct = new FiltersProduct();
  categories = Array<ProductCategoryOutput>();


  constructor(
    protected apiService: ApiService,
    protected cartService: CartComponent,
    protected producstService: ProducstService,
    protected userService: UserService,
    protected router: Router,
    protected utils: Utils) {
    super(router, utils);
  }
  ngOnInit(): void {
    if(this.dataReceived){
      this.filters.productName = this.dataReceived.productName;
      this.filters.categoryId = this.dataReceived.categoryId;
    }
    this.filters.page = 1;
    this.filters.limit = 25;
    this.getProducts();
    this.getCategories();
  }

  async getCategories() {
    try {
      this.isLoading = true
      this.categories = await this.producstService.getCategories();
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  addToCart = (product: Product) => this.producstService.addToCart(product);

  getProducts = async () => {
    try {
      this.isLoading = true
      this.products = await this.producstService.getProducts(this.filters);
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

  onClickFilterProductsByCategory = (categoryId: string) => this.router.navigateByUrl('/products-list', { state: { categoryId: categoryId } });
}
