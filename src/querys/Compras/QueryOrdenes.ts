import { Detalle_Orden, Encabezado_Orden } from "../../Interfaces/Compras/ICompras";
import { Tipo_Orden, Tipo_Producto_Orden } from "../../Interfaces/Opciones_Basicas/IOpcioBasic";
import { Database, _DB } from "../../config/db";
import {
    _FAObtener_tipos_ordenes,
    _FA_filtro_ordenes,
    _buscar_detalle_orden, _buscar_numero_orden, _buscar_orden_id,
    _buscar_tipo_orden_id,
    _buscar_tipo_orden_nombre, _buscar_tipo_producto_orden, _editar_detalle_orden, _editar_encabezado_orden,
    _editar_tipo_orden,
    _editar_tipo_produco_orden,
    _eliminar_restaurar_orden, _insertar_orden, _insertar_orden_detalle,
    _insertar_tipo_orden, _insertar_tipo_producto_orden, _obtener_ordenes, _obtener_tipo_producto_orden
} from "../../dao/Compras/DaoOrdenes";

export default class QueryOrdenes extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Ordenes(empresa: string, estado: string, inputs: string) {
        const client = await this.pool.connect()
        try {
            if(!inputs){
                let result = await client.query(_obtener_ordenes, [empresa, estado]);
                return result.rows    
            }else{
                let result = await _DB.func(_FA_filtro_ordenes, [empresa, estado, inputs]);
                return result 
            }
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
            fecha_orden, id_forma_pago, lugar_entrega,
            observaciones, cotizacion, fecha_entrega, anticipo
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
            fecha_orden, id_forma_pago, lugar_entrega,
            observaciones, cotizacion, fecha_entrega, anticipo
        } = req_body

        try {
            let result = await client.query(
                _editar_encabezado_orden,
                [
                    id_orden,
                    id_tipo_orden, id_tercero, orden,
                    fecha_orden, id_forma_pago,
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


    // QUERY PARA LOS TIPOS DE ORDENES
    public async Obtener_Tipos_Ordenes(empresa: number) {
        const client = await this.pool.connect()
        try {
            let result = await _DB.func(_FAObtener_tipos_ordenes, [empresa]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Obtener_Tipo_Producto_Orden(orden: Tipo_Orden) {
        const client = await this.pool.connect()
        const { id_tipo_orden } = orden

        try {
            let result = await client.query(_obtener_tipo_producto_orden, [id_tipo_orden]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Nombre_Tipo(orden: Tipo_Orden) {
        const client = await this.pool.connect()
        const { tipo_orden, id_empresa } = orden

        try {
            let result = await client.query(_buscar_tipo_orden_nombre, [tipo_orden, id_empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Tipo_Orden(orden: Tipo_Orden) {
        const client = await this.pool.connect()
        const { tipo_orden, id_empresa, consecutivo } = orden

        try {
            let result = await client.query(_insertar_tipo_orden, [id_empresa, tipo_orden, consecutivo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Tipo_Producto_Orden(req_body: Tipo_Producto_Orden, id_tipo_orden: number) {
        const client = await this.pool.connect()

        console.log('guardando tipo producto orden.... \n', req_body)


        const { id_tipo_producto } = req_body

        try {
            let result = await client.query(
                _insertar_tipo_producto_orden,
                [
                    id_tipo_orden, id_tipo_producto
                ]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Tipo_ID(id_tipo_orden: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_tipo_orden_id, [id_tipo_orden]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Tipo_Producto_Orden(req_body: Tipo_Producto_Orden, id_tipo_orden: number) {
        const client = await this.pool.connect()

        const { id_tipo_producto } = req_body

        try {
            let result = await client.query(_buscar_tipo_producto_orden, [id_tipo_producto, id_tipo_orden]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Tipo_Orden(orden: Tipo_Orden, id_tipo_orden: number) {
        const client = await this.pool.connect()
        const { tipo_orden, consecutivo } = orden

        try {
            let result = await client.query(_editar_tipo_orden, [id_tipo_orden, tipo_orden, consecutivo]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Tipo_Producto_Orden(req_body: Tipo_Producto_Orden, id_tipo_orden: number) {
        const client = await this.pool.connect()

        console.log('editando tipo producto orden.... \n', req_body)

        const { id_tipo_producto_orden, id_tipo_producto, id_estado } = req_body

        try {
            let result = await client.query(
                _editar_tipo_produco_orden,
                [
                    id_tipo_producto_orden, id_tipo_orden, id_tipo_producto, id_estado
                ]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}