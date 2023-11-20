import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import RequisicionesController from "../../controller/Compras/RequisicionesController";

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _RequisicionesRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new RequisicionesController()

_RequisicionesRouter.route('/requisiciones/filtrar')
    .get(_Autorizacion, EmpresaController.Obtener_Requisiciones_Filtro) //OBTENER TODOS LAS REQUISICIONES
    
_RequisicionesRouter.route('/requisiciones')
    .get(_Autorizacion, EmpresaController.Obtener_Requisiciones) //OBTENER TODOS LAS REQUISICIONES
    .post(_Autorizacion, EmpresaController.Insertar_Requisicion) //CREAR REQUISICION

_RequisicionesRouter.route('/requisiciones/:id_requisicion')
    .get(_Autorizacion, EmpresaController.Buscar_Requisicion) //BUSCAR UNA REQUISICION SEGUN SU ID
    .patch(_Autorizacion, EmpresaController.Editar_Requisicion) //EDITAR SEGUN SU ID
    .delete(_Autorizacion, EmpresaController.Cambiar_Estado_Requisicion) //CAMBIAR ESTADO DE LA REQUISICION POR ID

_RequisicionesRouter.route('/requisiciones/detalles/:id_requisicion')
    .patch(_Autorizacion, EmpresaController.Aprobar_Desaprobar_Detalle) //CAMBIAR ESTADO DE LA REQUISICION POR ID

_RequisicionesRouter.route('/requisiciones/doc/:id_requisicion')
    .get(_Autorizacion, EmpresaController.Generar_PDF_Requisicion)
// _RequisicionesRouter.get('/productos-empresa/filtro', _Autorizacion, EmpresaController.Buscar_Producto_Empresa)


export default _RequisicionesRouter