"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._MenusRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const MenuController_1 = __importDefault(require("../../controller/Configuracion/MenuController"));
//INICIALIZAR RUTAS PARA PERFILES
exports._MenusRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE PERFIL
const MenuController = new MenuController_1.default();
exports._MenusRouter.route('/modulo/:id_modulo')
    .get(Autorizacion_1._Autorizacion, MenuController.Obtener_Menus) //OBTENER TODOS LOS MENUS DEL MODULO
    .post(Autorizacion_1._Autorizacion, MenuController.Insertar_Menu); //CREAR MENU
exports._MenusRouter.route('/:id_menu')
    .get(Autorizacion_1._Autorizacion, MenuController.Buscar_Menu)
    .patch(Autorizacion_1._Autorizacion, MenuController.Editar_Menu) //EDITAR SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, MenuController.Cambiar_Estado_Menu); //CAMBIAR ESTADO DEL PERFIL POR ID
