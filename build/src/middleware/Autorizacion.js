"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Autorizacion = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Service_Usuario_1 = require("../services/Service.Usuario");
const Autorizacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ServiceUsuario = new Service_Usuario_1._UsuarioService();
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw new Error('Token no proporcionado');
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const usuario = yield ServiceUsuario.BuscarUsuario(+decoded.id);
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }
            req.usuario = usuario;
            return next();
        }
        catch (error) {
            console.error('Error al verificar el token:', error);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
});
exports.Autorizacion = Autorizacion;
