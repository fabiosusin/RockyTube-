import { UserService } from 'src/shared/services/user.service';
import { ApiService } from './../shared/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from 'src/shared/utils';
import { LoggedUserService } from './cache/loggedUser.component';
import { BasePage } from './pages/base/base.component';
import { LoggedUserModel } from 'src/models/logged-user/logged-user';
import { MovieCategoryOutput } from 'src/models/category/movie-category-output';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BasePage implements OnInit {
  constructor(
    protected userService: UserService,
    protected loggedUserService: LoggedUserService,
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils
  ) {
    super(router, utils);
  }

  movieName: string;
  amount: number;
  openDropdown: boolean;
  loggedModel: LoggedUserModel;
  categories = Array<MovieCategoryOutput>();

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

    this.userService.getLoggedUser()
      .subscribe((item: LoggedUserModel) => {
        this.loggedModel = item
      });
  }

  onClickOutsideChangeDropdown = (state?: boolean) => {
    setTimeout(() => {
      this.openDropdown = state ? state : !this.openDropdown;
    }, 0);
  }

  onClickGoToRegisterMovie() {
    this.router.navigateByUrl('/movies' );
  }

  onClickFindMovies = () => this.router.navigateByUrl('/movies-list', { state: { movieName: this.movieName } });

  onClickFilterMoviesByCategory = (categoryId: string) => this.router.navigateByUrl('/movies-list', { state: { categoryId: categoryId } });
}
