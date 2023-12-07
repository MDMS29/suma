import { Detalle_Orden, Encabezado_Orden } from "../../Interfaces/Compras/ICompras";
import { Database } from "../../config/db";
import { _buscar_detalle_orden, _buscar_numero_orden, _buscar_orden_id, _editar_detalle_orden, _editar_encabezado_orden, _eliminar_restaurar_orden, _insertar_orden, _insertar_orden_detalle, _obtener_ordenes } from "../../dao/Compras/DaoOrdenes";

export default class QueryOrdenes extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Ordenes(tipo: string, empresa: string, estado: string) {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_ordenes, [tipo, empresa, estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Numero_Orden(req_body: Encabezado_Orden) {
        const client = await this.pool.connect()

        const { orden, id_empresa, id_tipo_orden } = req_body

        try {
            let result = await client.query(_buscar_numero_orden, [orden, id_empresa, id_tipo_orden]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Orden_Encabezado(req_body: Encabezado_Orden, total_orden: number, usuario_creacion: string) {
        const client = await this.pool.connect()

        const {
            id_empresa, id_tipo_orden, id_tercero, orden,
            fecha_orden, id_forma_pago, id_centro_costo, lugar_entrega,
            observaciones, cotizacion, fecha_entrega, anticipo
        } = req_body

        try {
            let result = await client.query(
                _insertar_orden,
                [
                    id_empresa, id_tipo_orden, id_tercero, orden,
                    fecha_orden, id_forma_pago, id_centro_costo, lugar_entrega,
                    observaciones, cotizacion, fecha_entrega, total_orden,
                    anticipo, usuario_creacion
                ]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Insertar_Orden_Detalle(req_body: Detalle_Orden, id_orden: number) {
        const client = await this.pool.connect()

        const {
            id_requisicion, id_producto,
            cantidad, precio_compra, id_iva,
            descuento, descuento_porcentaje, id_estado
        } = req_body

        try {
            let result = await client.query(
                _insertar_orden_detalle,
                [
                    id_orden, id_requisicion, id_producto,
                    cantidad, precio_compra, id_iva,
                    descuento, descuento_porcentaje, id_estado
                ]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Orden_ID(id_orden: number, id_empresa: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_orden_id, [id_orden, id_empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Detalle_Orden(id_orden: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_detalle_orden, [id_orden]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Orden_Encabezado(req_body: Encabezado_Orden, total_orden: number, id_orden: number) {
        const client = await this.pool.connect()

        const {
            id_tipo_orden, id_tercero, orden,
            fecha_orden, id_forma_pago, id_centro_costo, lugar_entrega,
            observaciones, cotizacion, fecha_entrega, anticipo
        } = req_body

        try {
            let result = await client.query(
                _editar_encabezado_orden,
                [
                    id_orden,
                    id_tipo_orden, id_tercero, orden,
                    fecha_orden, id_forma_pago, id_centro_costo,
                    lugar_entrega, observaciones, cotizacion,
                    fecha_entrega, total_orden, anticipo
                ]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Detalle_Orden(req_body: Detalle_Orden) {
        const client = await this.pool.connect()

        const {
            id_detalle, 
            id_requisicion, id_producto,
            cantidad, precio_compra, id_iva,
            descuento, descuento_porcentaje, id_estado
        } = req_body


        try {
            let result = await client.query(
                _editar_detalle_orden,
                [
                    id_detalle,
                    id_requisicion, id_producto, cantidad,
                    precio_compra, id_iva, descuento,
                    descuento_porcentaje, id_estado
                ]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Eliminar_Restaurar_Orden(id_orden: number, id_estado: number){
        const client = await this.pool.connect()

        try {
            let result = await client.query(_eliminar_restaurar_orden,[id_orden, id_estado]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}