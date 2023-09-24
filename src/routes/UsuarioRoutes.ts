import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _UsuarioController } from "../controller/UsuarioController";

export const _UsuarioRouter = Router();

const UsuarioController = new _UsuarioController();


_UsuarioRouter.post('/autenticar_usuario', UsuarioController.AutenticarUsuario);

_UsuarioRouter.get('/', _Autorizacion, UsuarioController.ObtenerUsuarios);
_UsuarioRouter.post('/', _Autorizacion, UsuarioController.CrearUsuario);
_UsuarioRouter.patch('/:id', _Autorizacion, UsuarioController.ModificarUsuario);
_UsuarioRouter.delete('/:id', _Autorizacion, UsuarioController.EliminarUsuario);
