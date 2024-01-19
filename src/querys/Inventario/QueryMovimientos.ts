import { Database } from "../../config/db";
import {
    _buscar_empresa_nit, _buscar_razon_social, _cambiar_estado_empresa,
} from "../../dao/Configuracion/DaoEmpresa";

import { _buscar_detalle_movimiento, _buscar_movimiento_id, _editar_detalle_movimiento, _editar_enc_movimiento, _insertar_detalle_movimiento, _insertar_movimiento, _obtener_movimientos } from "../../dao/Inventario/DaoMovimientos";
import { DetalleMovi, Movimientos } from "../../Interfaces/Inventario/IInventario";

export default class QueryMovimientosAlmacen extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Movimiento_Almacen(empresa: number, estado: number): Promise<any> {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_obtener_movimientos, [empresa, estado]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Razon_Social(razon_social: string) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_razon_social, [razon_social]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Insertar_Movimiento(movimiento_request: Movimientos, usuario_creacion: string) {
        const client = await this.pool.connect()

        const { id_empresa, id_bodega, id_tipo_mov, id_orden, observaciones } = movimiento_request

        try {
            let result = await client.query(_insertar_movimiento, [id_empresa, id_bodega, id_tipo_mov, id_orden, observaciones, usuario_creacion]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Insertar_Detalle_Movimiento(detalle: DetalleMovi, movimiento_id: number) {
        const client = await this.pool.connect()
        const { id_producto, cantidad, precio } = detalle
        try {
            const result = await client.query(_insertar_detalle_movimiento, [movimiento_id, id_producto, cantidad, precio])
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        }
    }

    public async Buscar_Movimiento_ID(movimiento_id: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_movimiento_id, [movimiento_id]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }


    public async Buscar_Detalle_Movimiento(movimiento_id: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_detalle_movimiento, [movimiento_id]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Nit(nit: string) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_empresa_nit, [nit]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Enc_Movimiento(movimiento_id: number, movimientos_request: Movimientos) {
        const client = await this.pool.connect()

        const { id_bodega, id_tipo_mov, id_orden, observaciones, id_empresa } = movimientos_request
        try {
            let result = await client.query(_editar_enc_movimiento, [movimiento_id, id_bodega, id_tipo_mov, id_orden, observaciones, id_empresa]);
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }

    public async Editar_Detalle_Movimiento(detalle_id: number, movimiento_id:number, detalle: DetalleMovi) {
        const client = await this.pool.connect()

        const { id_producto, cantidad, precio } = detalle

        try {
            const result = await client.query(_editar_detalle_movimiento, [detalle_id, movimiento_id, id_producto, cantidad, precio])
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        }
    }

    public async Cambiar_Estado_Empresa(id_empresa: number, estado: number) {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_cambiar_estado_empresa, [id_empresa, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}