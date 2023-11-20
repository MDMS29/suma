"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generar_Llaves_Secretas = exports.Generar_JWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// FUNCION PARA GENERAR EL TOKEN DE ACCESO DEL USUARIO
const Generar_JWT = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2d' });
};
exports.Generar_JWT = Generar_JWT;
//FUNCION PARA GENERAR LLAVES ALEATORIAS
const Generar_Llaves_Secretas = () => {
    const random = Math.random().toString(15).substr(2);
    const fecha = Date.now().toString(15);
    return random + fecha;
};
exports.Generar_Llaves_Secretas = Generar_Llaves_Secretas;
