import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import _OrdenesController from "../../controller/Compras/OrdenesController";

//INICIALIZAR RUTAS PARA LAS ORDENES
export const _OrdenesRouter = Router()


//INICIALIZAR CONTROLADOR PARA LAS ORDENES
const OrdenesController = new _OrdenesController()

_OrdenesRouter.route('/')
    .get(_Autorizacion, OrdenesController.Obtener_Ordenes) //OBTENER TODAS LAS ORDENES
    .post(_Autorizacion, OrdenesController.Insertar_Orden) //INSERTAR UNA ORDEN

_OrdenesRouter.route('/:id_orden')
    .get(_Autorizacion, OrdenesController.Buscar_Orden) //BUSCAR UNA ORDEN POR SU ID
    .patch(_Autorizacion, OrdenesController.Editar_Orden) //EDITAR UNA ORDEN POR SU ID
    .delete(_Autorizacion, OrdenesController.Eliminar_Restaurar_Orden) //ELIMINAR O RESTAURAR UNA ORDEN POR SU ID
export default _OrdenesRouter