import { _Autorizacion } from "../../middleware/Autorizacion";
import { BaseRouter } from "../base.router";
import MovimientosAlmacenController from "../../controller/Inventario/MovimientosController";

export class MovimientosAlmacenRouter extends BaseRouter<MovimientosAlmacenController> {
    constructor() {
        super(MovimientosAlmacenController, "inventario/movimientos-almacen")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Movimiento_Almacen(req, res)) //OBTENER TODOS LAS EMPRESAS
        //     .post(_Autorizacion, (req, res) => this.controller.Insertar_Empresa(req, res)) //CREAR EMPRESA

        // this.router.route(`/${this.subcarpeta}/:id_empresa`)
        //     .get(_Autorizacion, (req, res) => this.controller.Buscar_Empresa(req, res)) //BUSCAR UNA EMPRESA SEGUN SU ID
        //     .patch(_Autorizacion, (req, res) => this.controller.Editar_Empresa(req, res)) //EDITAR SEGUN SU ID
        //     .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Empresa(req, res)) //CAMBIAR ESTADO DE LA EMPRESA POR ID
    }
}