import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import UnidadesMedidaController from "../../controller/Opciones_Basicas/UnidadesMedidaController";
import TipoProductoController from "../../controller/Opciones_Basicas/TipoProductoController";
import MarcasProductoController from "../../controller/Opciones_Basicas/MarcasProductoController";
import FamiliaProductoController from "../../controller/Opciones_Basicas/FamiliaProductoController";
import ProcesosEmpresaController from "../../controller/Opciones_Basicas/ProcesosEmpresaController";
import CentroCostoEmpresa from "../../controller/Opciones_Basicas/CentroCostoEmpresaController";
import ParametrosController from "../../controller/Opciones_Basicas/Parametrizadas/ParametrosController";
import _OrdenesController from "../../controller/Compras/OrdenesController";

export const _OpcionesBasicasRouter = Router()

//INICIALIZAR CONTROLADORES
const _Unidad_Medida_Controller = new UnidadesMedidaController()
const _Tipo_Producto_Controller = new TipoProductoController()
const _Marca_Producto_Controller = new MarcasProductoController()
const _Familia_Producto_Controller = new FamiliaProductoController()
const _Proceso_Empresa_Controller = new ProcesosEmpresaController()
const _Centro_Empresa_Controller = new CentroCostoEmpresa()
const _Parametros_Controller = new ParametrosController()
const OrdenesController = new _OrdenesController()




/* UNIDADES DE MEDIDAD PARA LOS PRODUCTOS */
_OpcionesBasicasRouter.route('/unidades-medida')
    .get(_Autorizacion, _Unidad_Medida_Controller.Obtener_Unidades_Medida) //OBTENER TODOS LAS UNIDADES DE MEDIDA
    .post(_Autorizacion, _Unidad_Medida_Controller.Insertar_Unidad_Medida) //INSERTAR UNIDAD DE MEDIDA

_OpcionesBasicasRouter.route('/unidades-medida/:id_unidad')
    .get(_Autorizacion, _Unidad_Medida_Controller.Buscar_Unidad_Medida) //BUSCAR LA UNIDAD DE MEDIDA SEGUN SU ID
    .patch(_Autorizacion, _Unidad_Medida_Controller.Editar_Unidad_Medida) //EDITAR LA UNIDAD DE MEDIDA SEGUN SU ID



/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
_OpcionesBasicasRouter.route('/tipos-producto')
    .get(_Autorizacion, _Tipo_Producto_Controller.Obtener_Tipos_Producto) //OBTENER TODOS LOS TIPOS DE PRODUCTO
    .post(_Autorizacion, _Tipo_Producto_Controller.Insertar_Tipo_Producto) //INSERTAR UN TIPO DE PRODUCTO

_OpcionesBasicasRouter.route('/tipos-producto/:id_tipo_producto')
    .get(_Autorizacion, _Tipo_Producto_Controller.Buscar_Tipo_Producto) //BUSCAR EL TIPO DE PRODUCTO SEGUN SU ID
    .patch(_Autorizacion, _Tipo_Producto_Controller.Editar_Tipo_Producto) //EDITAR EL TIPO DE PRODUCTO SEGUN SU ID



/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
_OpcionesBasicasRouter.route('/marcas-productos')
    .get(_Autorizacion, _Marca_Producto_Controller.Obtener_Marcas_Producto) //OBTENER TODAS LAS MARCAS DE LOS PRODUCTOS
    .post(_Autorizacion, _Marca_Producto_Controller.Insertar_Marca_Producto) //INSERTAR UNA MARCA DE PRODUCTOS

_OpcionesBasicasRouter.route('/marcas-productos/:id_marca_producto')
    .get(_Autorizacion, _Marca_Producto_Controller.Buscar_Marca_Producto) //BUSCAR LA MARCA DE PRODUCTO SEGUN SU ID
    .patch(_Autorizacion, _Marca_Producto_Controller.Editar_Marca_Producto) //EDITAR UNA MARCA DE PRODUCTO SEGUN SU ID



/* UNIDADES DE MEDIDAD PARA LAS FAMILIAS DE LOS PRODUCTOS */
_OpcionesBasicasRouter.route('/familias-productos')
    .get(_Autorizacion, _Familia_Producto_Controller.Obtener_Familias_Producto) //OBTENER TODAS LAS FAMILIAS DE LOS PRODUCTOS
    .post(_Autorizacion, _Familia_Producto_Controller.Insertar_Familia_Producto) //INSERTAR UNA FAMILIA DE PRODUCTO

_OpcionesBasicasRouter.route('/familias-productos/:id_familia_producto')
    .get(_Autorizacion, _Familia_Producto_Controller.Buscar_Familia_Producto) //BUSCAR UNA FAMILIA POR SU ID
    .patch(_Autorizacion, _Familia_Producto_Controller.Editar_Familia_Producto) //EDITAR UNA FAMILIA POR SU ID
    .delete(_Autorizacion, _Familia_Producto_Controller.Cambiar_Estado_Familia) //CAMBIAR ESTADO DE LA FAMILIA POR ID



/* PROCESOS QUE MANEJA LA EMPRESA */
_OpcionesBasicasRouter.route('/procesos-empresa')
    .get(_Autorizacion, _Proceso_Empresa_Controller.Obtener_Procesos_Empresa) //OBTENER TODOS LOS PROCESOS DE LA EMPRESA
    .post(_Autorizacion, _Proceso_Empresa_Controller.Insertar_Procesos_Empresa) //INSERTAR UN PROCESO DE LA EMPRESA

_OpcionesBasicasRouter.route('/procesos-empresa/:id_proceso')
    .get(_Autorizacion, _Proceso_Empresa_Controller.Buscar_Proceso_Empresa) //BUSCAR UNA PROCESO DE LA EMPRESA
    .patch(_Autorizacion, _Proceso_Empresa_Controller.Editar_Proceso_Empresa) //EDITAR UN PROCESO DE LA EMPRESA



/* CENTROS DE LOS PROCESOS DE LA EMPRESA */
_OpcionesBasicasRouter.route('/centro-costo-empresa')
    .get(_Autorizacion, _Centro_Empresa_Controller.Obtener_Centros_Costo_Empresa) //OBTENER TODOS CENTROS DE PROCESOS DE LA EMPRESA
    .post(_Autorizacion, _Centro_Empresa_Controller.Insertar_Centros_Costo_Empresa) //INSERTAR UN CENTRO DE PROCESO DE LA EMPRESA

_OpcionesBasicasRouter.route('/centro-costo-empresa/:id_centro_costo')
    .get(_Autorizacion, _Centro_Empresa_Controller.Buscar_Centro_Costo) //BUSCAR UNA CENTRO DE PROCESO DE LA EMPRESA
    .patch(_Autorizacion, _Centro_Empresa_Controller.Editar_Centro_Costo) //EDITAR UN CENTRO DE PROCESO DE LA EMPRESA
    .delete(_Autorizacion, _Centro_Empresa_Controller.Cambiar_Estado_Centro) //EDITAR UN CENTRO DE PROCESO DE LA EMPRESA
    
_OpcionesBasicasRouter.route('/tipos-ordenes')
    .get(_Autorizacion, OrdenesController.Obtener_Tipos_Ordenes) //OBTENER TODAS LOS TIPOS DE ORDENES
    .post(_Autorizacion, OrdenesController.Insertar_Tipo_Orden) //INSERTAR UN TIPO DE ORDEN

_OpcionesBasicasRouter.route('/tipos-ordenes/:id_tipo_orden')
    .get(_Autorizacion, OrdenesController.Buscar_Tipo_Orden) //OBTENER TODAS LOS TIPOS DE ORDENES
    .patch(_Autorizacion, OrdenesController.Editar_Tipo_Orden) //OBTENER TODAS LOS TIPOS DE ORDENES

_OpcionesBasicasRouter.route('/tipos-documento')
    .get(_Autorizacion, _Parametros_Controller.Obtener_Tipos_Documento) //OBTENER TODOS LOS TIPOS DE DOCUMENTOS

_OpcionesBasicasRouter.route('/formas-pago')
    .get(_Autorizacion, _Parametros_Controller.Obtener_Formas_Pago) //OBTENER TODOS LAS FORMAS DE PAGO

_OpcionesBasicasRouter.route('/ivas')
    .get(_Autorizacion, _Parametros_Controller.Obtener_Ivas) //OBTENER TODOS LOS IVAS
    .post(_Autorizacion, _Parametros_Controller.Insertar_Iva) //INSERTAR UN IVA

_OpcionesBasicasRouter.route('/ivas/:iva_id')
    .get(_Autorizacion, _Parametros_Controller.Buscar_Iva) //BUSCAR UN IVA POR SU ID
    .patch(_Autorizacion, _Parametros_Controller.Editar_Iva) //EDITAR UN IVA POR SU ID
export default _OpcionesBasicasRouter