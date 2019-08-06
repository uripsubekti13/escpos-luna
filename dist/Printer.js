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
const iconv = require("iconv-lite");
const Commands_1 = require("./Commands");
const MutableBuffer_1 = require("./MutableBuffer");
const ESC = 0x1b;
const GS = 0x1d;
const BITMAP_FORMAT = {
    BITMAP_S8: new Uint8Array([ESC, 0x2a, 0x00]),
    BITMAP_D8: new Uint8Array([ESC, 0x2a, 0x01]),
    BITMAP_S24: new Uint8Array([ESC, 0x2a, 0x20]),
    BITMAP_D24: new Uint8Array([ESC, 0x2a, 0x21])
};
class Printer {
    constructor(encoding = "ascii") {
        this.buffer = new MutableBuffer_1.default();
        this.encoding = encoding;
    }
    setEncoding(encoding) {
        this.encoding = encoding;
        return this;
    }
    flush() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.buffer.flush();
        });
    }
    init() {
        this.write(ESC);
        this.write("@");
        return this;
    }
    resetToDefault() {
        this.setInverse(false);
        this.setBold(false);
        this.setUnderline(Commands_1.Underline.NoUnderline);
        this.setJustification(Commands_1.Justification.Left);
        this.setTextMode(Commands_1.TextMode.Normal);
        this.setFont(Commands_1.Font.A);
        return this;
    }
    feed(feed = 1) {
        this.write(ESC);
        this.write("d");
        this.write(feed);
        return this;
    }
    reverse(feed = 1) {
        this.write(ESC);
        this.write("e");
        this.write(feed);
        return this;
    }
    setBold(bold = true) {
        this.write(ESC);
        this.write("E");
        this.write(bold ? 1 : 0);
        return this;
    }
    setDoubleStrike(double = true) {
        this.write(ESC);
        this.write("G");
        this.write(double ? 0xff : 0);
        return this;
    }
    setInverse(inverse = true) {
        this.write(GS);
        this.write("B");
        this.write(inverse ? 1 : 0);
        return this;
    }
    setUnderline(value) {
        this.write(ESC);
        this.write("-");
        this.write(value);
        return this;
    }
    setJustification(value) {
        this.write(ESC);
        this.write("a");
        this.write(value);
        return this;
    }
    setFont(value) {
        this.write(ESC);
        this.write("M");
        this.write(value);
        return this;
    }
    cut(partial = false) {
        this.write(GS);
        this.write("V");
        this.write(partial ? 1 : 0);
        return this;
    }
    openDrawer(pin = Commands_1.DrawerPin.Pin2) {
        this.write(ESC);
        this.write("p");
        this.write(pin);
        this.write(10);
        this.write(10);
        return this;
    }
    setColor(color) {
        this.write(ESC);
        this.write("r");
        this.write(color);
        return this;
    }
    setCodeTable(table) {
        this.write(ESC);
        this.write("t");
        this.write(table);
        return this;
    }
    setTextMode(mode) {
        this.write(ESC);
        this.write("!");
        this.write(mode);
        return this;
    }
    barcode(code, type, height, width, font, pos) {
        this.write(GS);
        this.write("H");
        this.write(pos);
        this.write(GS);
        this.write("f");
        this.write(font);
        this.write(GS);
        this.write("h");
        this.write(height);
        this.write(GS);
        this.write("w");
        this.write(width);
        this.write(GS);
        this.write("k");
        this.write(type);
        this.write(code);
        this.write(0);
        return this;
    }
    qr(code, errorCorrect, size) {
        this.write(GS);
        this.write("(k");
        this.buffer.writeUInt16LE(code.length + 3);
        this.write(new Uint8Array([49, 80, 48]));
        this.write(code);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 49, 69]));
        this.write(errorCorrect);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 49, 67]));
        this.write(size);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 49, 81, 48]));
        return this;
    }
    pdf417(code, type = Commands_1.PDF417Type.Standard, height = 1, width = 20, columns = 0, rows = 0, error = Commands_1.PDF417ErrorCorrectLevel.Level1) {
        this.write(GS);
        this.write("(k");
        this.buffer.writeUInt16LE(code.length + 3);
        this.write(new Uint8Array([0x30, 0x50, 0x30]));
        this.write(code);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 48, 65]));
        this.write(columns);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 48, 66]));
        this.write(rows);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 48, 67]));
        this.write(width);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 48, 68]));
        this.write(height);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([4, 0, 48, 69, 48]));
        this.write(error);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 48, 70]));
        this.write(type);
        this.write(GS);
        this.write("(k");
        this.write(new Uint8Array([3, 0, 48, 81, 48]));
        return this;
    }
    beep() {
        this.write(ESC);
        this.write("(A");
        this.write(new Uint8Array([4, 0, 48, 51, 3, 15]));
        return this;
    }
    setLineSpacing(spacing) {
        this.write(ESC);
        if (spacing) {
            this.write("3");
            this.write(spacing);
        }
        else {
            this.write("2");
        }
        return this;
    }
    raster(image, mode = Commands_1.RasterMode.Normal) {
        const header = new Uint8Array([GS, 0x76, 0x30, mode]);
        const raster = image.toRaster();
        this.buffer.write(header);
        this.buffer.writeUInt16LE(raster.width);
        this.buffer.writeUInt16LE(raster.height);
        this.buffer.write(raster.data);
        return this;
    }
    hoiImage(image) {
        const n = 1;
        const header = BITMAP_FORMAT[`BITMAP_D8`];
        const bitmap = image.toBitmap(1 * 8);
        this.setLineSpacing(16);
        bitmap.data.forEach((line) => __awaiter(this, void 0, void 0, function* () {
            this.buffer.write(header);
            this.buffer.writeUInt16LE(line.length / n);
            this.write(line);
            yield new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(true);
                }, 200);
            });
        }));
        this.setLineSpacing();
        return this;
    }
    writeLine(value, encoding) {
        return this.write(`${value}\n`, encoding);
    }
    writeList(values, encoding) {
        for (const value of values) {
            this.writeLine(value, encoding);
        }
        return this;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.flush();
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    clearBuffer() {
        this.buffer.clear();
        return this;
    }
    write(value, encoding) {
        if (typeof value === "number") {
            this.buffer.writeUInt8(value);
        }
        else if (typeof value === "string") {
            this.buffer.write(iconv.encode(value, encoding || this.encoding));
        }
        else {
            this.buffer.write(value);
        }
        return this;
    }
}
exports.default = Printer;
