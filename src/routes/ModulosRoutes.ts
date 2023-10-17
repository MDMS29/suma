import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _ModuloController } from "../controller/ModuloController";

//INICIALIZAR RUTAS PARA PERFILES
export const _ModulosRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const ModuloController = new _ModuloController()


_ModulosRouter.route('/')
    .get(_Autorizacion, ModuloController.ObtenerModulos) //OBTENER TODOS LOS PERFILES
    .post(_Autorizacion, ModuloController.InsertarModulo) //INSERTAR PERFIL

_ModulosRouter.route('/:id_modulo')
.get(_Autorizacion, ModuloController.BuscarModulo)
    .patch(_Autorizacion, ModuloController.EditarModulo) //EDITAR PERFIL SEGUN SU ID
    .delete(_Autorizacion, ModuloController.CambiarEstadoModulo) //CAMBIAR ESTADO DEL PERFIL POR ID
