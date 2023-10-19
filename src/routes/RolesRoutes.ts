import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _RolController } from "../controller/RolController";

//INICIALIZAR RUTAS PARA ROLES
export const _RolesRouter = Router()

//INICIALIZAR CONTROLADOR DE ROLES
const RolController = new _RolController()


_RolesRouter.route('/')
    .get(_Autorizacion, RolController.ObtenerRoles) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion, RolController.InsertarRol) //INSERTAR ROL

_RolesRouter.route('/:id_rol')
    .get(_Autorizacion, RolController.BuscarRol) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion, RolController.EditarRol) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion, RolController.CambiarEstadoRol) //CAMBIAR ESTADO DEL ROL POR ID
