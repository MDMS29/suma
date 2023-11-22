"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./config/server"));
const _routes = __importStar(require("./src/routes/App.Routes"));
server_1.default.use('/suma/api/usuarios', _routes._UsuarioRouter);
//DEFINIR RUTA DE LOS PERFILES
server_1.default.use('/suma/api/perfiles', _routes._PerfilesRouter);
//DEFINIR RUTA DE LOS MÓDULOS
server_1.default.use('/suma/api/modulos', _routes._ModulosRouter);
//DEFINIR RUTA DE LOS ROLES
server_1.default.use('/suma/api/roles', _routes._RolesRouter);
//DEFINIR RUTA DE LOS MENUS
server_1.default.use('/suma/api/menus', _routes._MenusRouter);
//DEFINIR RUTA DE LAS EMPRESAS
server_1.default.use('/suma/api/empresas', _routes._EmpresasRouter);
//DEFINIR RUTAS PARA LAS OPCIONES BASICAS
server_1.default.use('/suma/api/opciones-basicas', _routes._OpcionesBasicasRouter);
//DEFINIR RUTAS PARA LOS PRODUCTOS
server_1.default.use('/suma/api/opciones-basicas/productos-empresa', _routes._ProductosRouter);
//DEFINIR RUTAS PARA LAS REQUISICIONES
server_1.default.use('/suma/api/compras', _routes._RequisicionesRouter);
//MIDDLEWARE PARA LAS RUTAS NO ENCONTRADAS CUANDO EL CLIENTE REALICE ALGUNA CONSULTA
server_1.default.use((_, res) => {
    res.status(405).send({ error: true, message: "No se ha encontrado la request" });
});
