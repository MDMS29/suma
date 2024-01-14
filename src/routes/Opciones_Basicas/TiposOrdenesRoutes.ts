import {_Autorizacion} from "../../middleware/Autorizacion";
import TiposOrdenesController from "../../controller/Opciones_Basicas/Compras/TiposOrdenesController";
import {BaseRouter} from "../base.router";

export class TiposOrdenesRouter extends BaseRouter<TiposOrdenesController> {
    constructor() {
        super(TiposOrdenesController, "opciones-basicas/tipos-ordenes")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req,res) => this.controller.Obtener_Tipos_Ordenes(req,res)) //OBTENER TODAS LOS TIPOS DE ORDENES
            .post(_Autorizacion, (req,res) => this.controller.Insertar_Tipo_Orden(req,res)) //INSERTAR UN TIPO DE ORDEN

        this.router.route(`/${this.subcarpeta}/:id_tipo_orden`)
            .get(_Autorizacion, (req,res) => this.controller.Buscar_Tipo_Orden(req,res)) //OBTENER TODAS LOS TIPOS DE ORDENES
            .patch(_Autorizacion, (req,res) => this.controller.Editar_Tipo_Orden(req,res)) //OBTENER TODAS LOS TIPOS DE ORDENES

    }
}