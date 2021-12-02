import { ImageFormat } from '../shared/imageFormat';
export class Movie {
    id?: string;
    name?: string;
    description?: string;
    categoryId?: string;
    path?: string;
    image?: ImageFormat = new ImageFormat();
    auxiliaryProperties?: AuxiliaryProperties = new AuxiliaryProperties();
}

export class AuxiliaryProperties {
    categoryName?: string;
    pictureBase64?: string;
    pathBase64?: string;
    imageUrl?: string;
}