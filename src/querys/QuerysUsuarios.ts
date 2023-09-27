import { client } from "../../config/db";
import { _BuscarUsuario, _LoginUsuario, _SeleccionarTodosLosUsuarios, _ModulosUsuario, _MenusModulos, _InsertarUsuario, _AccionModulos, _InsertarRolModuloUser, _InsertarPerfilUsuario } from "../dao/DaoUsuarios";
import { UsuarioLogeado, UsuarioLogin, ModulosUsuario, MenusModulos } from "../validations/Types";

// let bcrypt = require('bcrypt')
export const _PruebaConexcion = async () => {
    try {
        await client.connect();
        const result = await client.query(_SeleccionarTodosLosUsuarios);
        console.log('Filas de la tabla:', result);
    } catch (error) {
        console.error('Error al conectar o consultar la base de datos:', error);
    } finally {
        console.log('Consulta finalizada');
    }
}

export const _QueryAutenticarUsuario = async ({ perfil, usuario }: UsuarioLogin) => {
    try {
        await client.connect();
        const result = await client.query(_LoginUsuario, [perfil, usuario]);
        // console.log(result)
        if (result) {
            const valor = true
            // const matches = await bcrypt.compare(clave, result.rows[0].clave)
            if (valor) {
                return result.rows[0]
            }
            return
        }
        return
    } catch (error) {
        console.error(error)
        return
    }
}

export const _QueryModulosUsuario = async (id_perfil: number): Promise<undefined | ModulosUsuario[]> => {
    try {
        await client.connect();
        const result = await client.query(_ModulosUsuario, [id_perfil]);
        return result.rows
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryPerfilUsuario = async () => {
    try {
        await client.connect();
        //...
    } catch (error) {
        console.log(error)
    }
}

export const _QueryAccionesModulo = async (id_usuario: number, id_perfil: number) => {
    try {
        await client.connect();
        const result = await client.query(_AccionModulos, [id_usuario, id_perfil]);
        return result.rows
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryMenuModulos = async (id_modulo: number): Promise<undefined | MenusModulos[]> => {
    try {
        await client.connect();
        const result = await client.query(_MenusModulos, [id_modulo]);
        // console.log(result.rows)
        return result.rows
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryBuscarUsuario = async (id: number): Promise<UsuarioLogeado | undefined> => {
    try {
        await client.connect();
        const result = await client.query(_BuscarUsuario, [id]);
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryInsertarUsuario = async (RequestUsuario: any, UsuarioCreador: string) => {
    const { nombre_completo, usuario, clave, correo } = RequestUsuario

    try {
        await client.connect();
        const result = await client.query(_InsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
        if (result) {

            return result.rows[0].id_usuario
        }
        return
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryInsertarRolModulo = async (id_usuario: number, roles: any[]) => {
    // const { nombre_completo, usuario, clave, correo } = RequestUsuario
    for (const rol of roles) {
        try {
            await client.connect();
            await client.query(_InsertarRolModuloUser, [id_usuario, rol.rol]);
        } catch (error) {
            console.log(error)
        }
    }
    return true
}
export const _QueryInsertarPerfilUsuario = async (id_usuario: number, perfiles: any[]) => {
    // const { nombre_completo, usuario, clave, correo } = RequestUsuario
    for (const perfil of perfiles) {
        try {
            await client.connect();
            await client.query(_InsertarPerfilUsuario, [id_usuario, perfil.perfil]);
        } catch (error) {
            console.log(error)
        }
    }
    return true
}