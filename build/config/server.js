"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const Autorizacion_1 = require("../src/middleware/Autorizacion");
//INICIALIZAR EL SERVIDOR CON EXPRESS
const server = (0, express_1.default)();
// MIDDLEWARES
server.disable('x-powered-by');
server.use(express_1.default.json());
server.use((0, cors_1.default)());
server.use((0, morgan_1.default)('dev'));
server.use(Autorizacion_1._Recoleccion_IP);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
server.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
exports.default = server;
