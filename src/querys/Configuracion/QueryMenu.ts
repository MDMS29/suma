import { Database } from "../../config/db";
import {
    _BuscarMenuID, _BuscarMenuNombre, _BuscarMenuOrden, _BuscarMenuOrdenModulo, _CambiarEstadoMenu,
    _EditarMenu, _InsertarMenu, _ObtenerUltimoIDMenu, _Obtener_Menu
} from "../../dao/Configuracion/DaoMenu";

export default class QueryMenu extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Menus(estado: number, id_modulo: number): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_Obtener_Menu, [estado, id_modulo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Menu(nombre_rol: string, link_menu: string, id_modulo: string, usuario_creacion: string, n_orden: string) {
        const client = await this.pool.connect()

        try {
            let ultimo_id = await client.query(_ObtenerUltimoIDMenu);
            ultimo_id = ultimo_id.rows[0].id_menu + 1
            let result = await client.query(_InsertarMenu, [ultimo_id, nombre_rol, link_menu, id_modulo, usuario_creacion, n_orden]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Menu_Nombre(nombre_menu: string) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_BuscarMenuNombre, [nombre_menu]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Orden_Menu(modulo_id: string, orden_menu: string) {
        const client = await this.pool.connect()

        try {
            let result 

            if(modulo_id !== ""){
                result = await client.query(_BuscarMenuOrdenModulo, [modulo_id, orden_menu]);
            }else{
                result = await client.query(_BuscarMenuOrden, [orden_menu]);
            }
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Menu_ID(id_menu: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_BuscarMenuID, [id_menu]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Menu(id_menu: number, nombre_editado: string, link_menu: string, usuario_modificacion: string) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_EditarMenu, [id_menu, nombre_editado, link_menu, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Menu(id_menu: number, estado: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_CambiarEstadoMenu, [id_menu, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}