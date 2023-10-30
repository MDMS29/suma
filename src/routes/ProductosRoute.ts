import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _RolController } from "../controller/RolController";

//INICIALIZAR RUTAS PARA ROLES
export const _ProductosRouter = Router()

//INICIALIZAR CONTROLADOR DE ROLES
// const RolController = new _RolController()


_ProductosRouter.route('/')
    .get(_Autorizacion, ) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion, ) //INSERTAR ROL

_ProductosRouter.route('/:id_rol')
    .get(_Autorizacion, ) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion, ) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion, ) //CAMBIAR ESTADO DEL ROL POR ID
