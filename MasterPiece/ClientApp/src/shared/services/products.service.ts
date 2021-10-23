import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CartComponent } from "src/app/cache/cart.component";
import { FiltersCategory } from "src/models/category/filters-category";
import { FiltersProduct } from "src/models/product/filters-product";
import { Product } from "src/models/product/product";
import { Utils } from "../utils";
import { ApiService } from './api.service';
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class ProducstService {
  constructor(
    protected userService: UserService,
    protected cartService: CartComponent,
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils) {
  }


  getProducts = async (filters?: FiltersProduct) => await this.apiService.listProduct(filters);

  getCategories = async (filters?: FiltersCategory) => await this.apiService.listCategories(filters)

  addToCart(product: Product) {
    this.cartService.setShoppingCartNewItem(product);
    this.userService.changeShoppingCartAmount();
    this.utils.successMessage('Produto adicionado ao carrinho')
  }

  buyProduct = (product: Product)=>{
    this.addToCart(product);
    this.router.navigateByUrl('/shopping-cart');
  }

}

