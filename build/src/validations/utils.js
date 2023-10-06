"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = exports._ParseClave = exports._ParseCorreo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _ParseCorreo = (correo) => {
    if (!EsString(correo)) {
        throw new Error("¡Correo Invalido!");
    }
    return correo;
};
exports._ParseCorreo = _ParseCorreo;
const _ParseClave = (correo) => {
    if (!EsString(correo)) {
        throw new Error("¡Clave Invalida!");
    }
    return correo;
};
exports._ParseClave = _ParseClave;
const EsString = (string) => {
    return typeof string === 'string';
};
const generarJWT = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });
};
exports.generarJWT = generarJWT;
