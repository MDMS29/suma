import {_Autorizacion} from "../../middleware/Autorizacion";
import RequisicionesController from "../../controller/Compras/RequisicionesController";
import {BaseRouter} from "../base.router";

export class RequisicionesRouter extends BaseRouter<RequisicionesController> {
    constructor() {
        super(RequisicionesController, "compras/requisiciones")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}/filtrar`)
            .post(_Autorizacion, (req, res) => this.controller.Obtener_Requisiciones_Filtro(req, res)) //OBTENER TODOS LAS REQUISICIONES

        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Requisiciones(req, res)) //OBTENER TODOS LAS REQUISICIONES
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Requisicion(req, res)) //CREAR REQUISICION

        this.router.route(`/${this.subcarpeta}/:id_requisicion`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Requisicion(req, res)) //BUSCAR UNA REQUISICION SEGUN SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Requisicion(req, res)) //EDITAR SEGUN SU ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Requisicion(req, res)) //CAMBIAR ESTADO DE LA REQUISICION POR ID

        this.router.route(`/${this.subcarpeta}/detalles/pendientes/:id_requisicion`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Requisicion(req, res)) //BUSCAR LOS DETALLES PENDIENTES DE LA REQUISICION

        this.router.route(`/${this.subcarpeta}/detalles/:id_requisicion`)
            .patch(_Autorizacion, (req, res) => this.controller.Aprobar_Desaprobar_Detalle(req, res)) //APROBAR Y DESAPROBAR LOS DETALLES DE LA REQUISICION

        this.router.route(`/${this.subcarpeta}/doc/:id_requisicion`)
            .get(_Autorizacion, (req, res) => this.controller.Generar_PDF_Requisicion(req, res))
    }
}