import {_Autorizacion} from "../../middleware/Autorizacion";
import TipoProductoController from "../../controller/Opciones_Basicas/TipoProductoController";
import {BaseRouter} from "../base.router";

export class TiposProductosRouter extends BaseRouter<TipoProductoController> {
    constructor() {
        super(TipoProductoController, "opciones-basicas/tipos-producto")
    }

    routes(): void {

        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Tipos_Producto(req, res)) //OBTENER TODOS LOS TIPOS DE PRODUCTO
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Tipo_Producto(req, res)) //INSERTAR UN TIPO DE PRODUCTO

        this.router.route(`/${this.subcarpeta}/:id_tipo_producto`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Tipo_Producto(req, res)) //BUSCAR EL TIPO DE PRODUCTO SEGUN SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Tipo_Producto(req, res)) //EDITAR EL TIPO DE PRODUCTO SEGUN SU ID
    }
}