import { Database } from "../../config/db";
import { _buscar_bodega_id, _buscar_bodega_nombre, _buscar_movimientos_bodega, _editar_bodega, _editar_movimiento_bodega, _eliminar_restaurar_bodega, _insertar_bodega, _insertar_mov_bodega, _obtener_bodegas, _obtener_bodegas_filtro } from "../../dao/Opciones_Basicas/DaoBodegas";
import { Bodega, FiltrosBodegas, MOVBodega } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

export default class QueryBodegas extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Bodegas_Filtro(id_empresa: number, filtros: FiltrosBodegas): Promise<any> {
        const client = await this.pool.connect()

        const { tipo_mov } = filtros

        try {
            let result = await client.query(_obtener_bodegas_filtro, [id_empresa, tipo_mov]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Obtener_Bodegas(id_empresa: number, estado_id: number): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_bodegas, [id_empresa, estado_id]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Bodega(bodega_request: Bodega) {
        const client = await this.pool.connect()

        const { id_empresa, nombre } = bodega_request
        try {
            let result = await client.query(_buscar_bodega_nombre, [id_empresa, nombre]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Insertar_Bodega(bodega_request: Bodega) {
        const client = await this.pool.connect()

        const { id_empresa, nombre, con_entradas, con_salidas } = bodega_request
        try {
            let result = await client.query(_insertar_bodega, [id_empresa, nombre, con_entradas, con_salidas]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Insertar_Movimiento_Bodega(bodega_id: number, movimiento_request: MOVBodega) {
        const client = await this.pool.connect()

        const { id_tipo_mov } = movimiento_request

        try {
            let result = await client.query(_insertar_mov_bodega, [bodega_id, id_tipo_mov]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Movimientos_Bodega(id_bodega: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_movimientos_bodega, [id_bodega]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Bodega_ID(id_bodega: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_bodega_id, [id_bodega]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Bodega(bodega_id: number, bodega_request: Bodega) {
        const client = await this.pool.connect()

        const { id_empresa, nombre, con_entradas, con_salidas } = bodega_request

        try {
            let result = await client.query(_editar_bodega, [bodega_id, id_empresa, nombre, con_entradas, con_salidas]);
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }

    public async Editar_Movimiento_Bodega(MOVbodega_request: MOVBodega) {
        const client = await this.pool.connect()

        const { id_mov_bodega, id_estado } = MOVbodega_request

        try {
            let result = await client.query(_editar_movimiento_bodega, [id_mov_bodega, id_estado]);
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }

    public async Eliminar_Restaurar_Bodega(bodega_id: number, estado: number) {
        const client = await this.pool.connect()
        try {
            const result = await client.query(_eliminar_restaurar_bodega, [bodega_id, estado])
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        }
    }

}