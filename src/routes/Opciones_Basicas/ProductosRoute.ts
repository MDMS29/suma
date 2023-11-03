import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import ProductosEmpresaController from "../../controller/Opciones_Basicas/ProductosEmpresaController";

import multer from "multer";

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage });

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _ProductosRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new ProductosEmpresaController()

_ProductosRouter.route('/productos-empresa')
    .get(_Autorizacion, EmpresaController.Obtener_Productos_Empresa) //OBTENER TODOS LAS EMPRESAS
    .post(_Autorizacion, upload.single('image'), EmpresaController.Insertar_Producto_Empresa) //CREAR EMPRESA

_ProductosRouter.route('/productos-empresa/:id_producto')
    .get(_Autorizacion, EmpresaController.Buscar_Producto_Empresa) //BUSCAR UNA EMPRESA SEGUN SU ID
    .patch(_Autorizacion, upload.single('image'), EmpresaController.Editar_Producto_Empresa) //EDITAR SEGUN SU ID
    .delete(_Autorizacion, EmpresaController.Cambiar_Estado_Producto) //CAMBIAR ESTADO DE LA EMPRESA POR ID

_ProductosRouter.get('/productos-empresa/filtro', _Autorizacion, EmpresaController.Buscar_Producto_Empresa)

