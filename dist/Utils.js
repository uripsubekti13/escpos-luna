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
const fs_1 = require("fs");
const http = require("http");
const https = require("https");
const OK = 200;
function createStreamFromPath(path) {
    return __awaiter(this, void 0, void 0, function* () {
        if (path.match("^https?:\/\/.*$") !== null) {
            return yield getRequestStream(path);
        }
        else {
            return fs_1.createReadStream(path);
        }
    });
}
exports.createStreamFromPath = createStreamFromPath;
function getRequestStream(address) {
    return address.startsWith("https")
        ? getRequestStreamHttps(address)
        : getRequestStreamHttp(address);
}
exports.getRequestStream = getRequestStream;
function getRequestStreamHttp(address) {
    return new Promise((resolve, reject) => {
        const request = http.get(address, (response) => {
            if (response.statusCode !== OK) {
                reject(new Error("Request failed, status code: " + response.statusCode));
            }
            resolve(response);
        });
        request.on("error", (err) => reject(err));
    });
}
function getRequestStreamHttps(address) {
    return new Promise((resolve, reject) => {
        const request = https.get(address, (response) => {
            if (response.statusCode !== OK) {
                reject(new Error("Request failed, status code: " + response.statusCode));
            }
            resolve(response);
        });
        request.on("error", (err) => reject(err));
    });
}
