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
const pngjs_1 = require("pngjs");
const Utils_1 = require("./Utils");
class Image {
    static load(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield Utils_1.createStreamFromPath(path);
            return new Promise(resolve => {
                stream.pipe(new pngjs_1.PNG()).on("parsed", function () {
                    const pixels = new Array(this.width * this.height);
                    for (let y = 0; y < this.height; y++) {
                        for (let x = 0; x < this.width; x++) {
                            const idx = (this.width * y + x) * 4;
                            let value = false;
                            if (this.data[idx] < 0xE6 || this.data[idx + 1] < 0xE6 || this.data[idx + 2] < 0xE6) {
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
        });
    }
    constructor(pixels, width, height) {
        this.data = pixels;
        this.width = width;
        this.height = height;
    }
    toRaster() {
        const n = Math.ceil(this.width / 8);
        const result = new Uint8Array(this.height * n);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.data[y * this.width + x]) {
                    result[y * n + (x >> 3)] += (0x80 >> ((x % 8) & 0x7));
                }
            }
        }
        return {
            data: result,
            height: this.height,
            width: n
        };
    }
}
exports.default = Image;
