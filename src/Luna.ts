import { Justification, RasterMode, DrawerPin } from "./Commands";
import Image from "./Image";
import Printer from "./Printer";
import * as path from "path";
import { existsSync, unlinkSync } from "fs";

export default class LunaEscpos {
  printer: Printer;
  tmpDir: string;
  constructor(encoding: string = "CP865") {
    this.printer = new Printer(encoding);
    this.printer.open();
    this.printer.clearBuffer();
    this.printer.init();
    this.printer.setJustification(Justification.Center);
  }

  public async addLogo(imgPath: string) {
    try {
      const image = await Image.load(imgPath);
      this.printer.raster(image, RasterMode.Normal);
      return this.printer;
    } catch (error) {
      console.log(error);
      return false;
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
    // if (existsSync(path.join(this.tmpDir, this.filename))) {
    //   unlinkSync(path.join(this.tmpDir, this.filename));
    // }
    return new Buffer(data);
  }
}
