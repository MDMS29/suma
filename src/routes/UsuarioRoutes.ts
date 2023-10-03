import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _UsuarioController } from "../controller/UsuarioController";

//DEFINICÍON DE EL ROUTER
export const _UsuarioRouter = Router();

//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const UsuarioController = new _UsuarioController();

//DEFINICIÓN DE LAS RUTAS DEL USUARIO

//--AUTENTICACIÓN DE USUARIO
_UsuarioRouter.post('/autenticar_usuario', UsuarioController.AutenticarUsuario);

_UsuarioRouter.route('/')
    .post(_Autorizacion, UsuarioController.CrearUsuario);//CREACIÓN DEL USUARIO

//BUSCAR USUARIO CON POR MEDIO DE SU ID
_UsuarioRouter.get('/:id_usuario', _Autorizacion, UsuarioController.BuscarUsuario)
