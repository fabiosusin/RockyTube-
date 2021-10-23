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
import { ProducstService } from "src/shared/services/products.service";
import { Sale } from "src/models/sales/sales";
import { SaleOutput } from "src/models/sales/sales-output";
import { FiltersSale } from "src/models/sales/filters-sale";
import { LoggedUserService } from "src/app/cache/loggedUser.component";


@Component({
  selector: 'app-sales-component',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})

export class SalesComponent extends BaseEdit<Sale> implements OnInit {
  data: Array<SaleOutput>;
  filters: FiltersSale = new FiltersSale();

  constructor(
    protected apiService: ApiService,
    protected cartService: CartComponent,
    protected producstService: ProducstService,
    protected loggedUserService: LoggedUserService,
    protected router: Router,
    protected utils: Utils) {
    super(router, utils);
  }

  ngOnInit(): void {
    // if(this.dataReceived){
    //   this.filters.productName = this.dataReceived.productName;
    //   this.filters.categoryId = this.dataReceived.categoryId;
    // }
    const loggedUser = this.loggedUserService.getLoggedUser();
    if(!loggedUser)
    {
      this.utils.warningMessage('Necessário estar logado para acessar esta tela');
      this.router.navigateByUrl('/login')
      return;
    }
    this.filters.userId = loggedUser.user.id
    this.filters.page = 1;
    this.filters.limit = 25;
    this.getSales();
  }

  getSales = async () => {
    try {
      this.isLoading = true
      this.data = await this.apiService.getSales(this.filters);
      console.log(this.data)
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

    this.getSales();
  }
}
