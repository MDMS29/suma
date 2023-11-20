"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._RolesRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../middleware/Autorizacion");
const RolController_1 = require("../controller/RolController");
//INICIALIZAR RUTAS PARA ROLES
exports._RolesRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE ROLES
const RolController = new RolController_1._RolController();
exports._RolesRouter.route('/')
    .get(Autorizacion_1._Autorizacion, RolController.Obtener_Roles) //OBTENER TODOS LOS ROLES
    .post(Autorizacion_1._Autorizacion, RolController.Insertar_Rol); //INSERTAR ROL
exports._RolesRouter.route('/:id_rol')
    .get(Autorizacion_1._Autorizacion, RolController.Buscar_Rol) //BUSCAR EL ROL SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, RolController.Editar_Rol) //EDITAR ROL SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, RolController.Cambiar_Estado_Rol); //CAMBIAR ESTADO DEL ROL POR ID
