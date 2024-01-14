import { _Autorizacion } from "../../middleware/Autorizacion";
import ProductosEmpresaController from "../../controller/Opciones_Basicas/ProductosEmpresaController";
import {BaseRouter} from "../base.router"

import multer from "multer";

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage });

export class ProductosRouter extends BaseRouter<ProductosEmpresaController> {
    constructor() {
        super(ProductosEmpresaController, "opciones-basicas/productos-empresa")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}/`)
            .get(_Autorizacion, (req,res)=> this.controller.Obtener_Productos_Empresa(req,res)) //OBTENER TODOS LAS EMPRESAS
            .post(_Autorizacion, upload.single('image'), (req,res)=> this.controller.Insertar_Producto_Empresa(req,res)) //CREAR EMPRESA

        this.router.route(`/${this.subcarpeta}/:id_producto`)
            .get(_Autorizacion, (req,res)=> this.controller.Buscar_Producto_Empresa(req,res)) //BUSCAR UNA EMPRESA SEGUN SU ID
            .patch(_Autorizacion, upload.single('image'), (req,res)=> this.controller.Editar_Producto_Empresa(req,res)) //EDITAR SEGUN SU ID
            .delete(_Autorizacion, (req,res)=> this.controller.Cambiar_Estado_Producto(req,res)) //CAMBIAR ESTADO DE LA EMPRESA POR ID

        this.router.get(`/${this.subcarpeta}/filtro`, _Autorizacion, (req,res)=> this.controller.Buscar_Producto_Empresa(req,res))

    }
}