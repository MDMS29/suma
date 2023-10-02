import { _DB, client } from "../../config/db";

import {
    _SeleccionarTodosLosUsuarios,
    _FALoginUsuario, _FAModulosUsuario, _FAMenusModulos,
    _FAAccionesModulos, _FAInsertarUsuario, _FABuscarUsuarioID,
    _FABuscarUsuarioCorreo, _PAInsertarRolModuloUsuario, _PAInsertarPerfilUsuario, _MenusUsuario
} from "../dao/DaoUsuarios";
// UsuarioLogeado
import {
    UsuarioLogin, ModulosUsuario, MenusModulos, PermisosModulos
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

export const _QueryAutenticarUsuario = async ({ usuario, clave }: UsuarioLogin) => {
    try {
        const result = await _DB.func(_FALoginUsuario, [usuario])
        if (result.length !== 0) {
            const matches = await bcrypt.compare(clave, result[0].clave)
            if (matches) {
                return result
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
export const _QueryModulosUsuario2 = async (id_usuario: number) => {
    try {
        const result = await client.query('SELECT DISTINCT vpr.id_modulo, vpr.nombre_modulo FROM seguridad.view_permisos_roles vpr WHERE vpr.id_usuario = $1', [id_usuario])
        return result.rows
    } catch (error) {
        console.log(error)
        return
    }
}


export const _QueryMenuModulos = async (id_modulo: number): Promise<[] | MenusModulos[]> => {
    try {
        const result = await _DB.func(_FAMenusModulos, [id_modulo])
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

export const _QueryAccionesModulo = async (id_modulo: number, id_usuario: number, id_perfil: number): Promise<[] | PermisosModulos[]> => {
    try {
        const result = await _DB.func(_FAAccionesModulos, [id_modulo, id_usuario, id_perfil])
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

export const _QueryBuscarUsuario = async (id = 0, usuario = '', correo = '') => {

    let Result
    try {
        if (id !== 0) {
            Result = await _DB.func(_FABuscarUsuarioID, [id])
        }
        if (usuario !== '' && correo !== '') {
            Result = await _DB.func(_FABuscarUsuarioCorreo, [usuario, correo])
        }
        return Result[0]
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryInsertarUsuario = async (RequestUsuario: any, UsuarioCreador: string): Promise<number | undefined> => {
    const { nombre_completo, usuario, clave, correo } = RequestUsuario

    try {
        const result = await _DB.func(_FAInsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
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
            await _DB.proc(_PAInsertarRolModuloUsuario, [id_usuario, rol.id_rol]);
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
            await _DB.proc(_PAInsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
        }
    } catch (error) {
        console.log(error)
    } finally {
        return true
    }
}

export const _QueryMenusUsuario = async (id_usuario: number, id_perfil: number) => {
    try {
        const result = await client.query(_MenusUsuario, [id_usuario, id_perfil])
        return result.rows
    } catch (error) {
        console.log(error)
        return
    }
}