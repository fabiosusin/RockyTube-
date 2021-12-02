import { CategoryMigrationInput } from './../../models/category/category-migration-input';
import { UsersFilter } from './../../models/admin/users-filter';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoggedUserModel } from "src/models/logged-user/logged-user";
import { Login } from "src/models/login-register/login";
import { User } from "src/models/register-login/user";
import { BaseApiService } from "../base/base-api.service";
import { Category } from 'src/models/category/category';
import { FiltersCategory } from 'src/models/category/filters-category';
import { FiltersMovie } from 'src/models/movie/filters-movie';
import { Movie } from 'src/models/movie/movie';
import { MovieCategoryOutput } from 'src/models/category/movie-category-output';

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
  saveMovie = async (movie: Movie): Promise<any> =>
    await this.post('moviesregister/create', movie, await this.getRequestHeaders());

  deleteMovie = async (id: string): Promise<any> =>
    await this.post(`moviesregister/delete?${ApiService.getUrlQueryParameters({ id })}`, {}, await this.getRequestHeaders());

  listMovie = async (filters?: FiltersMovie): Promise<Movie[]> => {
    filters = filters ? filters : new FiltersMovie();
    return await this.post('moviesList/list', filters, await this.getRequestHeaders());
  }
  //#endregion

  //#region Category
  listCategories = async (filters?: FiltersCategory): Promise<MovieCategoryOutput[]> => {
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
}


export class UrlQueryParameter {
  key: string;
  value: string;
}