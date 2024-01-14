import { _Autorizacion } from "../../middleware/Autorizacion";
import UsuarioController from "../../controller/Configuracion/UsuarioController";
import { BaseRouter } from "../base.router";

export class UsuariosRouter extends BaseRouter<UsuarioController> {
    constructor() {
        super(UsuarioController, "usuarios")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}`)
            .get(_Autorizacion, (req, res) => this.controller.Obtener_Usuarios(req, res)) //OBTENER USUARIOS DEL SISTEMA SEGUN SU ESTADO
            .post(_Autorizacion, (req, res) => this.controller.Crear_Usuario(req, res));//CREACIÓN DEL USUARIO

        this.router.post(`/${this.subcarpeta}/autenticar_usuario`, (req, res) => this.controller.Autenticar_Usuario(req, res))

        this.router.route(`/${this.subcarpeta}/perfil`)
            .get(_Autorizacion, (req, res) => this.controller.Perfil_Usuario(req, res))

        this.router.route(`/${this.subcarpeta}/perfil/:id_usuario`).patch(_Autorizacion, (req, res) => this.controller.Actualizar_Perfil(req, res))

        this.router.route(`/${this.subcarpeta}/:id_usuario`)
            .get(_Autorizacion, (req, res) => this.controller.Buscar_Usuario(req, res))//BUSCAR USUARIO CON POR MEDIO DE SU ID
            .patch(_Autorizacion, (req, res) => this.controller.Editar_Usuario(req, res))//EDITAR EL USUARIO POR ID
            .delete(_Autorizacion, (req, res) => this.controller.Cambiar_Estado_Usuario(req, res))//CAMBIAR EL ESTADO DEL USUARIO POR ID

        this.router.patch(`/${this.subcarpeta}/cambiar_clave/:id_usuario`, _Autorizacion, (req, res) => this.controller.Cambiar_Clave_Usuario(req, res)) //CAMBIAR CONTRASEÑA DEL USUARIO POR ID

        this.router.patch(`/${this.subcarpeta}/restablecer_clave/:id_usuario`, _Autorizacion, (req, res) => this.controller.Resetear_Clave_Usuario(req, res)) //RSETEAR LA CLAVE DEL USUARIO CUANDO SE LE HAYA ENVIADO EL CORREO
    }
}