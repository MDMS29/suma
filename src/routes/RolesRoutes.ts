import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import { _RolController } from "../controller/RolController";

//INICIALIZAR RUTAS PARA PERFILES
export const _RolesRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const RolController = new _RolController()


_RolesRouter.route('/')
    .get(_Autorizacion, RolController.ObtenerRoles) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion, RolController.InsertarRol) //INSERTAR ROL

_RolesRouter.route('/:id_rol')
    .get(_Autorizacion, RolController.BuscarRol)
    .patch(_Autorizacion, RolController.EditarRol) //EDITAR PERFIL SEGUN SU ID
    .delete(_Autorizacion, RolController.CambiarEstadoRol) //CAMBIAR ESTADO DEL PERFIL POR ID
