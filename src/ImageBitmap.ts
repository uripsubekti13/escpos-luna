const getPixels = require("get-pixels");

interface GetPixel {
  data: Uint8Array[];
  shape: number[];
  stride: number[];
  offset: number;
}

export default class ImageBitmap {
  public static async load(path: string): Promise<ImageBitmap> {
    return new Promise(resolve => {
      getPixels(path, function(err: any, pixels: any) {
        resolve(new ImageBitmap(pixels));
      });
    });
  }

  public pixels: any;
  private data: any[];

  constructor(pixels: any) {
    if (!(this instanceof ImageBitmap)) return new ImageBitmap(pixels);
    this.pixels = pixels;
    this.data = [];
    const rgb = (pixel: any) => {
      return {
        r: pixel[0],
        g: pixel[1],
        b: pixel[2],
        a: pixel[3]
      };
    };
    let self = this;
    for (let i = 0; i < this.pixels.data.length; i += this.size.colors) {
      this.data.push(
        rgb(
          new Array(this.size.colors).fill(0).map(function(_, b) {
            return self.pixels.data[i + b];
          })
        )
      );
    }

    this.data = this.data.map(function(pixel) {
      if (pixel.a == 0) return 0;
      return pixel.r !== 0xff || pixel.g !== 0xff || pixel.b !== 0xff ? 1 : 0;
    });
  }

  private get size() {
    return {
      width: this.pixels.shape[0],
      height: this.pixels.shape[1],
      colors: this.pixels.shape[2]
    };
  }

  public toBitmap(den: any) {
    const density: any = den || 24;
    var ld: any[] = [];
    var result = [];
    var x, y, b, l, i;
    var c = density / 8;

    // n blocks of lines
    var n = Math.ceil(this.size.height / density);

    for (y = 0; y < n; y++) {
      // line data
      ld = result[y] = [];

      for (x = 0; x < this.size.width; x++) {
        for (b = 0; b < density; b++) {
          i = x * c + (b >> 3);

          if (ld[i] === undefined) {
            ld[i] = 0;
          }

          l = y * density + b;
          if (l < this.size.height) {
            if (this.data[l * this.size.width + x]) {
              ld[i] += 0x80 >> (b & 0x7);
            }
          }
        }
      }
    }

    return {
      data: result as any,
      density: density
    };
  }
}

export interface IRaster {
  data: Uint8Array;
  height: number;
  width: number;
}
