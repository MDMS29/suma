import {_Autorizacion} from "../../middleware/Autorizacion";
import ProveedoresController from "../../controller/Compras/ProveedoresController";
import {BaseRouter} from "../base.router";

export class ProveedoresRouter extends BaseRouter<ProveedoresController> {
    constructor() {
        super(ProveedoresController, "compras/proveedores")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Proveedores(req, res)) //OBTENER TODOS LAS REQUISICIONES
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Proveedor(req, res)) //CREAR REQUISICION

        this.router.route(`/${this.subcarpeta}/:id_proveedor`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Proveedor(req, res)) //BUSCAR UNA REQUISICION SEGUN SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Proveedor(req, res)) //EDITAR SEGUN SU ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Proveedor(req, res)) //CAMBIAR ESTADO DE LA REQUISICION POR ID
    }
}