import {
  Barcode,
  CodeTable,
  Font,
  Justification,
  PDF417ErrorCorrectLevel,
  PDF417Type,
  Position,
  QRErrorCorrectLevel,
  RasterMode,
  TextMode,
  Underline,
  DrawerPin
} from "./Commands";
import Image from "./Image";
import Printer from "./Printer";
import * as Jimp from "jimp";
import * as path from "path";
import { existsSync, unlinkSync } from "fs";

export default class LunaEscpos {
  printer: Printer;
  tmpDir: string;
  filename: string = "logo.png";
  constructor(tmpDir: string = "./") {
    this.tmpDir = tmpDir;
    this.printer = new Printer("CP865");
    this.printer.open();
    this.printer.clearBuffer();
    this.printer.init();
    this.printer.setJustification(Justification.Center);
  }

  public async addLogo(imgPath: string) {
    try {
      const img = await Jimp.read(imgPath);
      await img.writeAsync(path.join(this.tmpDir, this.filename));
      const image = await Image.load(path.join(this.tmpDir, this.filename));
      this.printer.raster(image, RasterMode.Normal);
    } catch (error) {
      console.log(error);
    }
  }

  public async addText(text: string) {
    this.printer.writeLine(text);
  }

  public async addLines(lines: string[]) {
    lines.forEach(line => this.printer.writeLine(line));
  }
  
  public async openCashDrawer() {
    this.printer.openDrawer(DrawerPin.Pin2);
  }

  public async openCashDrawer2() {
    this.printer.openDrawer(DrawerPin.Pin5);
  }

  public async cutPaper() {
    this.printer.cut();
  }

  public async getBuffer() {
    const data = await this.printer.close();
    if (existsSync(path.join(this.tmpDir, this.filename))) {
      unlinkSync(path.join(this.tmpDir, this.filename));
    }
    return new Buffer(data);
  }
}
