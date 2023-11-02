import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import ProductosEmpresaController from "../../controller/Opciones_Basicas/ProductosEmpresController";

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

// _ProductosRouter.route('/productos-empresa:id_empresa')
//     .get(_Autorizacion, EmpresaController.Buscar_Familia_Producto) //BUSCAR UNA EMPRESA SEGUN SU ID
//     .patch(_Autorizacion, EmpresaController.Editar_Familia_Producto) //EDITAR SEGUN SU ID
//     .delete(_Autorizacion, EmpresaController.Cambiar_Estado_Familia) //CAMBIAR ESTADO DE LA EMPRESA POR ID

