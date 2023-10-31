import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import UnidadesMedidaController from "../../controller/Opciones_Basicas/UnidadesMedidaController";
import TipoProductoController from "../../controller/Opciones_Basicas/TipoProductoController";
import MarcasProductoController from "../../controller/Opciones_Basicas/MarcasProductoController";
import FamiliaProductoController from "../../controller/Opciones_Basicas/FamiliaProductoController";

export const _BasicasProductosRouter = Router()

//INICIALIZAR CONTROLADORES
const _Unidad_Medida_Controller = new UnidadesMedidaController()
const _Tipo_Producto_Controller = new TipoProductoController()
const _Marca_Producto_Controller = new MarcasProductoController()
const _Familia_Producto_Controller = new FamiliaProductoController()



/* UNIDADES DE MEDIDAD PARA LOS PRODUCTOS */
_BasicasProductosRouter.route('/unidades_medida')
    .get(_Autorizacion, _Unidad_Medida_Controller.Obtener_Unidades_Medida) //OBTENER TODOS LAS UNIDADES DE MEDIDA
    .post(_Autorizacion, _Unidad_Medida_Controller.Insertar_Unidad_Medida) //INSERTAR UNIDAD DE MEDIDA

_BasicasProductosRouter.route('/unidades_medida/:id_unidad')
    .get(_Autorizacion, _Unidad_Medida_Controller.Buscar_Unidad_Medida) //BUSCAR LA UNIDAD DE MEDIDA SEGUN SU ID
    .patch(_Autorizacion, _Unidad_Medida_Controller.Editar_Unidad_Medida) //EDITAR LA UNIDAD DE MEDIDA SEGUN SU ID



/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
_BasicasProductosRouter.route('/tipos_producto')
    .get(_Autorizacion, _Tipo_Producto_Controller.Obtener_Tipos_Producto) //OBTENER TODOS LOS TIPOS DE PRODUCTO
    .post(_Autorizacion, _Tipo_Producto_Controller.Insertar_Tipo_Producto) //INSERTAR UN TIPO DE PRODUCTO

_BasicasProductosRouter.route('/tipos_producto/:id_tipo_producto')
    .get(_Autorizacion, _Tipo_Producto_Controller.Buscar_Tipo_Producto) //BUSCAR EL TIPO DE PRODUCTO SEGUN SU ID
    .patch(_Autorizacion, _Tipo_Producto_Controller.Editar_Tipo_Producto) //EDITAR EL TIPO DE PRODUCTO SEGUN SU ID



/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
_BasicasProductosRouter.route('/marcas_productos')
    .get(_Autorizacion, _Marca_Producto_Controller.Obtener_Marcas_Producto) //OBTENER TODAS LAS MARCAS DE LOS PRODUCTOS
    .post(_Autorizacion, _Marca_Producto_Controller.Insertar_Marca_Producto) //INSERTAR UNA MARCA DE PRODUCTOS

_BasicasProductosRouter.route('/marcas_productos/:id_marca_producto')
    .get(_Autorizacion, _Marca_Producto_Controller.Buscar_Marca_Producto) //BUSCAR LA MARCA DE PRODUCTO SEGUN SU ID
    .patch(_Autorizacion, _Marca_Producto_Controller.Editar_Marca_Producto) //EDITAR UNA MARCA DE PRODUCTO SEGUN SU ID



/* UNIDADES DE MEDIDAD PARA LAS FAMILIAS DE LOS PRODUCTOS */
_BasicasProductosRouter.route('/familias_productos')
    .get(_Autorizacion, _Familia_Producto_Controller.Obtener_Familias_Producto) //OBTENER TODAS LAS FAMILIAS DE LOS PRODUCTOS
    .post(_Autorizacion, _Familia_Producto_Controller.Insertar_Familia_Producto) //INSERTAR UNA FAMILIA DE PRODUCTO

_BasicasProductosRouter.route('/familias_productos/:id_familia_producto')
    .get(_Autorizacion, _Familia_Producto_Controller.Buscar_Familia_Producto) //BUSCAR UNA FAMILIA POR SU ID
    .patch(_Autorizacion, _Familia_Producto_Controller.Editar_Familia_Producto) //EDITAR UNA FAMILIA POR SU ID
    .delete(_Autorizacion, _Familia_Producto_Controller.Cambiar_Estado_Familia) //CAMBIAR ESTADO DE LA FAMILIA POR ID
