import { _DB, client } from "../../config/db";

import {
    _BuscarUsuario, _SeleccionarTodosLosUsuarios,
    _InsertarRolModuloUser, _InsertarPerfilUsuario, _FALoginUsuario, _FAModulosUsuario, _FAMenusModulos, _FAAccionesModulos, _FAInsertarUsuario, _FNBuscarUsuario
} from "../dao/DaoUsuarios";

import {
    UsuarioLogeado, UsuarioLogin, ModulosUsuario, MenusModulos
} from "../validations/Types";


let bcrypt = require('bcrypt')

export const _PruebaConexcion = async () => {
    try {
        await client.connect();
        const result = await client.query(_SeleccionarTodosLosUsuarios);
        await client.end();
        console.log('Filas de la tabla:', result);
    } catch (error) {
        console.error('Error al conectar o consultar la base de datos:', error);
    } finally {
        console.log('Consulta finalizada');
    }
}


export const _QueryAutenticarUsuario = async ({ perfil, usuario, clave }: UsuarioLogin) => {
    try {
        const result = await _DB.func(_FALoginUsuario, [perfil, usuario])
        if (result.length !== 0) {
            const matches = await bcrypt.compare(clave, result[0].clave)
            if (matches) {
                return result[0]
            }
            return
        }
        return
    } catch (error) {
        console.log(error)
    }
}

export const _QueryModulosUsuario = async (id_perfil: number): Promise<undefined | ModulosUsuario[]> => {
    try {
        const result = await _DB.func(_FAModulosUsuario, [id_perfil])
        return result
    } catch (error) {
        console.log(error)
        return
    }
}


export const _QueryMenuModulos = async (id_modulo: number): Promise<undefined | MenusModulos[]> => {
    try {
        const result = await _DB.func(_FAMenusModulos, [id_modulo])
        return result.rows
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryAccionesModulo = async (id_usuario: number, id_perfil: number) => {
    try {
        const result = await _DB.func(_FAAccionesModulos, [id_usuario, id_perfil])
        return result
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryBuscarUsuario = async (id = 0, usuario = '', correo = ''): Promise<UsuarioLogeado | undefined> => {
    
    const query = _FNBuscarUsuario(id, usuario, correo)
    try {
        await client.connect();
        const result = await client.query(query);
        // console.log(result)
        await client.end();
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryInsertarUsuario = async (RequestUsuario: any, UsuarioCreador: string) => {
    const { nombre_completo, usuario, clave, correo } = RequestUsuario

    try {
        const result = _DB.func(_FAInsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
        if (result) {
            return result[0].insertar_usuario;
        }
        return
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryInsertarRolModulo = async (id_usuario: number, roles: any[]) => {
    try {
        for (const rol of roles) {
            await client.connect();
            await client.query(_InsertarRolModuloUser, [id_usuario, rol.id_rol]);
            await client.end()
        }
    } catch (error) {
        console.log(error)
    } finally {
        return true
    }
}

export const _QueryInsertarPerfilUsuario = async (id_usuario: number, perfiles: any[]) => {
    try {
        for (const perfil of perfiles) {
            await client.connect();
            await client.query(_InsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
            await client.end()
        }
    } catch (error) {
        console.log(error)
    } finally {
        return true
    }
}