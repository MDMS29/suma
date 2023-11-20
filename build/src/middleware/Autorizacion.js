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
exports._Recoleccion_IP = exports._Autorizacion = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Usuario_service_1 = __importDefault(require("../services/Configuracion/Usuario.service"));
const _Autorizacion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const service_usuario = new Usuario_service_1.default();
        if (!process.env.JWT_SECRET) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada');
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.json({ error: true, message: 'Inicie sesión para continuar' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const usuario = yield service_usuario.Buscar_Usuario(decoded.id, '');
            if (usuario === undefined) {
                return res.json({ error: true, message: 'Usuario no encontrado' });
            }
            req.usuario = usuario;
            return next();
        }
        catch (error) {
            return res.json({ error: true, message: 'Inicie sesión para continuar' });
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports._Autorizacion = _Autorizacion;
const _Recoleccion_IP = (_, __, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch('https://ipinfo.io?token=70210017b789f6');
        const json = yield data.json();
        console.log('------------------------------------------------');
        console.log('IP Cliente: ' + json.ip);
        console.log(`Ubicación: ${json.country} ${json.region}/${json.city}`);
        console.log('Fecha:', new Date(Date.now()));
        console.log('------------------------------------------------');
        next();
    }
    catch (error) {
        next();
        console.log(error);
    }
});
exports._Recoleccion_IP = _Recoleccion_IP;
