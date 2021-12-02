import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "src/shared/services/api.service";
import { Utils } from "src/shared/utils";
import { BaseEdit } from "../base/base-edit.component";
import { LoggedUserService } from "src/app/cache/loggedUser.component";
import { FiltersMovie } from "src/models/movie/filters-movie";
import { Movie } from "src/models/movie/movie";
import { MoviesService } from "src/shared/services/products.service";


@Component({
  selector: 'app-user-movies-component',
  templateUrl: './user-movies.component.html',
  styleUrls: ['./user-movies.component.scss']
})

export class UserMoviesComponent extends BaseEdit<Movie> implements OnInit {
  movies: Array<Movie>;
  filters: FiltersMovie = new FiltersMovie();


  constructor(
    protected apiService: ApiService,
    protected loggedUserService: LoggedUserService,
    protected moviesService: MoviesService,
    protected router: Router,
    protected utils: Utils) {
    super(router, utils);
  }
  ngOnInit(): void {
    this.filters.page = 1;
    this.filters.limit = 25;
    this.getMovies();
  }

  getMovies = async () => {
    try {
      this.isLoading = true;
      const loggedUser = this.loggedUserService.getLoggedUser();
      if (!loggedUser)
        return;

      this.filters.userId = loggedUser.user ? loggedUser.user.id : '';
      if (!this.filters.userId)
        return;

      this.movies = await this.moviesService.getMovies(this.filters);
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  deleteMovie = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir o filme?'))
      return;
    try {
      this.isLoading = true;
      await this.apiService.deleteMovie(id);
      this.utils.successMessage('Filme excluído com sucesso!')
      this.getMovies();
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
}
