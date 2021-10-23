import { Injectable } from "@angular/core";
import { Product } from "src/models/product/product";

@Injectable({ providedIn: 'root' })
export class CartComponent {
    setShoppingCartNewItem(product: Product) {
        let cartProduct = this.getShoppingCartItems();
        if (!cartProduct)
            cartProduct = new Array<Product>();

        if (cartProduct.map(x => x.id).includes(product.id))
            return;

        cartProduct.push(product);
        localStorage.setItem('cartProduct', JSON.stringify(cartProduct));
    }

    setShoppingCartItems(products: Product[]) {
        let cartProduct = products;
        localStorage.setItem('cartProduct', JSON.stringify(cartProduct));
    }

    getShoppingCartItems = () => JSON.parse(localStorage.getItem('cartProduct'));

    clearCart = () => localStorage.removeItem('cartProduct');

    removeProduct(product: Product) {
        let items = this.getShoppingCartItems();
        if (!items || items.length == 0)
            return;

        items = items.filter(x => x.id != product.id);
        this.setShoppingCartItems(items);
    }

    getShoppingCartAmount = () => {
        const items = this.getShoppingCartItems();
        return !items || !items.length ? '' : items.length;
    }
}