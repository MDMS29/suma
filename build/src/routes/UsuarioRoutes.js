"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._Usuario_Router = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../middleware/Autorizacion");
const UsuarioController_1 = __importDefault(require("../controller/UsuarioController"));
//DEFINICÍON DE EL ROUTER
exports._Usuario_Router = (0, express_1.Router)();
//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const _UsuarioController = new UsuarioController_1.default();
//DEFINICIÓN DE LAS RUTAS DEL USUARIO
//--AUTENTICACIÓN DE USUARIO
exports._Usuario_Router.post('/autenticar_usuario', _UsuarioController.AutenticarUsuario);
exports._Usuario_Router.route('/')
    .get(Autorizacion_1._Autorizacion, _UsuarioController.ObtenerUsuarios) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
    .post(Autorizacion_1._Autorizacion, _UsuarioController.CrearUsuario); //CREACIÓN DEL USUARIO
// OBTENER EL PERFIL DEL USUARIO 
exports._Usuario_Router.get('/perfil', Autorizacion_1._Autorizacion, _UsuarioController.PerfilUsuario);
exports._Usuario_Router.route('/:id_usuario')
    .get(Autorizacion_1._Autorizacion, _UsuarioController.BuscarUsuario) //BUSCAR USUARIO CON POR MEDIO DE SU ID
    .patch(Autorizacion_1._Autorizacion, _UsuarioController.EditarUsuario) //EDITAR EL USUARIO POR ID
    .delete(Autorizacion_1._Autorizacion, _UsuarioController.CambiarEstadoUsuario); //CAMBIAR EL ESTADO DEL USUARIO POR ID
exports._Usuario_Router.patch('/cambiar_clave/:id_usuario', Autorizacion_1._Autorizacion, _UsuarioController.CambiarClaveUsuario); //CAMBIAR CONTRASEÑA DEL USUARIO POR ID
