export class ImageFormat {
    webp = new ImageResolutions();
    jpeg = new ImageResolutions();
}

export class ImageResolutions {
    url32?: string;
    url64?: string;
    url128?: string;
    url256?: string;
    url512?: string;
    url1024?: string;
    url2048?: string;
}

enum FileType {
    Webp = 0,
    Jpeg = 1
}