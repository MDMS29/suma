import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import _OrdenesController from "../../controller/Compras/OrdenesController";

//INICIALIZAR RUTAS PARA LAS ORDENES
export const _OrdenesRouter = Router()


//INICIALIZAR CONTROLADOR PARA LAS ORDENES
const OrdenesController = new _OrdenesController()

_OrdenesRouter.route('/')
    .get(_Autorizacion, OrdenesController.Obtener_Ordenes) //OBTENER TODAS LAS ORDENES DE COMPRA
export default _OrdenesRouter