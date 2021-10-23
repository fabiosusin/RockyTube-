import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CartComponent } from "src/app/cache/cart.component";
import { LoggedUserService } from "src/app/cache/loggedUser.component";
import { FiltersProduct } from "src/models/product/filters-product";
import { Product } from "src/models/product/product";
import { SaleInput } from "src/models/sale/sale-input";
import { ApiService } from "src/shared/services/api.service";
import { UserService } from "src/shared/services/user.service";
import { Utils } from "src/shared/utils";

@Component({
  selector: 'app-shopping-cart-component',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})


export class ShoppingCartComponent implements OnInit {
  constructor(
    protected cartService: CartComponent,
    protected userService: UserService,
    protected loggedUserService: LoggedUserService,
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils) {

  }

  products: Array<Product> = [];
  isLoading: boolean;
  total: number;

  async ngOnInit(): Promise<void> {
    this.getProducts();
    this.total = await this.getTotal();
  }

  getProducts() {
    this.products = this.cartService.getShoppingCartItems();
  }

  getTotal = () => this.apiService.getSaleTotal(this.products.map(x => x.id));

  removeProduct = (product: Product) => {
    this.cartService.removeProduct(product);
    window.location.reload();
  }

  saveSale = async () => {
    const loggedUser = this.loggedUserService.getLoggedUser();
    const user = await this.apiService.getUser(loggedUser ? loggedUser.user.id : '');
    try {
      if (!user) {
        this.utils.errorMessage('Necessário estar logado para finalizar a venda');
        this.router.navigateByUrl('/login')
      }
      this.isLoading = true;

      const input: SaleInput = {
        productsId: this.products.map(x => x.id),
        userId: user.id,
        destination: user.address
      };

      await this.apiService.saveSale(input)
      this.cartService.clearCart();
      this.utils.successMessage('Venda realizada com sucesso');
      this.router.navigateByUrl('/home')
    }
    catch (e) {
      this.utils.errorMessage(e);
      if (e.includes('endereço'))
        this.router.navigateByUrl('/register/' + user.id)
    }
    finally {
      this.isLoading = false;
    }
  }

}