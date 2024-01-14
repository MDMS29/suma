import {_Autorizacion} from "../../middleware/Autorizacion";
import ProcesosEmpresaController from "../../controller/Opciones_Basicas/ProcesosEmpresaController";
import {BaseRouter} from "../base.router";

export class ProcesosEmpresaRouter extends BaseRouter<ProcesosEmpresaController> {
    constructor() {
        super(ProcesosEmpresaController, "opciones-basicas/procesos-empresa")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Procesos_Empresa(req, res)) //OBTENER TODOS LOS PROCESOS DE LA EMPRESA
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Procesos_Empresa(req, res)) //INSERTAR UN PROCESO DE LA EMPRESA

        this.router.route(`/${this.subcarpeta}/:id_proceso`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Proceso_Empresa(req, res)) //BUSCAR UNA PROCESO DE LA EMPRESA
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Proceso_Empresa(req, res)) //EDITAR UN PROCESO DE LA EMPRESA

    }
}