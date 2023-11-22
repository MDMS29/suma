"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generar_Llaves_Secretas = exports.EstadosTablas = exports.generarJWT = exports._Parse_Clave = exports._Parse_Correo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const _Parse_Correo = (correo) => {
    if (!EsString(correo)) {
        throw new Error("¡Correo Invalido!");
    }
    return correo;
};
exports._Parse_Correo = _Parse_Correo;
const _Parse_Clave = (clave) => {
    if (!EsString(clave)) {
        throw new Error("¡Clave Invalida!");
    }
    return clave;
};
exports._Parse_Clave = _Parse_Clave;
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
    ESTADO_INACTIVO: 2
};
const Generar_Llaves_Secretas = () => {
    const random = Math.random().toString(15).substr(2);
    const fecha = Date.now().toString(15);
    return random + fecha;
};
exports.Generar_Llaves_Secretas = Generar_Llaves_Secretas;
