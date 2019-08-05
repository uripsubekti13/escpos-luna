import { PNG } from "pngjs";
import { createStreamFromPath } from "./Utils";

export default class Image {
  public static async load(path: string): Promise<Image> {
    const stream = await createStreamFromPath(path);

    return new Promise<Image>(resolve => {
      stream.pipe(new PNG()).on("parsed", function(this: PNG) {
        const pixels = new Array<boolean>(this.width * this.height);
        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            // Get index 32bpp
            const idx = (this.width * y + x) * 4;
            let value = false;
            // Anything that is white-ish and has alpha > 128 is colored in, rest is blank.
            if (
              this.data[idx] < 0xe6 ||
              this.data[idx + 1] < 0xe6 ||
              this.data[idx + 2] < 0xe6
            ) {
              value = true;
            }
            if (value && this.data[idx + 3] <= 0x80) {
              value = false;
            }
            pixels[this.width * y + x] = value;
          }
        }
        resolve(new Image(pixels, this.width, this.height));
      });
    });
  }

  public width: number;
  public height: number;
  private data: boolean[];

  constructor(pixels: boolean[], width: number, height: number) {
    this.data = pixels;
    this.width = width;
    this.height = height;
  }

  public toRaster(): IRaster {
    const n = Math.ceil(this.width / 8);
    const result = new Uint8Array(this.height * n);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.data[y * this.width + x]) {
          // tslint:disable-next-line no-bitwise
          result[y * n + (x >> 3)] += 0x80 >> (x % 8 & 0x7);
        }
      }
    }

    return {
      data: result,
      height: this.height,
      width: n
    };
  }

  public toBitmap(den: any) {
    const density: any = den || 24;
    var ld: any[] = []
    var result = [];
    var x, y, b, l, i;
    var c = density / 8;

    // n blocks of lines
    var n = Math.ceil(this.height / density);

    for (y = 0; y < n; y++) {
      // line data
      ld = result[y] = [];

      for (x = 0; x < this.width; x++) {
        for (b = 0; b < density; b++) {
          i = x * c + (b >> 3);

          if (ld[i] === undefined) {
            ld[i] = 0;
          }

          l = y * density + b;
          if (l < this.height) {
            if (this.data[l * this.width + x]) {
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
