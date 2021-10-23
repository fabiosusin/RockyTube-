import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedUserService } from 'src/app/cache/loggedUser.component';
import { LoggedUserModel } from 'src/models/logged-user/logged-user';
import { Address, User } from 'src/models/register-login/user';
import { ApiService } from 'src/shared/services/api.service';
import { UserService } from 'src/shared/services/user.service';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../base/base-edit.component';

@Component({
  selector: 'app-register-login-component',
  templateUrl: './register-screen.component.html',
  styleUrls: ['./register-screen.component.scss']
})
export class RegisterScreenComponent extends BaseEdit<User> implements OnInit {
  constructor(
    protected userService: UserService,
    protected apiService: ApiService,
    protected formBuilder: FormBuilder,
    protected loggedUserService: LoggedUserService,
    protected activatedRoute: ActivatedRoute,
    protected utils: Utils,
    protected router: Router) {
    super(router, utils);
  }

  id: string;
  user: User = new User();
  loggedUser: LoggedUserModel = new LoggedUserModel();

  async ngOnInit(): Promise<void> {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id)
      this.user = await this.apiService.getUser(this.id);

    this.LoggedUser();
    this.assignForm();
  }

  LoggedUser() {
    this.loggedUser = this.loggedUserService.getLoggedUser();
  }

  assignForm = async () => {
    this.user.confirmPassword = this.id ? this.user.password : '';

    this.form = this.formBuilder.group({
      id: [this.user.id],
      blocked: [this.user.blocked],
      name: [this.user.name, [Validators.required]],
      password: [this.user.password, Validators.required],
      confirmPassword: [this.user.confirmPassword, Validators.required],
      cpf: [this.user.cpf, Validators.required],
      email: [this.user.email, Validators.required],
      address: this.formBuilder.group({
        street: [this.user.address.street],
        city: [this.user.address.city],
        state: [this.user.address.state],
        zipCode: [this.user.address.zipCode],
        number: [this.user.address.number],
        neighborhood: [this.user.address.neighborhood]
      })
    });
  };

  errors = () => {
    const invalidFields: string[] = [];
    if (!this.user.name)
      invalidFields.push('Nome')
    if (!this.user.cpf)
      invalidFields.push('CPF')
    if (!this.user.email)
      invalidFields.push('Email')
    if (!this.user.password)
      invalidFields.push('Senha')
    if (!this.user.confirmPassword)
      invalidFields.push('Confirmação de Senha')

    super.showValidationsError(invalidFields, 'Os campos devem ser informados');
  }

  onSubmit = async (user: User) => {
    if (await this.inValidateForm()) {
      this.errors();
      return;
    }

    try {
      this.isLoading = true;
      const result = await this.apiService.saveUser(user);
      this.loggedUserService.setLoggedUser(result);
      this.userService.changeLoggedUser();
      this.router.navigate(['/home'])
    }
    catch (e) {
      this.utils.errorMessage(e);
    }
    finally {
      this.isLoading = false;
    }
  }
}