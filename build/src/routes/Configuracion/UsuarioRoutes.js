"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const UsuarioController_1 = __importDefault(require("../../controller/Configuracion/UsuarioController"));
//DEFINICIÓN DEL ROUTER
const _UsuarioRouter = (0, express_1.Router)();
//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const _UsuarioController = new UsuarioController_1.default();
//DEFINICIÓN DE LAS RUTAS DEL USUARIO
//--AUTENTICACIÓN DE USUARIO
_UsuarioRouter.post('/autenticar_usuario', _UsuarioController.Autenticar_Usuario);
_UsuarioRouter.route('/')
    .get(Autorizacion_1._Autorizacion, _UsuarioController.Obtener_Usuarios) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
    .post(Autorizacion_1._Autorizacion, _UsuarioController.Crear_Usuario); //CREACIÓN DEL USUARIO
// OBTENER EL PERFIL DEL USUARIO 
_UsuarioRouter.get('/perfil', Autorizacion_1._Autorizacion, _UsuarioController.Perfil_Usuario);
_UsuarioRouter.route('/:id_usuario')
    .get(Autorizacion_1._Autorizacion, _UsuarioController.Buscar_Usuario) //BUSCAR USUARIO CON POR MEDIO DE SU ID
    .patch(Autorizacion_1._Autorizacion, _UsuarioController.Editar_Usuario) //EDITAR EL USUARIO POR ID
    .delete(Autorizacion_1._Autorizacion, _UsuarioController.Cambiar_Estado_Usuario); //CAMBIAR EL ESTADO DEL USUARIO POR ID
_UsuarioRouter.patch('/cambiar_clave/:id_usuario', Autorizacion_1._Autorizacion, _UsuarioController.Cambiar_Clave_Usuario); //CAMBIAR CONTRASEÑA DEL USUARIO POR ID
_UsuarioRouter.patch('/restablecer_clave/:id_usuario', Autorizacion_1._Autorizacion, _UsuarioController.Resetear_Clave_Usuario); //RSETEAR LA CLAVE DEL USUARIO CUANDO SE LE HAYA ENVIADO EL CORREO
exports.default = _UsuarioRouter;
