import { client } from "../../config/db";
import { _BuscarUsuario, _LoginUsuario, _SeleccionarTodosLosUsuarios } from "../dao/DaoUsuarios";
import { UsuarioLogeado, UsuarioLogin } from "../validations/Types";

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

export const _QueryAutenticarUsuario = async ({ correo, contrasena }: UsuarioLogin) => {
    try {
        await client.connect();
        const result = await client.query(_LoginUsuario, [correo, contrasena]);
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return
    }
}

export const _QueryBuscarUsuario = async (id: number) : Promise<UsuarioLogeado | undefined> => {
    try {
        await client.connect();
        const result = await client.query(_BuscarUsuario, [id]);
        // await client.end();
        return result.rows[0]
    } catch (error) {
        console.log(error)
        return
    }
}