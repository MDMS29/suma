import { _Autorizacion } from "../../middleware/Autorizacion";
import RolController from "../../controller/Configuracion/RolController";
import { BaseRouter } from "../base.router";

export class RolesRouter extends BaseRouter<RolController> {
    constructor() {
        super(RolController, "roles")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Roles(req, res)) //OBTENER TODOS LOS ROLES
            .post(_Autorizacion, (req, res) => this.controller.Insertar_Rol(req, res)) //INSERTAR ROL

        this.router.route(`/${this.subcarpeta}/:id_rol`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Rol(req, res)) //BUSCAR EL ROL SEGUN SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Rol(req, res)) //EDITAR ROL SEGUN SU ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Rol(req, res)) //CAMBIAR ESTADO DEL ROL POR ID
    }
}