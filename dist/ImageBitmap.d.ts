export default class Image {
    static load(path: string): Promise<Image>;
    pixels: any;
    private data;
    constructor(pixels: any);
    private readonly size;
    toBitmap(den: any): {
        data: any;
        density: any;
    };
}
export interface IRaster {
    data: Uint8Array;
    height: number;
    width: number;
}
