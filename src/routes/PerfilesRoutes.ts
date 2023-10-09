import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _PerfilController } from "../controller/PerfilController";

export const _PerfilesRouter = Router()

const PerfilController = new _PerfilController()

//OBTENER TODOS LOS PERFILES
_PerfilesRouter.route('/')
    .get(_Autorizacion, PerfilController.ObtenerPerfiles)
    .post(_Autorizacion, PerfilController.InsertarPerfil)

_PerfilesRouter.get('/modulos', _Autorizacion, PerfilController.ObtenerModulosPerfiles)
