import {_Autorizacion} from "../../middleware/Autorizacion";
import CentroCostoEmpresa from "../../controller/Opciones_Basicas/CentroCostoEmpresaController";
import {BaseRouter} from "../base.router";

export class CentrosEmpresaRouter extends BaseRouter<CentroCostoEmpresa> {
    constructor() {
        super(CentroCostoEmpresa, "opciones-basicas/centro-costo-empresa")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req,res)=>this.controller.Obtener_Centros_Costo_Empresa(req,res)) //OBTENER TODOS CENTROS DE PROCESOS DE LA EMPRESA
            .post(_Autorizacion, (req,res)=>this.controller.Insertar_Centros_Costo_Empresa(req,res)) //INSERTAR UN CENTRO DE PROCESO DE LA EMPRESA

        this.router.route(`/${this.subcarpeta}/:id_centro_costo`)
            .get(_Autorizacion, (req,res)=>this.controller.Buscar_Centro_Costo(req,res)) //BUSCAR UNA CENTRO DE PROCESO DE LA EMPRESA
            .patch(_Autorizacion, (req,res)=>this.controller.Editar_Centro_Costo(req,res)) //EDITAR UN CENTRO DE PROCESO DE LA EMPRESA
            .delete(_Autorizacion, (req,res)=>this.controller.Cambiar_Estado_Centro(req,res)) //EDITAR UN CENTRO DE PROCESO DE LA EMPRESA
    }
}