import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import UsuarioController from "../controller/UsuarioController";

//DEFINICÍON DE EL ROUTER
export const _Usuario_Router = Router();

//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const _UsuarioController = new UsuarioController();

//DEFINICIÓN DE LAS RUTAS DEL USUARIO
//--AUTENTICACIÓN DE USUARIO
_Usuario_Router.post('/autenticar_usuario', _UsuarioController.AutenticarUsuario);

_Usuario_Router.route('/')
    .get(_Autorizacion, _UsuarioController.ObtenerUsuarios) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
    .post(_Autorizacion, _UsuarioController.CrearUsuario);//CREACIÓN DEL USUARIO

// OBTENER EL PERFIL DEL USUARIO 
_Usuario_Router.get('/perfil', _Autorizacion, _UsuarioController.PerfilUsuario)

_Usuario_Router.route('/:id_usuario')
    .get(_Autorizacion, _UsuarioController.BuscarUsuario)//BUSCAR USUARIO CON POR MEDIO DE SU ID
    .patch(_Autorizacion, _UsuarioController.EditarUsuario)//EDITAR EL USUARIO POR ID
    .delete(_Autorizacion, _UsuarioController.CambiarEstadoUsuario)//CAMBIAR EL ESTADO DEL USUARIO POR ID

_Usuario_Router.post('/cambiar-clave/:id_usuario', _Autorizacion, _UsuarioController.CambiarClaveUsuario) //CAMBIAR CONTRASEÑA DEL USUARIO POR ID