import { client } from "../../config/db";
import { _BuscarMenuID, _BuscarMenuNombre, _CambiarEstadoMenu, _EditarMenu, _InsertarMenu, _ObtenerUltimoIDMenu, _Obtener_Menu } from "../dao/DaoMenu";
import {
    _CambiarEstadoRol
} from "../dao/DaoRol";

export default class QueryMenu {
    public async Obtener_Menus(estado: number, id_modulo: number): Promise<any> {
        try {
            let result = await client.query(_Obtener_Menu, [estado, id_modulo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Menu(nombre_rol: string, link_menu: string, id_modulo: string, usuario_creacion: string) {
        try {

            let ultimo_id = await client.query(_ObtenerUltimoIDMenu);
            ultimo_id = ultimo_id.rows[0].id_menu + 1
            let result = await client.query(_InsertarMenu, [ultimo_id, nombre_rol, link_menu, id_modulo, usuario_creacion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Menu_Nombre(nombre_menu: string) {
        try {
            let result = await client.query(_BuscarMenuNombre, [nombre_menu]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Menu_ID(id_menu: number) {
        try {
            let result = await client.query(_BuscarMenuID, [id_menu]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Editar_Menu(id_menu: number, nombre_editado: string, link_menu: string, usuario_modificacion: string) {
        try {
            let result = await client.query(_EditarMenu, [id_menu, nombre_editado, link_menu, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Cambiar_Estado_Menu(id_menu: number, estado: number) {
        try {
            let result = await client.query(_CambiarEstadoMenu, [id_menu, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}