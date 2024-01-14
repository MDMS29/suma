import {_Autorizacion} from "../../middleware/Autorizacion";
import FamiliaProductoController from "../../controller/Opciones_Basicas/FamiliaProductoController";
import {BaseRouter} from "../base.router";

export class FamiliasProductosRouter extends BaseRouter<FamiliaProductoController> {
    constructor() {
        super(FamiliaProductoController, "opciones-basicas/familias-productos")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Familias_Producto(req, res)) //OBTENER TODAS LAS FAMILIAS DE LOS PRODUCTOS
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Familia_Producto(req, res)) //INSERTAR UNA FAMILIA DE PRODUCTO

        this.router.route(`/${this.subcarpeta}/:id_familia_producto`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Familia_Producto(req, res)) //BUSCAR UNA FAMILIA POR SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Familia_Producto(req, res)) //EDITAR UNA FAMILIA POR SU ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Familia(req, res)) //CAMBIAR ESTADO DE LA FAMILIA POR ID
    }
}