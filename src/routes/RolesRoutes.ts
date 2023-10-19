import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
// import { _ModuloController } from "../controller/ModuloController";
import { _RolController } from "../controller/RolController";

//INICIALIZAR RUTAS PARA PERFILES
export const _RolesRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const RolController = new _RolController()


_RolesRouter.route('/')
    .get(_Autorizacion, RolController.ObtenerRoles) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion, RolController.InsertarRol) //INSERTAR ROL

// _RolesRouter.route('/:id_modulo')
// .get(_Autorizacion, RolController.BuscarModulo)
//     .patch(_Autorizacion, RolController.EditarModulo) //EDITAR PERFIL SEGUN SU ID
//     .delete(_Autorizacion, RolController.CambiarEstadoModulo) //CAMBIAR ESTADO DEL PERFIL POR ID
