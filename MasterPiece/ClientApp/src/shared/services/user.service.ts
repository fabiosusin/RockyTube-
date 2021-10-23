import { EventEmitter, Injectable, Output } from "@angular/core";
import { CartComponent } from "src/app/cache/cart.component";
import { LoggedUserService } from "src/app/cache/loggedUser.component";
import { ShoppingCartComponent } from "src/app/pages/shopping-cart/shopping-cart.component";
import { LoggedUserModel } from "src/models/logged-user/logged-user";

@Injectable()
export class UserService {
    @Output() loggedUser: EventEmitter<LoggedUserModel> = new EventEmitter();
    @Output() cartAmount: EventEmitter<number> = new EventEmitter();
    constructor(protected loggedUserService: LoggedUserService, protected cartService: CartComponent) { }

    changeLoggedUser = () =>
        this.loggedUser.emit(this.loggedUserService.getLoggedUser());

    changeShoppingCartAmount = () =>
        this.cartAmount.emit(this.cartService.getShoppingCartAmount());

    getLoggedUser() {
        this.changeLoggedUser();
        return this.loggedUser;
    }

    getShoppingCartAmount = () => {
        this.changeShoppingCartAmount();
        return this.cartAmount
    }

}