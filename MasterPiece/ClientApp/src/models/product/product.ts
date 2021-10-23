import { ImageFormat } from './../shared/imageFormat';
export class Product {
    id?: string;
    userId?: string;
    name?: string;
    description?: string;
    categoryId?: string;
    price?: number = 0;
    balance?: number = 0;
    type?: ProductType;
    image?: ImageFormat = new ImageFormat();
    auxiliaryProperties?: AuxiliaryProperties = new AuxiliaryProperties();
}

export class AuxiliaryProperties {
    categoryName?: string;
    pictureBase64?: string;
    imageUrl?: string;
}

export enum ProductType {
    Default,
    Donation,
    ForSale
}