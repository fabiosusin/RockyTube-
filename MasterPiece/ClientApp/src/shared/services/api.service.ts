import { CategoryMigrationInput } from './../../models/category/category-migration-input';
import { UsersFilter } from './../../models/admin/users-filter';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoggedUserModel } from "src/models/logged-user/logged-user";
import { Login } from "src/models/login-register/login";
import { Product } from "src/models/product/product";
import { User } from "src/models/register-login/user";
import { BaseApiService } from "../base/base-api.service";
import { ProductCategoryOutput } from 'src/models/category/product-category-output';
import { Category } from 'src/models/category/category';
import { FiltersProduct } from 'src/models/product/filters-product';
import { FiltersCategory } from 'src/models/category/filters-category';
import { SaleInput } from 'src/models/sale/sale-input';
import { FiltersSale } from 'src/models/sales/filters-sale';
import { SaleOutput } from 'src/models/sales/sales-output';

@Injectable({ providedIn: 'root' })
export class ApiService extends BaseApiService {
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  private static getUrlQueryParameters(object: any) {
    const parameters = new Array<UrlQueryParameter>();
    if (object) {
      for (const propertyName in object) {
        if (propertyName !== 'constructor' && (object[propertyName] || object[propertyName] === false)) {
          parameters.push({
            key: propertyName,
            value:
              typeof object[propertyName].getMonth === 'function'
                ? object[propertyName].toISOString()
                : object[propertyName]
          });
        }
      }
    }
    return parameters.map(x => `${x.key}=${x.value}`).join('&');
  }

  //#region Users
  saveUser = async (user: User): Promise<LoggedUserModel> =>
    await this.post('users/create', user, await this.getRequestHeaders());

  login = async (user: Login): Promise<LoggedUserModel> =>
    await this.post('users/login', user, await this.getRequestHeaders());

  users = async (filter: UsersFilter): Promise<User[]> =>
    await this.post('users/all-users', filter, await this.getRequestHeaders());

  getUser = async (id: string): Promise<User> =>
    await this.get(`users/get?${ApiService.getUrlQueryParameters({ id })}`, await this.getRequestHeaders());
  //#endregion

  //#region ProductsList
  saveProduct = async (product: Product): Promise<any> =>
    await this.post('productsregister/create', product, await this.getRequestHeaders());

  deleteProduct = async (id: string): Promise<any> =>
    await this.post(`productsregister/delete?${ApiService.getUrlQueryParameters({ id })}`, {}, await this.getRequestHeaders());

  listProduct = async (filters?: FiltersProduct): Promise<Product[]> => {
    filters = filters ? filters : new FiltersProduct();
    return await this.post('productsList/list', filters, await this.getRequestHeaders());
  }
  //#endregion

  //#region Category
  listCategories = async (filters?: FiltersCategory): Promise<ProductCategoryOutput[]> => {
    filters = filters ? filters : new FiltersCategory();
    return await this.post('categories/get-categories', filters, await this.getRequestHeaders());
  }

  categories = async (filters?: FiltersCategory): Promise<Category[]> => {
    filters = filters ? filters : new FiltersCategory();
    return await this.post('categories/list', filters, await this.getRequestHeaders());
  }

  getCategory = async (id: string): Promise<User> =>
    await this.get(`categories/get?${ApiService.getUrlQueryParameters({ id })}`, await this.getRequestHeaders());

  saveCategory = async (input: Category): Promise<User> =>
    await this.post(`categories/save`, input, await this.getRequestHeaders());

  migrateCategory = async (input: CategoryMigrationInput): Promise<User> =>
    await this.post(`categories/migration`, input, await this.getRequestHeaders());
  //#endregion

  //#region Sales
  getSaleTotal = async (input: string[]): Promise<number> =>
    await this.post(`sales/total`, input, await this.getRequestHeaders());

  saveSale = async (input: SaleInput): Promise<void> =>
    await this.post(`sales/create`, input, await this.getRequestHeaders());

  getSales = async (input: FiltersSale): Promise<SaleOutput[]> =>
    await this.post(`sales/get`, input, await this.getRequestHeaders());
  //#endregion
}


export class UrlQueryParameter {
  key: string;
  value: string;
}