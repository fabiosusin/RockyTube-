import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/shared/services/api.service';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../base/base-edit.component';
import { UserService } from 'src/shared/services/user.service';
import { MoviesService } from 'src/shared/services/movies.service';
import { Movie } from 'src/models/movie/movie';
import { MovieCategoryOutput } from 'src/models/category/movie-category-output';
import { LoggedUserService } from 'src/app/cache/loggedUser.component';
import { User } from 'src/models/register-login/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends BaseEdit<Movie> implements OnInit {
  constructor(
    protected userService: UserService,
    protected moviesService: MoviesService,
    protected apiService: ApiService,
    protected router: Router,
    private loggedUserService: LoggedUserService,
    protected utils: Utils) {
    super(router, utils);
  }

  currentUser: User;
  movies = Array<Movie>();
  myList = Array<Movie>();
  categories = Array<MovieCategoryOutput>();

  async ngOnInit(): Promise<void> {
    this.currentUser = this.loggedUserService.getLoggedUser().user;
    await this.getMovies();
    await this.getCategories();
  }

  async getMovies() {
    try {
      this.isLoading = true;
      this.movies = await this.moviesService.getMovies({
        userId: this.currentUser ? this.currentUser.id : '',
        limit: 8
      });

      this.getUserList();
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  async getCategories() {
    try {
      this.isLoading = true;
      this.categories = await this.moviesService.getCategories()
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  onClickFilterMoviesByCategory = (categoryId: string) => this.router.navigateByUrl('/movies-list', { state: { categoryId: categoryId } });

  onClickShowMovie = (movieLink: string) => this.router.navigateByUrl('/movie-show', { state: { movieLink: movieLink } });

  onClickChangeFromList = async (movie: Movie) => {
    try {
      this.isLoading = true;
      await this.apiService[movie.auxiliaryProperties.addedToList ? 'removeUserMovie' : 'addUserMovie']({ movieId: movie.id, userId: this.currentUser ? this.currentUser.id : '' });
      movie.auxiliaryProperties.addedToList = !movie.auxiliaryProperties.addedToList;
      await this.getUserList();
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }

  getUserList = async () => this.myList = await this.moviesService.listUserMovies({ userId: this.currentUser.id });
}
