import QueryMenu from "../../querys/Configuracion/QueryMenu";
import Querys from "../../querys/Querys";
import { MenusModulos } from "../../Interfaces/Configuracion/IConfig";
import { Logs_Info } from "../../Interfaces/IConstants";

export class MenuService {
    private _Query_Menu: QueryMenu;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Menu = new QueryMenu();
        this._Querys = new Querys();
    }

    public async Obtener_Menus(estado: number, id_modulo: number): Promise<any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Menu.Obtener_Menus(estado, id_modulo)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado menus' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los menus' } //!ERROR
        }
    }

    public async Insertar_Menu(menu_request: MenusModulos, id_modulo: string, usuario_creacion: string) {
        const { nombre_menu, link_menu, n_orden } = menu_request
        try {
            //VALIDAR SI EL MENU EXISTE
            const BMenu: any = await this._Query_Menu.Buscar_Menu_Nombre(nombre_menu)
            if (BMenu?.length > 0) {
                return { error: true, message: 'Ya existe este menu' } //!ERROR
            }
            
            // VALIDAR SI EL ORDEN DEL MENU EXISTE DENTRO DEL MODULO
            const esOrdenMenu = await this._Query_Menu.Buscar_Orden_Menu(id_modulo, n_orden)
            if(esOrdenMenu.length > 0) {
                return { error: true, message: 'Este numero de orden esta ocupado' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, menu_request.ip, menu_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${menu_request.ip}, UBICACIÓN: \n ${menu_request?.ubicacion}`)
            }

            //INVOCAR FUNCION PARA INSERTAR MENU
            const respuesta = await this._Query_Menu.Insertar_Menu(nombre_menu, link_menu.toLowerCase(), id_modulo, usuario_creacion, n_orden)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el menu' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
            const menu = await this._Query_Menu.Buscar_Menu_ID(respuesta[0].id_menu)
            if (!menu) {
                return { error: true, message: 'No se ha encontrado el menu' } //!ERROR
            }

            return menu[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el menu' } //!ERROR
        }
    }

    public async Buscar_Menu(id_menu: number): Promise<any> {
        try {
            const menu = await this._Query_Menu.Buscar_Menu_ID(id_menu)
            if (!menu) {
                return { error: true, message: 'No se ha encontrado este menu' } //!ERROR
            }
            return menu[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al buscar el menu' }
        }
    }

    public async Editar_menu(id_menu: number, menu_request: MenusModulos, usuario_modificacion: string) {

        const { nombre_menu, link_menu, n_orden, id_modulo } = menu_request

        let nombre_editado: string
        let link_menu_editado: string
        try {
            const BMenu: any = await this._Query_Menu.Buscar_Menu_Nombre(nombre_menu)
            if (BMenu?.length > 0 && BMenu[0].nombre_menu !== nombre_menu) {
                return { error: true, message: 'Ya existe este menu' } //!ERROR
            }

            // VALIDAR SI EL ORDEN DEL MENU EXISTE DENTRO DEL MODULO
            const esOrdenMenu = await this._Query_Menu.Buscar_Orden_Menu("", n_orden)
            if(esOrdenMenu.length > 0 && BMenu[0].id_modulo === id_modulo) {
                return { error: true, message: 'Este numero de orden esta ocupado' } //!ERROR
            }

            const respuesta: any = await this._Query_Menu.Buscar_Menu_ID(id_menu)
            if (respuesta[0]?.nombre_menu === nombre_menu) {
                nombre_editado = respuesta[0]?.nombre_menu
            } else {
                nombre_editado = nombre_menu
            }

            if (respuesta[0]?.link_menu === link_menu) {
                link_menu_editado = respuesta[0]?.link_menu
            } else {
                link_menu_editado = link_menu
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modificacion, menu_request.ip, menu_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modificacion}, IP: \n ${menu_request.ip}, UBICACIÓN: \n ${menu_request?.ubicacion}`)
            }

            const res = await this._Query_Menu.Editar_Menu(id_menu, nombre_editado, link_menu_editado.toLowerCase(), usuario_modificacion)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el menu' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar menu' } //!ERROR
        }
    }

    public async Cambiar_Estado_Menu(id_menu: number, estado: number, info_user: Logs_Info, usuario: string) {
        try {
            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
            }

            const menu_editado = await this._Query_Menu.Cambiar_Estado_Menu(id_menu, estado);
            if (!menu_editado?.rowCount) {
                return { error: true, message: 'Error cambiar de estado del menu' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado del menu' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error cambiar de estado del menu' } //!ERROR
        }
    }
}