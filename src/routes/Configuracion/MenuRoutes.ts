import {BaseRouter} from "../base.router"
import MenuController from "../../controller/Configuracion/MenuController"
import { _Autorizacion } from "../../middleware/Autorizacion";

export class MenusRouter extends BaseRouter<MenuController> {
    constructor() {
        super(MenuController, "menus")
    }

    routes(): void {
        this.router.route(`/${this.subcarpeta}/modulo/:id_modulo`)
            .get(_Autorizacion, (req,res) => this.controller.Obtener_Menus(req,res)) //OBTENER TODOS LOS MENUS DEL MODULO
            .post(_Autorizacion, (req,res) => this.controller.Insertar_Menu(req,res)) //CREAR MENU

        this.router.route(`/${this.subcarpeta}/:id_menu`)
            .get(_Autorizacion, (req,res)=> this.controller.Buscar_Menu(req,res))
            .patch(_Autorizacion, (req,res)=> this.controller.Editar_Menu(req,res)) //EDITAR SEGUN SU ID
            .delete(_Autorizacion, (req,res)=> this.controller.Cambiar_Estado_Menu(req,res)) //CAMBIAR ESTADO DEL PERFIL POR ID
    }
}