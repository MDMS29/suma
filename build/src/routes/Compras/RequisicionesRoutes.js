"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._RequisicionesRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const RequisicionesController_1 = __importDefault(require("../../controller/Compras/RequisicionesController"));
//INICIALIZAR RUTAS PARA LAS EMPRESAS
exports._RequisicionesRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new RequisicionesController_1.default();
exports._RequisicionesRouter.route('/requisiciones/filtrar')
    .post(Autorizacion_1._Autorizacion, EmpresaController.Obtener_Requisiciones_Filtro); //OBTENER TODOS LAS REQUISICIONES
exports._RequisicionesRouter.route('/requisiciones')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Obtener_Requisiciones) //OBTENER TODOS LAS REQUISICIONES
    .post(Autorizacion_1._Autorizacion, EmpresaController.Insertar_Requisicion); //CREAR REQUISICION
exports._RequisicionesRouter.route('/requisiciones/:id_requisicion')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Buscar_Requisicion) //BUSCAR UNA REQUISICION SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, EmpresaController.Editar_Requisicion) //EDITAR SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, EmpresaController.Cambiar_Estado_Requisicion); //CAMBIAR ESTADO DE LA REQUISICION POR ID
exports._RequisicionesRouter.route('/requisiciones/detalles/:id_requisicion')
    .patch(Autorizacion_1._Autorizacion, EmpresaController.Aprobar_Desaprobar_Detalle); //CAMBIAR ESTADO DE LA REQUISICION POR ID
exports._RequisicionesRouter.route('/requisiciones/doc/:id_requisicion')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Generar_PDF_Requisicion);
// _RequisicionesRouter.get('/productos-empresa/filtro', _Autorizacion, EmpresaController.Buscar_Producto_Empresa)
exports.default = exports._RequisicionesRouter;
