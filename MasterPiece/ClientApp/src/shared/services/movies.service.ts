import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { FiltersCategory } from "src/models/category/filters-category";
import { FiltersMovie } from "src/models/movie/filters-movie";
import { UserMovie } from "src/models/movie/user-movie";
import { Utils } from "../utils";
import { ApiService } from './api.service';
import { UserService } from "./user.service";

@Injectable({ providedIn: 'root' })
export class MoviesService {
  constructor(
    protected userService: UserService,
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils) {
  }


  getMovies = async (filters?: FiltersMovie) => await this.apiService.listMovie(filters);

  getCategories = async (filters?: FiltersCategory) => await this.apiService.listCategories(filters)

  addUserMovie = async (movie: UserMovie) => await this.apiService.addUserMovie(movie)

  removeUserMovie = async (movie: UserMovie) => await this.apiService.removeUserMovie(movie)

  listUserMovies = async (filters: FiltersMovie) => await this.apiService.listUserMovies(filters)

}

