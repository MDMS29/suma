import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import _HistorialController from "../../controller/Auditoria/AuditoriaController";

//INICIALIZAR RUTAS PARA EL HISTORIAL
export const _HistorialRouter = Router()

//INICIALIZAR CONTROLADOR DE HISTORIAL
const HistorialController = new _HistorialController()

_HistorialRouter.route('/historial/logs')
    .get(_Autorizacion, HistorialController.Obtener_Logs_Auditoria) //OBTENER TODOS EL HISTORIAL DEL APLICATIVO

export default _HistorialRouter