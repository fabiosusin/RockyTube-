import { User } from 'src/models/register-login/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/shared/services/api.service';
import { Utils } from 'src/shared/utils';
import { BaseEdit } from '../../base/base-edit.component';
import { UsersFilter } from 'src/models/admin/users-filter';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends BaseEdit<User> implements OnInit {
  constructor(
    protected apiService: ApiService,
    protected router: Router,
    protected utils: Utils,
    protected formBuilder: FormBuilder) {
    super(router, utils);
  }

  filter: UsersFilter = new UsersFilter();
  displayedColumns: string[] = ['blocked', 'name', 'email', 'cpf', 'edit'];
  dataSource = Array<User>();

  ngOnInit() {
    this.assignForm();
    this.getUsers(new UsersFilter());
  }

  assignForm = async () => {
    this.form = this.formBuilder.group({
      name: [this.filter.name],
      cpf: [this.filter.cpf],
      email: [this.filter.email],
      blocked: [this.filter.blocked]
    });
  };

  getUsers = async (filter: UsersFilter) => {
    this.dataSource = await this.apiService.users(filter);
  }
}