import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/shared/services/api.service";
import { Utils } from "src/shared/utils";
import { BaseEdit } from "../base/base-edit.component";
import { UserService } from "src/shared/services/user.service";
import { Movie } from "src/models/movie/movie";
import { FiltersMovie } from "src/models/movie/filters-movie";
import { MoviesService } from "src/shared/services/products.service";
import { MovieCategoryOutput } from "src/models/category/movie-category-output";


@Component({
  selector: 'app-movies-list-component',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})

export class MoviesListComponent extends BaseEdit<Movie> implements OnInit {
  movies: Array<Movie>;
  filters: FiltersMovie = new FiltersMovie();
  categories = Array<MovieCategoryOutput>();


  constructor(
    protected apiService: ApiService,
    protected moviesService: MoviesService,
    protected userService: UserService,
    protected router: Router,
    protected utils: Utils) {
    super(router, utils);
  }
  ngOnInit(): void {
    if(this.dataReceived){
      this.filters.movieName = this.dataReceived.movieName;
      this.filters.categoryId = this.dataReceived.categoryId;
    }
    this.filters.page = 1;
    this.filters.limit = 25;
    this.getMovies();
    this.getCategories();
  }

  async getCategories() {
    try {
      this.isLoading = true
      this.categories = await this.moviesService.getCategories();
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  getMovies = async () => {
    try {
      this.isLoading = true
      this.movies = await this.moviesService.getMovies(this.filters);
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

    this.getMovies();
  }

  onClickFilterMoviesByCategory = (categoryId: string) => this.router.navigateByUrl('/movies-list', { state: { categoryId: categoryId } });
}
