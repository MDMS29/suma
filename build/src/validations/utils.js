"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerarLlavesSecretas = exports.EstadosTablas = exports.generarJWT = exports._ParseClave = exports._ParseCorreo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _ParseCorreo = (correo) => {
    if (!EsString(correo)) {
        throw new Error("¡Correo Invalido!");
    }
    return correo;
};
exports._ParseCorreo = _ParseCorreo;
const _ParseClave = (clave) => {
    if (!EsString(clave)) {
        throw new Error("¡Clave Invalida!");
    }
    return clave;
};
exports._ParseClave = _ParseClave;
const EsString = (string) => {
    return typeof string === 'string';
};
// FUNCION PARA GENERAR EL TOKEN DE ACCESO DEL USUARIO
const generarJWT = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });
};
exports.generarJWT = generarJWT;
// ESTADOS SEGUN LA TABLA DE ESTADO EN LA BASE DE DATOS
exports.EstadosTablas = {
    ESTADO_ACTIVO: 1,
    ESTADO_INACTIVO: 1
};
const GenerarLlavesSecretas = () => {
    const random = Math.random().toString(15).substr(2);
    const fecha = Date.now().toString(15);
    return random + fecha;
};
exports.GenerarLlavesSecretas = GenerarLlavesSecretas;
