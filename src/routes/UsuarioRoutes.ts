import { Router } from "express";
import { Autorizacion } from "../middleware/Autorizacion";
import { _UsuarioController } from "../controller/UsuarioController";
import { UsuarioLogeado } from "../validations/Types";

export const _UsuarioRouter = Router()

const UsuarioController = new _UsuarioController()

declare global {
    namespace Express {
        interface Request {
            usuario?: UsuarioLogeado;
        }
    }
}

_UsuarioRouter.post('/auth', UsuarioController.AutenticarUsuario)

_UsuarioRouter.get('/', Autorizacion, UsuarioController.ObtenerUsuarios)

_UsuarioRouter.post('/', Autorizacion, UsuarioController.CrearUsuario)

_UsuarioRouter.patch('/:id', Autorizacion, UsuarioController.ModificarUsuario)

_UsuarioRouter.delete('/:id', Autorizacion, UsuarioController.EliminarUsuario)