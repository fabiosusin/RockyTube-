import { UserService } from 'src/shared/services/user.service';
import { ProductCategoryOutput } from 'src/models/category/product-category-output';
import { ApiService } from './../shared/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductType } from 'src/models/product/product';
import { Utils } from 'src/shared/utils';
import { LoggedUserService } from './cache/loggedUser.component';
import { BasePage } from './pages/base/base.component';
import { LoggedUserModel } from 'src/models/logged-user/logged-user';
import { CartComponent } from './cache/cart.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BasePage implements OnInit {
  constructor(
    protected cartService: CartComponent,
    protected userService: UserService,
    protected loggedUserService: LoggedUserService,
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils
  ) {
    super(router, utils);
  }

  productName: string;
  amount: number;
  openDropdown: boolean;
  loggedModel: LoggedUserModel;
  categories = Array<ProductCategoryOutput>();

  ngOnInit(): void {
    this.getCategories();
  }

  ngAfterViewInit(): void {
    this.subscribeEvents();
  }

  async getCategories() {
    this.categories = await this.apiService.listCategories();
  }

  onClickLogout = () => {
    this.loggedUserService.removeLoggedUser();
    this.router.navigate(['/login']);
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.loggedModel = this.loggedUserService.getLoggedUser();
    this.amount = this.cartService.getShoppingCartAmount();

    this.userService.getLoggedUser()
      .subscribe((item: LoggedUserModel) => {
        this.loggedModel = item
      });

    this.userService.getShoppingCartAmount()
      .subscribe((amount: number) => {
        this.amount = amount
      });
  }

  onClickOutsideChangeDropdown = (state?: boolean) => {
    setTimeout(() => {
      this.openDropdown = state ? state : !this.openDropdown;
    }, 0);
  }

  onClickGoToRegisterProduct(type: ProductType) {
    this.router.navigateByUrl('/products', { state: { type: type } });
  }

  onClickFindProducts = () => this.router.navigateByUrl('/products-list', { state: { productName: this.productName } });

  onClickFilterProductsByCategory = (categoryId: string) => this.router.navigateByUrl('/products-list', { state: { categoryId: categoryId } });
}
