export default class Image {
    static load(path: string): Promise<Image>;
    width: number;
    height: number;
    private data;
    constructor(pixels: boolean[], width: number, height: number);
    toRaster(): IRaster;
}
export interface IRaster {
    data: Uint8Array;
    height: number;
    width: number;
}
