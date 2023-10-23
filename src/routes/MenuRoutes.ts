import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import _MenuController from "../controller/MenuController";

//INICIALIZAR RUTAS PARA PERFILES
export const _MenusRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const MenuController = new _MenuController()

_MenusRouter.route('/modulo/:id_modulo')
    .get(_Autorizacion, MenuController.Obtener_Menus) //OBTENER TODOS LOS MENUS DEL MODULO
    .post(_Autorizacion, MenuController.Insertar_Menu) //CREAR MENU

_MenusRouter.route('/:id_menu')
    .get(_Autorizacion, MenuController.Buscar_Menu)
    .patch(_Autorizacion, MenuController.Editar_Menu) //EDITAR SEGUN SU ID
    .delete(_Autorizacion, MenuController.Cambiar_Estado_Menu) //CAMBIAR ESTADO DEL PERFIL POR ID

