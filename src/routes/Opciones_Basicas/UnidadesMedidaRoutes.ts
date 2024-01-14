import { _Autorizacion } from "../../middleware/Autorizacion";
import UnidadesMedidaController from "../../controller/Opciones_Basicas/UnidadesMedidaController";
import {BaseRouter} from "../base.router";

export class UnidadesMedidaRouter extends BaseRouter<UnidadesMedidaController> {
    constructor() {
        super(UnidadesMedidaController, "opciones-basicas/unidades-medida")
    }

    routes(): void {

        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req,res)=> this.controller.Obtener_Unidades_Medida(req,res)) //OBTENER TODOS LAS UNIDADES DE MEDIDA
            .post(_Autorizacion, (req,res)=> this.controller.Insertar_Unidad_Medida(req,res)) //INSERTAR UNIDAD DE MEDIDA

        this.router.route(`/${this.subcarpeta}/:id_unidad`)
            .get(_Autorizacion, (req,res)=> this.controller.Buscar_Unidad_Medida(req,res)) //BUSCAR LA UNIDAD DE MEDIDA SEGUN SU ID
            .patch(_Autorizacion, (req,res)=> this.controller.Editar_Unidad_Medida(req,res)) //EDITAR LA UNIDAD DE MEDIDA SEGUN SU ID
    }
}