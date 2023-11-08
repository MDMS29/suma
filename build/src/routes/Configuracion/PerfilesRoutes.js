"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PerfilesRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const PerfilController_1 = require("../../controller/Configuracion/PerfilController");
//INICIALIZAR RUTAS PARA PERFILES
exports._PerfilesRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE PERFIL
const PerfilController = new PerfilController_1._PerfilController();
exports._PerfilesRouter.route('/')
    .get(Autorizacion_1._Autorizacion, PerfilController.Obtener_Perfiles) //OBTENER TODOS LOS PERFILES
    .post(Autorizacion_1._Autorizacion, PerfilController.Insertar_Perfil); //INSERTAR PERFIL
exports._PerfilesRouter.post('/modulos', Autorizacion_1._Autorizacion, PerfilController.Obtener_Modulos_Perfiles); // OBTENER LOS MODULOS DE LOS PERFILES
exports._PerfilesRouter.route('/:id_perfil')
    .get(Autorizacion_1._Autorizacion, PerfilController.Buscar_Perfil)
    .patch(Autorizacion_1._Autorizacion, PerfilController.Editar_Perfil) //EDITAR PERFIL SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, PerfilController.Cambiar_Estado_Perfil); //CAMBIAR ESTADO DEL PERFIL POR ID
