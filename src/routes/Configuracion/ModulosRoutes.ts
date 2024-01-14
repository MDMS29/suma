import { _Autorizacion } from "../../middleware/Autorizacion";
import ModuloController from "../../controller/Configuracion/ModuloController";
import { BaseRouter } from "../base.router";

export class ModulosRouter extends BaseRouter<ModuloController> {
    constructor() {
        super(ModuloController, "modulos")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Modulos(req, res)) //OBTENER TODOS LOS PERFILES
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Modulo(req, res)) //INSERTAR PERFIL

        this.router.route(`/${this.subcarpeta}/:id_modulo`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Modulo(req, res))
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Modulo(req, res)) //EDITAR PERFIL SEGUN SU ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Modulo(req, res)) //CAMBIAR ESTADO DEL PERFIL POR ID
    }
}