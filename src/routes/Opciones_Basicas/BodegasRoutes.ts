import { _Autorizacion } from "../../middleware/Autorizacion";
import { BaseRouter } from "../base.router";
import BodegasController from "../../controller/Opciones_Basicas/BodegasController";

export class BodegasRouter extends BaseRouter<BodegasController> {
    constructor() {
        super(BodegasController, "opciones-basicas/bodegas")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}/filtrar`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Bodegas_Filtro(req, res)) //OBTENER LAS BODEGAS POR FILTROS

        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Bodegas(req, res)) //OBTENER TODOS LOS TIPOS DE MOVIMIENTO
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Bodega(req, res)) //INSERTAR UN TIPO DE MOVIMIENTO

        this.router.route(`/${this.subcarpeta}/:id_bodega`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Bodega(req, res)) //BUSCAR UNA TIPO DE MOVIMIENTO
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Bodega(req, res)) //EDITAR UN TIPO DE MOVIMIENTO
            .delete(_Autorizacion, (req, res) => this.controller.Eliminar_Restaurar_Bodega(req, res)) //EDITAR UN TIPO DE MOVIMIENTO

    }
}