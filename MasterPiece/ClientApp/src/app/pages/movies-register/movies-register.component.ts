
import { LoggedUserModel } from '../../../models/logged-user/logged-user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../base/base-edit.component';
import { Category } from 'src/models/category/category';
import { LoggedUserService } from 'src/app/cache/loggedUser.component';
import { Movie } from 'src/models/movie/movie';

@Component({
  selector: 'app-movies-register',
  templateUrl: './movies-register.component.html',
  styleUrls: ['./movies-register.component.scss']
})
export class MoviesRegisterComponent extends BaseEdit<Movie> implements OnInit {
  constructor(
    protected apiService: ApiService,
    protected formBuilder: FormBuilder,
    protected loggedUserService: LoggedUserService,
    protected activatedRoute: ActivatedRoute,
    protected utils: Utils,
    protected router: Router) {
    super(router, utils);
  }

  categories: Array<Category>;
  movie: Movie = new Movie();
  videoName: string;

  async ngOnInit(): Promise<void> {
    this.assignForm();
    await this.getCategories();
  }

  getImage = () => this.form.get('auxiliaryProperties.pictureBase64').value;
  getVideo = () => this.form.get('auxiliaryProperties.pathBase64').value;
  onClickRemoveImage = () => this.form.controls['auxiliaryProperties']['controls']['pictureBase64'].setValue(null);
  onClickRemoveVideo = () => this.form.controls['auxiliaryProperties']['controls']['pathBase64'].setValue(null);
  assignForm = async () => {
    this.form = this.formBuilder.group({
      name: [this.movie.name, [Validators.required]],
      description: [this.movie.description, Validators.required],
      auxiliaryProperties: this.formBuilder.group({
        pictureBase64: [this.movie.auxiliaryProperties.pictureBase64],
        pathBase64: [this.movie.auxiliaryProperties.pictureBase64],
        categoryName: [this.movie.auxiliaryProperties.categoryName, Validators.required],
      })
    })
  };

  errors = () => {
    const invalidFields: string[] = [];

    if (!this.movie.name)
      invalidFields.push('Nome');
    if (!this.movie.description)
      invalidFields.push('Descrição');
    if (!this.movie.auxiliaryProperties.categoryName)
      invalidFields.push('Categoria')

    super.showValidationsError(invalidFields, 'Os campos devem ser informados');
  }

  onSubmit = async (movie: Movie) => {
    if (await this.inValidateForm()) {
      this.errors();
      return;
    }

    try {
      this.isLoading = true;
      await this.apiService.saveMovie(movie);
      this.router.navigate(['/home']);
    }
    catch (e) {
      this.utils.errorMessage(e)
    }
    finally {
      this.isLoading = false;
    }
  }

  async getCategories() {
    this.categories = await this.apiService.categories();
  }


  async attachFile(event: any, destiny: string, maxSize: number = 5) {
    if (event.target.files.length <= 0) {
      this.utils.errorMessage('Ocorreu um erro ao importar a imagem!');
      return;
    }

    const file = <File>event.target.files[0];
    if (file.size / 1024 / 1024 > maxSize) { //5MB
      this.utils.warningMessage('O tamanho máximo para os arquivos é de 5MB.');
      return;
    }

    if (destiny == 'pathBase64')
      this.videoName = file.name;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        this.form.controls['auxiliaryProperties']['controls'][destiny].setValue(reader.result.toString());
      } catch (e) {
        this.utils.errorMessage(e);
      }
    };
  }

}
