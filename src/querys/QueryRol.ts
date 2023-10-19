import { client } from "../../config/db";
import { _BuscarRolID, _BuscarRolNombre, _CambiarEstadoRol, _EditarRol, _InsertarRol, _ObtenerRoles, _ObtenerUltimoID } from "../dao/DaoRol";

export default class QueryRol {
    public async ObtenerRoles(estado: number): Promise<any> {
        try {
            let result = await client.query(_ObtenerRoles, [estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarRolNombre(nombre_rol: string) {
        try {
            let result = await client.query(_BuscarRolNombre, [nombre_rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async InsertarRol(nombre_rol: string, descripcion: string, usuario_creacion: string) {
        try {

            let ultimo_id = await client.query(_ObtenerUltimoID);
            ultimo_id = ultimo_id.rows[0].id_rol + 1
            let result = await client.query(_InsertarRol, [ultimo_id, nombre_rol, descripcion, usuario_creacion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarRolID(id_rol: number) {
        try {
            let result = await client.query(_BuscarRolID, [id_rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async EditarRol(id_rol: number, nombre_editado: string, descripcion: string, usuario_modificacion: string) {
        try {
            let result = await client.query(_EditarRol, [id_rol, nombre_editado, descripcion, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async CambiarEstadoPerfil(id_rol: number, estado: number) {
        try {
            let result = await client.query(_CambiarEstadoRol, [id_rol, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}