import { pool } from "../../config/db";

import {
    _buscar_unidad_medida, _buscar_unidad_medida_id, _editar_unidad_medida, _insertar_unidad_medida, _obtener_unidades_medida
} from "../../dao/Opciones_Basicas/DaoUnidadesMedida";
import { Unidad_Medida } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

export default class QueryUnidadesMedida {
    public async Obtener_Unidades_Medida(_: number, id_empresa: number): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await client.query(_obtener_unidades_medida, [id_empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Unidad_Medida(unidad_request: Unidad_Medida, _: string) {
        const client = await pool.connect()

        const { id_empresa, unidad } = unidad_request
        try {
            let result = await client.query(_insertar_unidad_medida, [id_empresa, unidad]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Unidad_Medida(unidad_request: Unidad_Medida) {
        const client = await pool.connect()

        const { id_empresa, unidad } = unidad_request
        try {
            let result = await client.query(_buscar_unidad_medida, [id_empresa, unidad]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Unidad_Medida_ID(id_unidad: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_unidad_medida_id, [id_unidad]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Unidad_Medida(id_unidad: number, unidad_medida_request: Unidad_Medida) {
        const client = await pool.connect()

        try {
            let result = await client.query(_editar_unidad_medida, [id_unidad, unidad_medida_request.unidad]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}