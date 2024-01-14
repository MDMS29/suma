import { _Autorizacion } from "../../middleware/Autorizacion";
import PerfilController from "../../controller/Configuracion/PerfilController";
import { BaseRouter } from "../base.router";

export class PerfilesRouter extends BaseRouter<PerfilController> {
    constructor() {
        super(PerfilController, "perfiles")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Perfiles(req, res)) //OBTENER TODOS LOS PERFILES
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Perfil(req, res)) //INSERTAR PERFIL

        this.router.post(`/${this.subcarpeta}/modulos`, _Autorizacion, (req, res) => this.controller.Obtener_Modulos_Perfiles(req, res))// OBTENER LOS MODULOS DE LOS PERFILES

        this.router.route(`/${this.subcarpeta}/:id_perfil`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Perfil(req, res))
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Perfil(req, res)) //EDITAR PERFIL SEGUN SU ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Perfil(req, res)) //CAMBIAR ESTADO DEL PERFIL POR ID
    }
}