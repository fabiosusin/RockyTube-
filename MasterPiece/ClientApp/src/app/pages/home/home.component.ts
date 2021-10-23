import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models/product/product';
import { ApiService } from 'src/shared/services/api.service';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../base/base-edit.component';
import { ProductCategoryOutput } from 'src/models/category/product-category-output';
import { CartComponent } from 'src/app/cache/cart.component';
import { UserService } from 'src/shared/services/user.service';
import { ProducstService } from 'src/shared/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends BaseEdit<Product> implements OnInit {
  constructor(
    protected cartService: CartComponent,
    protected userService: UserService,
    protected producstService: ProducstService,
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils) {
    super(router, utils);
  }

  products = Array<Product>();
  categories = Array<ProductCategoryOutput>();

  async ngOnInit(): Promise<void> {
    await this.getProducts();
    await this.getCategories();
  }

  async getProducts() {
    try {
      this.isLoading = true;
      this.products = await this.producstService.getProducts({
        limit: 8
      });

    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  async getCategories() {
    try {
      this.isLoading = true;
      this.categories = await this.producstService.getCategories()
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  addToCart = (product: Product) => this.producstService.addToCart(product)

  buyProduct = (product: Product) => this.producstService.buyProduct(product);

  onClickFilterProductsByCategory = (categoryId: string) => this.router.navigateByUrl('/products-list', { state: { categoryId: categoryId } });

}
