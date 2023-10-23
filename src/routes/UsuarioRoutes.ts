import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import UsuarioController from "../controller/UsuarioController";

//DEFINICÍON DE EL ROUTER
export const _UsuarioRouter = Router();

//DEFINICIÓN DEL CONTROLADOR DEL USUARIO
const _UsuarioController = new UsuarioController();

//DEFINICIÓN DE LAS RUTAS DEL USUARIO
//--AUTENTICACIÓN DE USUARIO
_UsuarioRouter.post('/autenticar_usuario', _UsuarioController.Autenticar_Usuario);

_UsuarioRouter.route('/')
    .get(_Autorizacion, _UsuarioController.Obtener_Usuarios) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
    .post(_Autorizacion, _UsuarioController.Crear_Usuario);//CREACIÓN DEL USUARIO

// OBTENER EL PERFIL DEL USUARIO 
_UsuarioRouter.get('/perfil', _Autorizacion, _UsuarioController.Perfil_Usuario)

_UsuarioRouter.route('/:id_usuario')
    .get(_Autorizacion, _UsuarioController.Buscar_Usuario)//BUSCAR USUARIO CON POR MEDIO DE SU ID
    .patch(_Autorizacion, _UsuarioController.Editar_Usuario)//EDITAR EL USUARIO POR ID
    .delete(_Autorizacion, _UsuarioController.Cambiar_Estado_Usuario)//CAMBIAR EL ESTADO DEL USUARIO POR ID

_UsuarioRouter.patch('/cambiar_clave/:id_usuario', _Autorizacion, _UsuarioController.Cambiar_Clave_Usuario) //CAMBIAR CONTRASEÑA DEL USUARIO POR ID

_UsuarioRouter.patch('/restablecer_clave/:id_usuario', _Autorizacion, _UsuarioController.Resetear_Clave_Usuario) //RSETEAR LA CLAVE DEL USUARIO CUANDO SE LE HAYA ENVIADO EL CORREO
