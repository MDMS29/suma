import { Detalle_Orden, Encabezado_Orden, Filtro_Ordenes } from "../../Interfaces/Compras/ICompras";
import { Database, _DB } from "../../config/db";
import {
    _FA_filtrar_ordenes,
    _FA_obtener_ordenes, _aprobar_detalle_orden, _aprobar_encabezado_orden,
    _buscar_detalle_orden, _buscar_detalle_orden_pdf, _buscar_detalle_orden_pendiente, _buscar_numero_orden, _buscar_orden_encabezado_pdf, _buscar_orden_id,
    _editar_detalle_orden, _editar_encabezado_orden, _eliminar_restaurar_orden,
    _insertar_orden, _insertar_orden_detalle, _obtener_ordenes,
} from "../../dao/Compras/DaoOrdenes";
import { formatear_fecha } from "../../helpers/utils";

export default class QueryOrdenes extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }

    public async Obtener_Ordenes_Filtro(estado: string, empresa: number, usuario: string, filtros: Partial<Filtro_Ordenes>): Promise<any> {
        const client = await this.pool.connect()
        const { proveedor, forma_pago, numero_orden, tipo_orden, fecha_inicial, fecha_final } = filtros
        try {

            let result = await _DB.func(_FA_filtrar_ordenes, [estado, empresa, usuario, proveedor, forma_pago, numero_orden, tipo_orden, fecha_inicial != '' ? fecha_inicial : null, fecha_final != '' ? fecha_final : null]);
            return result ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Obtener_Ordenes(empresa: string, estado: string, inputs: string) {
        const client = await this.pool.connect()
        try {
            if (!inputs) {
                let result = await client.query(_obtener_ordenes, [empresa, estado]);
                return result.rows || []
            } else {
                let result = await _DB.func(_FA_obtener_ordenes, [empresa, estado, inputs]);
                return result || []
            }
        } catch (error) {
            console.log(error)
            return []
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

    public async Insertar_Orden_Encabezado(req_body: Encabezado_Orden, _: number, usuario_creacion: string) {
        const client = await this.pool.connect()

        const {
            id_empresa, id_tipo_orden, id_tercero, orden,
            fecha_orden, id_forma_pago, lugar_entrega,
            observaciones, cotizacion, fecha_entrega, anticipo, total_orden
        } = req_body

        try {
            let result = await client.query(
                _insertar_orden,
                [
                    id_empresa, id_tipo_orden, id_tercero, orden,
                    fecha_orden, id_forma_pago, lugar_entrega,
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
            descuento, id_estado
        } = req_body

        try {
            let result = await client.query(
                _insertar_orden_detalle,
                [
                    id_orden, id_requisicion, id_producto,
                    cantidad, precio_compra, id_iva,
                    descuento, id_estado
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
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }
    public async Buscar_Encabezado_Doc(id_orden: number, id_empresa: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_orden_encabezado_pdf, [id_orden, id_empresa]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Detalle_Orden_Pendientes(id_orden: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_detalle_orden_pendiente, [id_orden]);
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
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }
    public async Buscar_Detalle_Orden_Doc(id_orden: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_detalle_orden_pdf, [id_orden]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Orden_Encabezado(req_body: Encabezado_Orden, _: number, id_orden: number) {
        const client = await this.pool.connect()

        const {
            id_tipo_orden, id_tercero, orden,
            fecha_orden, id_forma_pago, lugar_entrega,
            observaciones, cotizacion, fecha_entrega, anticipo, total_orden
        } = req_body

        const { id_lugar_entrega } = lugar_entrega

        try {
            let result = await client.query(
                _editar_encabezado_orden,
                [
                    id_orden,
                    id_tipo_orden, id_tercero, orden,
                    formatear_fecha(fecha_orden), id_forma_pago,
                    id_lugar_entrega, observaciones, cotizacion,
                    formatear_fecha(fecha_entrega), total_orden, anticipo
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
            descuento, id_estado
        } = req_body


        try {
            let result = await client.query(
                _editar_detalle_orden,
                [
                    id_detalle,
                    id_requisicion, id_producto, cantidad,
                    precio_compra, id_iva, descuento, id_estado
                ]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Eliminar_Restaurar_Orden(id_orden: number, id_estado: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_eliminar_restaurar_orden, [id_orden, id_estado]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Aprobar_Encabezado_Orden(id_orden: number, id_estado: number, usuario_id:number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_aprobar_encabezado_orden, [id_orden, id_estado, usuario_id]);
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }
    public async Aprobar_Detalle(id_detalle: number, id_estado: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_aprobar_detalle_orden, [id_detalle, id_estado]);
            return result.rowCount ?? 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }

}