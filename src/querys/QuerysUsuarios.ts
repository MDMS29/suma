import { client } from "../../config/db";
import { _BuscarUsuario, _LoginUsuario, _SeleccionarTodosLosUsuarios, _ModulosUsuario, _MenusModulos, _InsertarUsuario } from "../dao/DaoUsuarios";
import { UsuarioLogeado, UsuarioLogin, ModulosUsuario, MenusModulos } from "../validations/Types";

export const _PruebaConexcion = async () => {
    try {
        await client.connect();
        const result = await client.query(_SeleccionarTodosLosUsuarios);
        console.log('Filas de la tabla:', result);
    } catch (error) {
        console.error('Error al conectar o consultar la base de datos:', error);
    } finally {
        console.log('Consulta finalizada');
        // await client.end();
    }
}

export const _QueryAutenticarUsuario = async ({ usuario, clave }: UsuarioLogin) => {
    try {
        await client.connect();
        const result = await client.query(_LoginUsuario, [usuario, clave]);
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryModulosUsuario = async (id_usuario: number): Promise<undefined | ModulosUsuario[]> => {
    try {
        await client.connect();
        const result = await client.query(_ModulosUsuario, [id_usuario]);
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

export const _QueryInsertarUsuario = async (RequestUsuario: any, UsuarioCreador: number) => {
    const { nombre_completo, usuario, clave, correo } = RequestUsuario

    try {
        await client.connect();
        const result = await client.query(_InsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
        if (result.rows[0].id_usuario) {
            const respuesta = await _QueryBuscarUsuario(result.rows[0].id_usuario)
            return respuesta
        }
        return
    } catch (error) {
        console.log(error)
        return
    }
}