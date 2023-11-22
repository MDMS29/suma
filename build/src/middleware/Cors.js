"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const whiteList = [process.env.FRONT_END_URL];
exports.corsOptions = {
    origin: function (origin, callBack) {
        //Si el origin esta en la whiteList hacer:
        if (whiteList.includes(origin)) {
            //Consultar API
            callBack(null, true);
        }
        else {
            //No es permitido el request
            callBack(new Error("Error de Cors"));
        }
    }
};
