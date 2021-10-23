import { Product } from "../product/product";
import { Address } from "../register-login/user";
import { Sale } from "./sales";

export class SaleOutput {
    sale?: Sale;
    products?: Product;
}