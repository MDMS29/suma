"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._PerfilesRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../middleware/Autorizacion");
const PerfilController_1 = require("../controller/PerfilController");
//INICIALIZAR RUTAS PARA PERFILES
exports._PerfilesRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE PERFIL
const PerfilController = new PerfilController_1._PerfilController();
exports._PerfilesRouter.route('/')
    .get(Autorizacion_1._Autorizacion, PerfilController.ObtenerPerfiles) //OBTENER TODOS LOS PERFILES
    .post(Autorizacion_1._Autorizacion, PerfilController.InsertarPerfil); //INSERTAR PERFIL
exports._PerfilesRouter.post('/modulos', Autorizacion_1._Autorizacion, PerfilController.ObtenerModulosPerfiles); // OBTENER LOS MODULOS DE LOS PERFILES
exports._PerfilesRouter.route('/:id_perfil')
    .patch(Autorizacion_1._Autorizacion, PerfilController.EditarPerfil) //EDITAR PERFIL SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, PerfilController.CambiarEstadoPerfil); //CAMBIAR ESTADO DEL PERFIL POR ID
