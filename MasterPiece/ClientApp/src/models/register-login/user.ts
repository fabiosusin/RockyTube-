export class User {
    id?: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    cpf?: string;
    admin?: boolean = false;
    blocked?: boolean = false;
    card?: Card = new Card();
}

export class Card {
    number?: number;
    name?: string;
    securityCode?: number;
    validityDate?: string;
}