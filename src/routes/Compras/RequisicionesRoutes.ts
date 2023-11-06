import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import RequisicionesController from "../../controller/Compras/RequisicionesController";

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _RequisicionesRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new RequisicionesController()

_RequisicionesRouter.route('/requisiciones')
    .get(_Autorizacion, EmpresaController.Obtener_Requisiciones) //OBTENER TODOS LAS EMPRESAS
    .post(_Autorizacion, EmpresaController.Insertar_Requisicion) //CREAR EMPRESA

_RequisicionesRouter.route('/requisiciones/:id_requisicion')
    .get(_Autorizacion, EmpresaController.Buscar_Requisicion) //BUSCAR UNA EMPRESA SEGUN SU ID
//     .patch(_Autorizacion, EmpresaController.Editar_Producto_Empresa) //EDITAR SEGUN SU ID
//     .delete(_Autorizacion, EmpresaController.Cambiar_Estado_Producto) //CAMBIAR ESTADO DE LA EMPRESA POR ID

// _RequisicionesRouter.get('/productos-empresa/filtro', _Autorizacion, EmpresaController.Buscar_Producto_Empresa)

