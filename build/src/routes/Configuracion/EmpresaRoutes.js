"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._EmpresasRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const EmpresaController_1 = __importDefault(require("../../controller/Configuracion/EmpresaController"));
//INICIALIZAR RUTAS PARA LAS EMPRESAS
exports._EmpresasRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new EmpresaController_1.default();
exports._EmpresasRouter.route('/')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Obtener_Empresas) //OBTENER TODOS LAS EMPRESAS
    .post(Autorizacion_1._Autorizacion, EmpresaController.Insertar_Empresa); //CREAR EMPRESA
exports._EmpresasRouter.route('/:id_empresa')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Buscar_Empresa) //BUSCAR UNA EMPRESA SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, EmpresaController.Editar_Empresa) //EDITAR SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, EmpresaController.Cambiar_Estado_Empresa); //CAMBIAR ESTADO DE LA EMPRESA POR ID
