import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/shared/services/api.service";
import { Utils } from "src/shared/utils";
import { BaseEdit } from "../base/base-edit.component";
import { UserService } from "src/shared/services/user.service";
import { Movie } from "src/models/movie/movie";
import { FiltersMovie } from "src/models/movie/filters-movie";
import { MoviesService } from "src/shared/services/movies.service";
import { MovieCategoryOutput } from "src/models/category/movie-category-output";
import { LoggedUserService } from "src/app/cache/loggedUser.component";
import { User } from "src/models/register-login/user";


@Component({
  selector: 'app-movies-list-component',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})

export class MoviesListComponent extends BaseEdit<Movie> implements OnInit {
  movies: Array<Movie>;
  filters: FiltersMovie = new FiltersMovie();
  categories = Array<MovieCategoryOutput>();
  currentUser: User;

  constructor(
    protected apiService: ApiService,
    protected moviesService: MoviesService,
    protected userService: UserService,
    protected router: Router,
    private loggedUserService: LoggedUserService,
    protected utils: Utils) {
    super(router, utils);
  }
  ngOnInit(): void {
    this.currentUser = this.loggedUserService.getLoggedUser().user;
    if (this.dataReceived) {
      this.filters.movieName = this.dataReceived.movieName;
      this.filters.categoryId = this.dataReceived.categoryId;
    }
    this.filters.page = 1;
    this.filters.limit = 25;
    this.filters.userId = this.currentUser ? this.currentUser.id : ''
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


  onClickShowMovie = (movieLink: string) => this.router.navigateByUrl('/movie-show', { state: { movieLink: movieLink } });

  onClickChangeFromList = async (movie: Movie) => {
    try {
      this.isLoading = true;
      await this.apiService[movie.auxiliaryProperties.addedToList ? 'removeUserMovie' : 'addUserMovie']({ movieId: movie.id, userId: this.currentUser ? this.currentUser.id : '' });
      movie.auxiliaryProperties.addedToList = !movie.auxiliaryProperties.addedToList;
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

}
