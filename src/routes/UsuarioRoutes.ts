import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _UsuarioController } from "../controller/UsuarioController";
import { _UsuarioService } from "../services/Service.Usuario";

//DEFINICÍON DE EL ROUTER
export const _Usuario_Router = Router();

//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const UsuarioController = new _UsuarioController(new _UsuarioService());

//DEFINICIÓN DE LAS RUTAS DEL USUARIO
//--AUTENTICACIÓN DE USUARIO
_Usuario_Router.post('/autenticar_usuario', UsuarioController.AutenticarUsuario);

_Usuario_Router.route('/')
    .get(_Autorizacion, UsuarioController.ObtenerUsuarios) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
    .post(_Autorizacion, UsuarioController.CrearUsuario);//CREACIÓN DEL USUARIO

// OBTENER EL PERFIL DEL USUARIO 
_Usuario_Router.get('/perfil', _Autorizacion, UsuarioController.PerfilUsuario)

_Usuario_Router.route('/:id_usuario')
    .get(_Autorizacion, UsuarioController.BuscarUsuario)//BUSCAR USUARIO CON POR MEDIO DE SU ID
    .patch(_Autorizacion, UsuarioController.EditarUsuario)//EDITAR EL USUARIO POR ID
    .delete(_Autorizacion, UsuarioController.CambiarEstadoUsuario)//CAMBIAR EL ESTADO DEL USUARIO POR ID