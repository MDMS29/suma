import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import _ModuloController from "../../controller/Configuracion/ModuloController";

//INICIALIZAR RUTAS PARA PERFILES
export const _ModulosRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const ModuloController = new _ModuloController()


_ModulosRouter.route('/')
    .get(_Autorizacion, ModuloController.Obtener_Modulos) //OBTENER TODOS LOS PERFILES
    .post(_Autorizacion, ModuloController.Insertar_Modulo) //INSERTAR PERFIL

_ModulosRouter.route('/:id_modulo')
.get(_Autorizacion, ModuloController.Buscar_Modulo)
    .patch(_Autorizacion, ModuloController.Editar_Modulo) //EDITAR PERFIL SEGUN SU ID
    .delete(_Autorizacion, ModuloController.Cambiar_Estado_Modulo) //CAMBIAR ESTADO DEL PERFIL POR ID
