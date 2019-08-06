export default class ImageBitmap {
    static load(path: string): Promise<ImageBitmap>;
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
