import {_Autorizacion} from "../../middleware/Autorizacion";
import ParametrosController from "../../controller/Opciones_Basicas/Parametrizadas/ParametrosController";
import {BaseRouter} from "../base.router";

export class ParametrizadosRouter extends BaseRouter<ParametrosController> {
    constructor() {
        super(ParametrosController, "opciones-basicas")
    }

    routes(): void {
        // TIPOS DE DOCUMENTOS
        this.router.route(`/${this.subcarpeta}/tipos-documento`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Tipos_Documento(req, res))//OBTENER TODOS LOS TIPOS DE DOCUMENTOS


        // FORMAS DE PAGO
        this.router.route(`/${this.subcarpeta}/formas-pago`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Formas_Pago(req, res))//OBTENER TODOS LAS FORMAS DE PAGO


        // IVAS QUE MANEJE LA EMPRESA
        this.router.route(`/${this.subcarpeta}/ivas`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Ivas(req, res))//OBTENER TODOS LOS IVAS
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Iva(req, res)) //INSERTAR UN IVA

        this.router.route(`/${this.subcarpeta}/ivas/:iva_id`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Iva(req, res)) //BUSCAR UN IVA POR SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Iva(req, res))//EDITAR UN IVA POR SU ID
    }
}