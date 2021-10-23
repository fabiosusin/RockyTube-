import { Address } from "../register-login/user";

export class Sale {
    userId?: string;
    userName?: string;
    total?: number;
    destination?: Address
    registryDate?: Date;
    deliveryDate?: Date;
}