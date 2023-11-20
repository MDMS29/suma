"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._OpcionesBasicasRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const UnidadesMedidaController_1 = __importDefault(require("../../controller/Opciones_Basicas/UnidadesMedidaController"));
const TipoProductoController_1 = __importDefault(require("../../controller/Opciones_Basicas/TipoProductoController"));
const MarcasProductoController_1 = __importDefault(require("../../controller/Opciones_Basicas/MarcasProductoController"));
const FamiliaProductoController_1 = __importDefault(require("../../controller/Opciones_Basicas/FamiliaProductoController"));
const ProcesosEmpresaController_1 = __importDefault(require("../../controller/Opciones_Basicas/ProcesosEmpresaController"));
const CentroCostoEmpresaController_1 = __importDefault(require("../../controller/Opciones_Basicas/CentroCostoEmpresaController"));
exports._OpcionesBasicasRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADORES
const _Unidad_Medida_Controller = new UnidadesMedidaController_1.default();
const _Tipo_Producto_Controller = new TipoProductoController_1.default();
const _Marca_Producto_Controller = new MarcasProductoController_1.default();
const _Familia_Producto_Controller = new FamiliaProductoController_1.default();
const _Proceso_Empresa_Controller = new ProcesosEmpresaController_1.default();
const _Centro_Empresa_Controller = new CentroCostoEmpresaController_1.default();
/* UNIDADES DE MEDIDAD PARA LOS PRODUCTOS */
exports._OpcionesBasicasRouter.route('/unidades-medida')
    .get(Autorizacion_1._Autorizacion, _Unidad_Medida_Controller.Obtener_Unidades_Medida) //OBTENER TODOS LAS UNIDADES DE MEDIDA
    .post(Autorizacion_1._Autorizacion, _Unidad_Medida_Controller.Insertar_Unidad_Medida); //INSERTAR UNIDAD DE MEDIDA
exports._OpcionesBasicasRouter.route('/unidades-medida/:id_unidad')
    .get(Autorizacion_1._Autorizacion, _Unidad_Medida_Controller.Buscar_Unidad_Medida) //BUSCAR LA UNIDAD DE MEDIDA SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, _Unidad_Medida_Controller.Editar_Unidad_Medida); //EDITAR LA UNIDAD DE MEDIDA SEGUN SU ID
/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
exports._OpcionesBasicasRouter.route('/tipos-producto')
    .get(Autorizacion_1._Autorizacion, _Tipo_Producto_Controller.Obtener_Tipos_Producto) //OBTENER TODOS LOS TIPOS DE PRODUCTO
    .post(Autorizacion_1._Autorizacion, _Tipo_Producto_Controller.Insertar_Tipo_Producto); //INSERTAR UN TIPO DE PRODUCTO
exports._OpcionesBasicasRouter.route('/tipos-producto/:id_tipo_producto')
    .get(Autorizacion_1._Autorizacion, _Tipo_Producto_Controller.Buscar_Tipo_Producto) //BUSCAR EL TIPO DE PRODUCTO SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, _Tipo_Producto_Controller.Editar_Tipo_Producto); //EDITAR EL TIPO DE PRODUCTO SEGUN SU ID
/* UNIDADES DE MEDIDAD PARA LOS TIPOS DE PRODUCTOS */
exports._OpcionesBasicasRouter.route('/marcas-productos')
    .get(Autorizacion_1._Autorizacion, _Marca_Producto_Controller.Obtener_Marcas_Producto) //OBTENER TODAS LAS MARCAS DE LOS PRODUCTOS
    .post(Autorizacion_1._Autorizacion, _Marca_Producto_Controller.Insertar_Marca_Producto); //INSERTAR UNA MARCA DE PRODUCTOS
exports._OpcionesBasicasRouter.route('/marcas-productos/:id_marca_producto')
    .get(Autorizacion_1._Autorizacion, _Marca_Producto_Controller.Buscar_Marca_Producto) //BUSCAR LA MARCA DE PRODUCTO SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, _Marca_Producto_Controller.Editar_Marca_Producto); //EDITAR UNA MARCA DE PRODUCTO SEGUN SU ID
/* UNIDADES DE MEDIDAD PARA LAS FAMILIAS DE LOS PRODUCTOS */
exports._OpcionesBasicasRouter.route('/familias-productos')
    .get(Autorizacion_1._Autorizacion, _Familia_Producto_Controller.Obtener_Familias_Producto) //OBTENER TODAS LAS FAMILIAS DE LOS PRODUCTOS
    .post(Autorizacion_1._Autorizacion, _Familia_Producto_Controller.Insertar_Familia_Producto); //INSERTAR UNA FAMILIA DE PRODUCTO
exports._OpcionesBasicasRouter.route('/familias-productos/:id_familia_producto')
    .get(Autorizacion_1._Autorizacion, _Familia_Producto_Controller.Buscar_Familia_Producto) //BUSCAR UNA FAMILIA POR SU ID
    .patch(Autorizacion_1._Autorizacion, _Familia_Producto_Controller.Editar_Familia_Producto) //EDITAR UNA FAMILIA POR SU ID
    .delete(Autorizacion_1._Autorizacion, _Familia_Producto_Controller.Cambiar_Estado_Familia); //CAMBIAR ESTADO DE LA FAMILIA POR ID
/* PROCESOS QUE MANEJA LA EMPRESA */
exports._OpcionesBasicasRouter.route('/procesos-empresa')
    .get(Autorizacion_1._Autorizacion, _Proceso_Empresa_Controller.Obtener_Procesos_Empresa) //OBTENER TODOS LOS PROCESOS DE LA EMPRESA
    .post(Autorizacion_1._Autorizacion, _Proceso_Empresa_Controller.Insertar_Procesos_Empresa); //INSERTAR UN PROCESO DE LA EMPRESA
exports._OpcionesBasicasRouter.route('/procesos-empresa/:id_proceso')
    .get(Autorizacion_1._Autorizacion, _Proceso_Empresa_Controller.Buscar_Proceso_Empresa) //BUSCAR UNA PROCESO DE LA EMPRESA
    .patch(Autorizacion_1._Autorizacion, _Proceso_Empresa_Controller.Editar_Proceso_Empresa); //EDITAR UN PROCESO DE LA EMPRESA
/* CENTROS DE LOS PROCESOS DE LA EMPRESA */
exports._OpcionesBasicasRouter.route('/centro-costo-empresa')
    .get(Autorizacion_1._Autorizacion, _Centro_Empresa_Controller.Obtener_Centros_Costo_Empresa) //OBTENER TODOS CENTROS DE PROCESOS DE LA EMPRESA
    .post(Autorizacion_1._Autorizacion, _Centro_Empresa_Controller.Insertar_Centros_Costo_Empresa); //INSERTAR UN CENTRO DE PROCESO DE LA EMPRESA
exports._OpcionesBasicasRouter.route('/centro-costo-empresa/:id_centro_costo')
    .get(Autorizacion_1._Autorizacion, _Centro_Empresa_Controller.Buscar_Centro_Costo) //BUSCAR UNA CENTRO DE PROCESO DE LA EMPRESA
    .patch(Autorizacion_1._Autorizacion, _Centro_Empresa_Controller.Editar_Centro_Costo) //EDITAR UN CENTRO DE PROCESO DE LA EMPRESA
    .delete(Autorizacion_1._Autorizacion, _Centro_Empresa_Controller.Cambiar_Estado_Centro); //EDITAR UN CENTRO DE PROCESO DE LA EMPRESA
exports.default = exports._OpcionesBasicasRouter;
