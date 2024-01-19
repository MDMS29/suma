import { _Autorizacion } from "../../middleware/Autorizacion";
import { BaseRouter } from "../base.router";
import MovimientosAlmacenController from "../../controller/Inventario/MovimientosController";

export class MovimientosAlmacenRouter extends BaseRouter<MovimientosAlmacenController> {
    constructor() {
        super(MovimientosAlmacenController, "inventario/movimientos-almacen")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Movimiento_Almacen(req, res)) //OBTENER TODOS LOS MOVIMIENTOS
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Movimiento(req, res)) //CREAR MOVIMIENTO

        this.router.route(`/${this.subcarpeta}/:id_movimiento`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Movimiento(req, res)) //BUSCAR UN MOVIMIENTO
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Movimiento(req, res)) //EDITAR UN MOVIMIENTO SEGUN SU ID
        //     .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Movimiento(req, res)) //CAMBIAR ESTADO DE LA EMPRESA POR ID
    }
}