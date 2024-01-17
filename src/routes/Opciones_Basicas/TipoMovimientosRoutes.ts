import {_Autorizacion} from "../../middleware/Autorizacion";
import {BaseRouter} from "../base.router";
import TipoMovimientosController from "../../controller/Opciones_Basicas/TipoMovimientosController";

export class TiposMovimientosRouter extends BaseRouter<TipoMovimientosController> {
    constructor() {
        super(TipoMovimientosController, "opciones-basicas/tipos-movimientos")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Tipos_Movimientos(req, res)) //OBTENER TODOS LOS TIPOS DE MOVIMIENTO
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Tipo_Movimiento(req, res)) //INSERTAR UN TIPO DE MOVIMIENTO

        this.router.route(`/${this.subcarpeta}/:id_tipo_mov`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Tipo_Movimiento(req, res)) //BUSCAR UNA TIPO DE MOVIMIENTO
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Tipo_Movimiento(req, res)) //EDITAR UN TIPO DE MOVIMIENTO

    }
}