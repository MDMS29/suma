"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._ModulosRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const ModuloController_1 = __importDefault(require("../../controller/Configuracion/ModuloController"));
//INICIALIZAR RUTAS PARA PERFILES
exports._ModulosRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE PERFIL
const ModuloController = new ModuloController_1.default();
exports._ModulosRouter.route('/')
    .get(Autorizacion_1._Autorizacion, ModuloController.Obtener_Modulos) //OBTENER TODOS LOS PERFILES
    .post(Autorizacion_1._Autorizacion, ModuloController.Insertar_Modulo); //INSERTAR PERFIL
exports._ModulosRouter.route('/:id_modulo')
    .get(Autorizacion_1._Autorizacion, ModuloController.Buscar_Modulo)
    .patch(Autorizacion_1._Autorizacion, ModuloController.Editar_Modulo) //EDITAR PERFIL SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, ModuloController.Cambiar_Estado_Modulo); //CAMBIAR ESTADO DEL PERFIL POR ID
