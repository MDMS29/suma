import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _UsuarioController } from "../controller/UsuarioController";

export const _UsuarioRouter = Router();

const UsuarioController = new _UsuarioController();

_UsuarioRouter.post('/autenticar_usuario', UsuarioController.AutenticarUsuario);

_UsuarioRouter.route('/modulos/:id_usuario').get(_Autorizacion, UsuarioController.ObtenerModulosUsuario)


_UsuarioRouter.route('/')
    .get(_Autorizacion, UsuarioController.ObtenerUsuarios)
    .post(_Autorizacion, UsuarioController.CrearUsuario);

_UsuarioRouter.get('/menus/:id_usuario/:id_perfil', _Autorizacion, UsuarioController.ObtenerMenusUsuario)
_UsuarioRouter.get('/:id_usuario', _Autorizacion, UsuarioController.BuscarUsuario)

_UsuarioRouter.patch('/:id', _Autorizacion, UsuarioController.ModificarUsuario);
_UsuarioRouter.delete('/:id', _Autorizacion, UsuarioController.EliminarUsuario);
