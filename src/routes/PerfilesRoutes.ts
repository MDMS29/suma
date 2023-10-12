import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _PerfilController } from "../controller/PerfilController";

//INICIALIZAR RUTAS PARA PERFILES
export const _PerfilesRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const PerfilController = new _PerfilController()


_PerfilesRouter.route('/')
    .get(_Autorizacion, PerfilController.ObtenerPerfiles) //OBTENER TODOS LOS PERFILES
    .post(_Autorizacion, PerfilController.InsertarPerfil) //INSERTAR PERFIL

_PerfilesRouter.post('/modulos', _Autorizacion, PerfilController.ObtenerModulosPerfiles)// OBTENER LOS MODULOS DE LOS PERFILES

_PerfilesRouter.route('/:id_perfil')
.get(_Autorizacion, PerfilController.BuscarPerfil)
    .patch (_Autorizacion, PerfilController.EditarPerfil) //EDITAR PERFIL SEGUN SU ID
    .delete(_Autorizacion, PerfilController.CambiarEstadoPerfil) //CAMBIAR ESTADO DEL PERFIL POR ID
