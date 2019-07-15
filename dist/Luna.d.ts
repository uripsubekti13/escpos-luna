/// <reference types="node" />
import Printer from "./Printer";
export default class LunaEscpos {
    printer: Printer;
    tmpDir: string;
    filename: string;
    constructor(tmpDir?: string);
    addLogo(imgPath: string): Promise<void>;
    addText(text: string): Promise<void>;
    addLines(lines: string[]): Promise<void>;
    openCashDrawer(): Promise<void>;
    openCashDrawer2(): Promise<void>;
    cutPaper(): Promise<void>;
    getBuffer(): Promise<Buffer>;
}
