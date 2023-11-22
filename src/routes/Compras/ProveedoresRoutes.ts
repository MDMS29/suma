import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import ProveedoresController from "../../controller/Compras/ProveedoresController";

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _ProveedoresRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const _ProveedoresController = new ProveedoresController()

_ProveedoresRouter.route('/')
    .get(_Autorizacion, _ProveedoresController.Obtener_Proveedores) //OBTENER TODOS LAS REQUISICIONES
//     .post(_Autorizacion, _ProveedoresController.Insertar_Requisicion) //CREAR REQUISICION

// _ProveedoresRouter.route('/requisiciones/:id_requisicion')
//     .get(_Autorizacion, _ProveedoresController.Buscar_Requisicion) //BUSCAR UNA REQUISICION SEGUN SU ID
//     .patch(_Autorizacion, _ProveedoresController.Editar_Requisicion) //EDITAR SEGUN SU ID
//     .delete(_Autorizacion, _ProveedoresController.Cambiar_Estado_Requisicion) //CAMBIAR ESTADO DE LA REQUISICION POR ID

export default _ProveedoresRouter