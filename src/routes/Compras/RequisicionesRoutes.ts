import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import RequisicionesController from "../../controller/Compras/RequisicionesController";

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _RequisicionesRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const _RequisicionesController = new RequisicionesController()

_RequisicionesRouter.route('/filtrar')
    .post(_Autorizacion, _RequisicionesController.Obtener_Requisiciones_Filtro) //OBTENER TODOS LAS REQUISICIONES

_RequisicionesRouter.route('/')
    .get(_Autorizacion, _RequisicionesController.Obtener_Requisiciones) //OBTENER TODOS LAS REQUISICIONES
    .post(_Autorizacion, _RequisicionesController.Insertar_Requisicion) //CREAR REQUISICION

_RequisicionesRouter.route('/:id_requisicion')
    .get(_Autorizacion, _RequisicionesController.Buscar_Requisicion) //BUSCAR UNA REQUISICION SEGUN SU ID
    .patch(_Autorizacion, _RequisicionesController.Editar_Requisicion) //EDITAR SEGUN SU ID
    .delete(_Autorizacion, _RequisicionesController.Cambiar_Estado_Requisicion) //CAMBIAR ESTADO DE LA REQUISICION POR ID

_RequisicionesRouter.route('/detalles/pendientes/:id_requisicion')
.get(_Autorizacion, _RequisicionesController.Buscar_Requisicion) //BUSCAR LOS DETALLES PENDIENTES DE LA REQUISICION

_RequisicionesRouter.route('/detalles/:id_requisicion')
    .patch(_Autorizacion, _RequisicionesController.Aprobar_Desaprobar_Detalle) //CAMBIAR ESTADO DE LA REQUISICION POR ID

_RequisicionesRouter.route('/doc/:id_requisicion')
    .get(_Autorizacion, _RequisicionesController.Generar_PDF_Requisicion)
// _RequisicionesRouter.get('/productos-empresa/filtro', _Autorizacion, _RequisicionesController.Buscar_Producto_Empresa)


export default _RequisicionesRouter