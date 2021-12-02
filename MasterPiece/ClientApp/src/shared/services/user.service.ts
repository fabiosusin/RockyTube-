import { EventEmitter, Injectable, Output } from "@angular/core";
import { LoggedUserService } from "src/app/cache/loggedUser.component";
import { LoggedUserModel } from "src/models/logged-user/logged-user";

@Injectable()
export class UserService {
    @Output() loggedUser: EventEmitter<LoggedUserModel> = new EventEmitter();
    @Output() cartAmount: EventEmitter<number> = new EventEmitter();
    constructor(protected loggedUserService: LoggedUserService) { }

    changeLoggedUser = () =>
        this.loggedUser.emit(this.loggedUserService.getLoggedUser());

    getLoggedUser() {
        this.changeLoggedUser();
        return this.loggedUser;
    }

}