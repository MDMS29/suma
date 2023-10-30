import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import UnidadesMedidaController from "../../controller/Opciones_Basicas/UnidadesMedidaController";


export const _BasicasProductosRouter = Router()

//INICIALIZAR CONTROLADOR DE ROLES
const _Unidad_Medida_Controller = new UnidadesMedidaController()

/* UNIDADES DE MEDIDAD PARA LOS PRODUCTOS 
_BasicasProductosRouter.route('/')
    .get(_Autorizacion,) //OBTENER TODOS LOS PRODUCTOS
    .post(_Autorizacion,) //INSERTAR ROL

_BasicasProductosRouter.route('/:id_producto')
    .get(_Autorizacion,) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion,) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion,) //CAMBIAR ESTADO DEL ROL POR ID
*/



/* UNIDADES DE MEDIDAD PARA LOS PRODUCTOS */
_BasicasProductosRouter.route('/unidades_medida')
    .get(_Autorizacion, _Unidad_Medida_Controller.Obtener_Unidades_Medida) //OBTENER TODOS LAS UNIDADES DE MEDIDA
    .post(_Autorizacion, _Unidad_Medida_Controller.Insertar_Unidad_Medida) //INSERTAR ROL

_BasicasProductosRouter.route('/unidades_medida/:id_unidad')
    .get(_Autorizacion, _Unidad_Medida_Controller.Buscar_Unidad_Medida) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion,) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion,) //CAMBIAR ESTADO DEL ROL POR ID




/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
_BasicasProductosRouter.route('/tipos_producto')
    .get(_Autorizacion,) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion,) //INSERTAR ROL

_BasicasProductosRouter.route('/tipos_productos/:id_tipo_producto')
    .get(_Autorizacion,) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion,) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion,) //CAMBIAR ESTADO DEL ROL POR ID



/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
_BasicasProductosRouter.route('/marcas_productos')
    .get(_Autorizacion,) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion,) //INSERTAR ROL

_BasicasProductosRouter.route('/marcas_productos/:id_tipo_producto')
    .get(_Autorizacion,) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion,) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion,) //CAMBIAR ESTADO DEL ROL POR ID




/* UNIDADES DE MEDIDAD PARA LAS FAMILIAS DE LOS PRODUCTOS */
_BasicasProductosRouter.route('/familias_productos')
    .get(_Autorizacion,) //OBTENER TODOS LOS ROLES
    .post(_Autorizacion,) //INSERTAR ROL

_BasicasProductosRouter.route('/familias_productos/:id_familia')
    .get(_Autorizacion,) //BUSCAR EL ROL SEGUN SU ID
    .patch(_Autorizacion,) //EDITAR ROL SEGUN SU ID
    .delete(_Autorizacion,) //CAMBIAR ESTADO DEL ROL POR ID




