"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPixels = require("get-pixels");
class ImageBitmap {
    static load(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                getPixels(path, function (err, pixels) {
                    resolve(new ImageBitmap(pixels));
                });
            });
        });
    }
    constructor(pixels) {
        if (!(this instanceof ImageBitmap))
            return new ImageBitmap(pixels);
        this.pixels = pixels;
        this.data = [];
        const rgb = (pixel) => {
            return {
                r: pixel[0],
                g: pixel[1],
                b: pixel[2],
                a: pixel[3]
            };
        };
        let self = this;
        for (let i = 0; i < this.pixels.data.length; i += this.size.colors) {
            this.data.push(rgb(new Array(this.size.colors).fill(0).map(function (_, b) {
                return self.pixels.data[i + b];
            })));
        }
        this.data = this.data.map(function (pixel) {
            if (pixel.a == 0)
                return 0;
            return pixel.r !== 0xff || pixel.g !== 0xff || pixel.b !== 0xff ? 1 : 0;
        });
    }
    get size() {
        return {
            width: this.pixels.shape[0],
            height: this.pixels.shape[1],
            colors: this.pixels.shape[2]
        };
    }
    toBitmap(den) {
        const density = den || 24;
        var ld = [];
        var result = [];
        var x, y, b, l, i;
        var c = density / 8;
        var n = Math.ceil(this.size.height / density);
        for (y = 0; y < n; y++) {
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
            data: result,
            density: density
        };
    }
}
exports.default = ImageBitmap;
