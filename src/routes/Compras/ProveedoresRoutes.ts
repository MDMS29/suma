import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import ProveedoresController from "../../controller/Compras/ProveedoresController";

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _ProveedoresRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const _ProveedoresController = new ProveedoresController()

_ProveedoresRouter.route('/')
    .get(_Autorizacion, _ProveedoresController.Obtener_Proveedores) //OBTENER TODOS LAS REQUISICIONES
    .post(_Autorizacion, _ProveedoresController.Insertar_Proveedor) //CREAR REQUISICION

_ProveedoresRouter.route('/:id_proveedor')
    .get(_Autorizacion, _ProveedoresController.Buscar_Proveedor) //BUSCAR UNA REQUISICION SEGUN SU ID
    .patch(_Autorizacion, _ProveedoresController.Editar_Proveedor) //EDITAR SEGUN SU ID
    .delete(_Autorizacion, _ProveedoresController.Cambiar_Estado_Proveedor) //CAMBIAR ESTADO DE LA REQUISICION POR ID

export default _ProveedoresRouter