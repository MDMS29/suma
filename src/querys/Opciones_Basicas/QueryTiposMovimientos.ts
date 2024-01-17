import { Database } from "../../config/db";

import { _buscar_tipo_movimiento, _buscar_tipo_movimiento_id, _editar_tipo_movimiento, _insertar_tipo_movimiento, _obtener_tipos_movimientos } from "../../dao/Opciones_Basicas/DaoTiposMovimientos";

import { Tipos_Movimientos } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

export default class QueryTiposMovimientos extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Tipos_Movimientos(id_empresa: number): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_tipos_movimientos, [id_empresa]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Tipo_Movimiento(tipos_mov_request: Tipos_Movimientos) {
        const client = await this.pool.connect()

        const { id_empresa, descripcion, tipo_mov } = tipos_mov_request
        try {
            let result = await client.query(_buscar_tipo_movimiento, [id_empresa, descripcion, tipo_mov]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Insertar_Tipo_Movimiento(tipo_mov_request: Tipos_Movimientos) {
        const client = await this.pool.connect()

        const { id_empresa, descripcion, tipo_mov } = tipo_mov_request
        try {
            let result = await client.query(_insertar_tipo_movimiento, [id_empresa, descripcion, tipo_mov]);
            return result.rows ??[]
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

   

    public async Buscar_Tipo_Movimiento_ID(id_tipo_producto: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_tipo_movimiento_id, [id_tipo_producto]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Tipo_Movimiento(id_tipo_mov: number, tipo_mov_request: Tipos_Movimientos) {
        const client = await this.pool.connect()

        const { id_empresa, descripcion, tipo_mov } = tipo_mov_request

        try {
            let result = await client.query(_editar_tipo_movimiento, [id_tipo_mov, id_empresa, descripcion, tipo_mov]);
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }

}