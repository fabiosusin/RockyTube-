import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoggedUserService } from 'src/app/cache/loggedUser.component';

@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
  constructor(private loggedUserService: LoggedUserService) { }

  canActivate = (): boolean => !this.loggedUserService.getLoggedUser() ? false : true;
}