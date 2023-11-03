import { _DB, pool } from "../../../config/db";

import {
    _FA_obtener_centros_filtro,
    _buscar_centro_codigo, _buscar_centro_id, _buscar_centro_nombre,
    _buscar_responsable_centro, _cambiar_estado_centro, _editar_centro_costo, _insertar_centro_costo,
    _obtener_centros_costos_empresa,
} from "../../dao/Opciones_Basicas/DaoCentroCostoEmpresa";

import { Centro_Costo } from "../../validations/Types";

export default class QueryCentroCostoEmpresa {
    public async Obtener_Centros_Costo_Empresa(estado: number, empresa: number): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await client.query(_obtener_centros_costos_empresa, [estado, empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Obtener_Centros_Costo_Filtro(empresa: number, tipo: string, valor: number): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await _DB.func(_FA_obtener_centros_filtro, [empresa, tipo, valor]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Centro_Costo(centro_costo_request: Centro_Costo, usuario_creacion: string) {
        const client = await pool.connect()

        const { id_empresa, id_proceso, codigo, consecutivo, centro_costo, correo_responsable } = centro_costo_request
        try {
            let result = await client.query(_insertar_centro_costo, [id_empresa, id_proceso, codigo, centro_costo, correo_responsable, usuario_creacion, consecutivo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Centro_Codigo(centro_costo_request: Centro_Costo) {
        const client = await pool.connect()

        const { id_empresa, codigo } = centro_costo_request
        try {
            let result = await client.query(_buscar_centro_codigo, [id_empresa, codigo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Buscar_Centro_Nombre(centro_costo_request: Centro_Costo) {
        const client = await pool.connect()

        const { id_empresa, centro_costo } = centro_costo_request

        try {
            let result = await client.query(_buscar_centro_nombre, [id_empresa, centro_costo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Buscar_Responsable_Centro(centro_costo_request: Centro_Costo) {
        const client = await pool.connect()

        const { id_empresa, correo_responsable } = centro_costo_request

        try {
            let result = await client.query(_buscar_responsable_centro, [id_empresa, correo_responsable]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Centro_ID(id_centro_costo: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_centro_id, [id_centro_costo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Centro_Costo(id_centro_costo: number, centro_costo_request: Centro_Costo) {
        const client = await pool.connect()

        try {
            const { id_proceso, codigo, centro_costo, correo_responsable, consecutivo } = centro_costo_request
            let result = await client.query(_editar_centro_costo, [id_centro_costo, id_proceso, codigo, centro_costo, correo_responsable, consecutivo]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Centro(id_centro_costo: number, estado: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_cambiar_estado_centro, [id_centro_costo, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}