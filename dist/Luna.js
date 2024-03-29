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
const Commands_1 = require("./Commands");
const Image_1 = require("./Image");
const ImageBitmap_1 = require("./ImageBitmap");
const Printer_1 = require("./Printer");
class LunaEscpos {
    constructor(encoding = "CP865") {
        this.printer = new Printer_1.default(encoding);
        this.printer.open();
        this.printer.clearBuffer();
        this.printer.init();
        this.printer.setJustification(Commands_1.Justification.Center);
    }
    addLogo(imgPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield Image_1.default.load(imgPath);
                this.printer.raster(image, Commands_1.RasterMode.Normal);
                return this.printer;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addLogoEpsonTMU220(imgPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield ImageBitmap_1.default.load(imgPath);
                this.printer.hoiImage(image);
                return this.printer;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    addText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.printer.writeLine(text);
        });
    }
    addLines(lines) {
        return __awaiter(this, void 0, void 0, function* () {
            lines.forEach(line => this.printer.writeLine(line));
        });
    }
    openCashDrawer() {
        return __awaiter(this, void 0, void 0, function* () {
            this.printer.openDrawer(Commands_1.DrawerPin.Pin2);
        });
    }
    openCashDrawer2() {
        return __awaiter(this, void 0, void 0, function* () {
            this.printer.openDrawer(Commands_1.DrawerPin.Pin5);
        });
    }
    cutPaper() {
        return __awaiter(this, void 0, void 0, function* () {
            this.printer.cut();
        });
    }
    getBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.printer.close();
            return new Buffer(data);
        });
    }
}
exports.default = LunaEscpos;
