import QueryMenu from "../querys/QueryMenu";

export class MenuService {
    private _Query_Menu: QueryMenu;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Menu = new QueryMenu();
    }

    public async Obtener_Menus(estado: number, id_modulo: number): Promise<any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Menu.Obtener_Menus(estado, id_modulo)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado menus' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los menus' } //!ERROR
        }
    }

    public async Insertar_Menu(nombre: string, link_menu: string, id_modulo: string, usuario_creacion: string) {
        try {
            //VALIDAR SI EL MENU EXISTE
            const BMenu: any = await this._Query_Menu.Buscar_Menu_Nombre(nombre)
            if (BMenu?.length > 0) {
                return { error: true, message: 'Ya existe este menu' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR MENU
            const respuesta = await this._Query_Menu.Insertar_Menu(nombre, link_menu, id_modulo, usuario_creacion)
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
            return { error: true, message: 'Error al editar el menu' }
        }
    }

    public async Editar_menu(id_menu: number, nombre: string, link_menu: string, usuario_modificacion: string) {
        let nombre_editado: string
        let link_menu_editado: string
        try {
            const BMenu: any = await this._Query_Menu.Buscar_Menu_Nombre(nombre)
            if (BMenu?.length > 0 && BMenu[0].nombre_menu !== nombre) {
                return { error: true, message: 'Ya existe este menu' } //!ERROR
            }
            const respuesta: any = await this._Query_Menu.Buscar_Menu_ID(id_menu)
            if (respuesta[0]?.nombre_menu === nombre) {
                nombre_editado = respuesta[0]?.nombre_menu
            } else {
                nombre_editado = nombre
            }

            if (respuesta[0]?.link_menu === link_menu) {
                link_menu_editado = respuesta[0]?.link_menu
            } else {
                link_menu_editado = link_menu
            }

            const res = await this._Query_Menu.Editar_Menu(id_menu, nombre_editado, link_menu_editado, usuario_modificacion)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el menu' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar menu' } //!ERROR
        }
    }

    public async Cambiar_Estado_Menu(id_menu: number, estado: number) {
        try {

            const menu_editado = await this._Query_Menu.Cambiar_Estado_Menu(id_menu, estado);
            if (!menu_editado?.rowCount) {
                return { error: true, message: 'Error al editar el menu' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado del menu' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el menu' } //!ERROR
        }
    }
}