"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._ProductosRouter = void 0;
const express_1 = require("express");
const Autorizacion_1 = require("../../middleware/Autorizacion");
const ProductosEmpresaController_1 = __importDefault(require("../../controller/Opciones_Basicas/ProductosEmpresaController"));
const multer_1 = __importDefault(require("multer"));
// Configuración de Multer para manejar la carga de imágenes
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
//INICIALIZAR RUTAS PARA LAS EMPRESAS
exports._ProductosRouter = (0, express_1.Router)();
//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new ProductosEmpresaController_1.default();
exports._ProductosRouter.route('/')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Obtener_Productos_Empresa) //OBTENER TODOS LAS EMPRESAS
    .post(Autorizacion_1._Autorizacion, upload.single('image'), EmpresaController.Insertar_Producto_Empresa); //CREAR EMPRESA
exports._ProductosRouter.route('/:id_producto')
    .get(Autorizacion_1._Autorizacion, EmpresaController.Buscar_Producto_Empresa) //BUSCAR UNA EMPRESA SEGUN SU ID
    .patch(Autorizacion_1._Autorizacion, upload.single('image'), EmpresaController.Editar_Producto_Empresa) //EDITAR SEGUN SU ID
    .delete(Autorizacion_1._Autorizacion, EmpresaController.Cambiar_Estado_Producto); //CAMBIAR ESTADO DE LA EMPRESA POR ID
exports._ProductosRouter.get('/filtro', Autorizacion_1._Autorizacion, EmpresaController.Buscar_Producto_Empresa);
exports.default = exports._ProductosRouter;
