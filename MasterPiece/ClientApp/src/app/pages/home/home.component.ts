import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/shared/services/api.service';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../base/base-edit.component';
import { UserService } from 'src/shared/services/user.service';
import { MoviesService } from 'src/shared/services/products.service';
import { Movie } from 'src/models/movie/movie';
import { MovieCategoryOutput } from 'src/models/category/movie-category-output';

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
    protected utils: Utils) {
    super(router, utils);
  }

  movies = Array<Movie>();
  categories = Array<MovieCategoryOutput>();

  async ngOnInit(): Promise<void> {
    await this.getMovies();
    await this.getCategories();
  }

  async getMovies() {
    try {
      this.isLoading = true;
      this.movies = await this.moviesService.getMovies({
        limit: 8
      });

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

}
