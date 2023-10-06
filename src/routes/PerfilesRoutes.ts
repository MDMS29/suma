import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _PerfilController } from "../controller/PerfilController";

export const _PerfilesRouter = Router()

const PerfilController = new _PerfilController()

//OBTENER TODOS LOS PERFILES
_PerfilesRouter.get('/', _Autorizacion, PerfilController.ObtenerPerfiles)