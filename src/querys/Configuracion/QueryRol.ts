import { pool } from "../../../config/db";

import {
    _BuscarRolID, _BuscarRolNombre, _CambiarEstadoRol, _EditarRol,
    _InsertarRol, _ObtenerRoles, _ObtenerUltimoID
} from "../../dao/Configuracion/DaoRol";

export default class QueryRol {
    public async ObtenerRoles(estado: number) {
        const client = await pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_ObtenerRoles, [estado]);
            return result.rows;
        } catch (error) {
            console.log(error);
            return [];
        } finally {
            client.release();
        }
    }

    public async Buscar_Rol_Nombre(nombre_rol: string) {
        const client = await pool.connect(); // Obtiene una conexión de la piscina

        try {
            let result = await client.query(_BuscarRolNombre, [nombre_rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Rol(nombre_rol: string, descripcion: string, usuario_creacion: string) {
        const client = await pool.connect(); // Obtiene una conexión de la piscina

        try {

            let ultimo_id = await client.query(_ObtenerUltimoID);
            ultimo_id = ultimo_id.rows[0].id_rol + 1
            let result = await client.query(_InsertarRol, [ultimo_id, nombre_rol, descripcion, usuario_creacion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Rol_ID(id_rol: number) {
        const client = await pool.connect(); // Obtiene una conexión de la piscina

        try {
            let result = await client.query(_BuscarRolID, [id_rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Rol(id_rol: number, nombre_editado: string, descripcion: string, usuario_modificacion: string) {
        const client = await pool.connect(); // Obtiene una conexión de la piscina

        try {
            let result = await client.query(_EditarRol, [id_rol, nombre_editado, descripcion, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Rol(id_rol: number, estado: number) {
        const client = await pool.connect(); // Obtiene una conexión de la piscina

        try {
            let result = await client.query(_CambiarEstadoRol, [id_rol, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}