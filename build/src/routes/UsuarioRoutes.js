"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._UsuarioRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../middleware/Autorizacion");
const UsuarioController_1 = require("../controller/UsuarioController");
//DEFINICÍON DE EL ROUTER
exports._UsuarioRouter = (0, express_1.Router)();
//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const UsuarioController = new UsuarioController_1._UsuarioController();
//DEFINICIÓN DE LAS RUTAS DEL USUARIO
//--AUTENTICACIÓN DE USUARIO
exports._UsuarioRouter.post('/autenticar_usuario', UsuarioController.AutenticarUsuario);
exports._UsuarioRouter.route('/')
    .get(Autorizacion_1._Autorizacion, UsuarioController.ObtenerUsuarios) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
    .post(Autorizacion_1._Autorizacion, UsuarioController.CrearUsuario); //CREACIÓN DEL USUARIO
// OBTENER EL PERFIL DEL USUARIO 
exports._UsuarioRouter.get('/perfil', Autorizacion_1._Autorizacion, UsuarioController.PerfilUsuario);
//BUSCAR USUARIO CON POR MEDIO DE SU ID
exports._UsuarioRouter.route('/:id_usuario')
    .get(Autorizacion_1._Autorizacion, UsuarioController.BuscarUsuario)
    .patch(Autorizacion_1._Autorizacion, UsuarioController.EditarUsuario);
