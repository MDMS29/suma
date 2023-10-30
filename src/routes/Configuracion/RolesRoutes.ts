import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import { _RolController } from "../../controller/Configuracion/RolController";

//INICIALIZAR RUTAS PARA ROLES
export const _RolesRouter = Router()

//INICIALIZAR CONTROLADOR DE ROLES
const RolController = new _RolController()


_RolesRouter.route('/')
    .get(_Autorizacion, RolController.Obtener_Roles) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion, RolController.Insertar_Rol) //INSERTAR ROL

_RolesRouter.route('/:id_rol')
    .get(_Autorizacion, RolController.Buscar_Rol) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion, RolController.Editar_Rol) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion, RolController.Cambiar_Estado_Rol) //CAMBIAR ESTADO DEL ROL POR ID
