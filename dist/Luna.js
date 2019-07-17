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
const Printer_1 = require("./Printer");
const Jimp = require("jimp");
const path = require("path");
const fs_1 = require("fs");
class LunaEscpos {
    constructor(tmpDir = "./") {
        this.filename = "logo.png";
        this.tmpDir = tmpDir;
        this.printer = new Printer_1.default("CP865");
        this.printer.open();
        this.printer.clearBuffer();
        this.printer.init();
        this.printer.setJustification(Commands_1.Justification.Center);
    }
    addLogo(imgPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const img = yield Jimp.read(imgPath);
                yield img.writeAsync(path.join(this.tmpDir, this.filename));
                const image = yield Image_1.default.load(path.join(this.tmpDir, this.filename));
                this.printer.raster(image, Commands_1.RasterMode.Normal);
            }
            catch (error) {
                console.log(error);
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
            if (fs_1.existsSync(path.join(this.tmpDir, this.filename))) {
                fs_1.unlinkSync(path.join(this.tmpDir, this.filename));
            }
            return new Buffer(data);
        });
    }
}
exports.default = LunaEscpos;
