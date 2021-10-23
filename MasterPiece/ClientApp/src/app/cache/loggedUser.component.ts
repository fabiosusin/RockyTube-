import { Injectable } from "@angular/core";
import { LoggedUserModel } from "src/models/logged-user/logged-user";

@Injectable({ providedIn: 'root' })
export class LoggedUserService {

    setLoggedUser(loggedUser: LoggedUserModel) {
        if (!loggedUser || !loggedUser.user || !loggedUser.token) {
            console.error('Não foi possível setar o usuário Logado', loggedUser)
            return;
        }
        
        localStorage.setItem('id', loggedUser.user.id);
        localStorage.setItem('password', loggedUser.user.password);
        localStorage.setItem('token', loggedUser.token);
        localStorage.setItem('userName', loggedUser.user.name);
        localStorage.setItem('admin', loggedUser.user.admin.toString());
    }

    removeLoggedUser() {
        localStorage.removeItem('password');
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    }

    getLoggedUser() {
        const admin = localStorage.getItem('admin');
        const user: LoggedUserModel = {
            user: {
                id: localStorage.getItem('id'),
                password: localStorage.getItem('password'),
                name: localStorage.getItem('userName'),
                admin: admin ? admin.toLocaleLowerCase() == 'true' : false
            },
            token: localStorage.getItem('token'),
        };
        
        if (!user.token)
            return null;

        return user;
    }

}