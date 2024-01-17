import {_Autorizacion} from "../../middleware/Autorizacion";
import {BaseRouter} from "../base.router";
import AuditoriaController from "../../controller/Auditoria/AuditoriaController";

export class AuditoriaRouter extends BaseRouter<AuditoriaController> {
    constructor() {
        super(AuditoriaController, "auditorias")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}/historial/logs`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Logs_Auditoria(req, res)) //OBTENER TODOS EL HISTORIAL DEL APLICATIVO

        this.router.route(`/${this.subcarpeta}/historial/filtro/logs`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Logs_Auditoria_Filtro(req, res)) //OBTENER EL HISTORIAL DEL APLICATIVO SEGUN EL FILTRO

    }
}