import {_Autorizacion} from "../../middleware/Autorizacion";
import MarcasProductoController from "../../controller/Opciones_Basicas/MarcasProductoController";
import {BaseRouter} from "../base.router";

export class MarcasProductosRouter extends BaseRouter<MarcasProductoController> {
    constructor() {
        super(MarcasProductoController, "opciones-basicas/marcas-productos")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req,res) => this.controller.Obtener_Marcas_Producto(req,res)) //OBTENER TODAS LAS MARCAS DE LOS PRODUCTOS
            .post(_Autorizacion, (req,res) => this.controller.Insertar_Marca_Producto(req,res)) //INSERTAR UNA MARCA DE PRODUCTOS

        this.router.route(`/${this.subcarpeta}/:id_marca_producto`)
            .get(_Autorizacion, (req,res) => this.controller.Buscar_Marca_Producto(req,res)) //BUSCAR LA MARCA DE PRODUCTO SEGUN SU ID
            .patch(_Autorizacion, (req,res) => this.controller.Editar_Marca_Producto(req,res)) //EDITAR UNA MARCA DE PRODUCTO SEGUN SU ID

    }
}