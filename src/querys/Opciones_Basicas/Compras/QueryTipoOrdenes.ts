import { Tipo_Orden, Tipo_Producto_Orden } from "../../../Interfaces/Opciones_Basicas/IOpcioBasic";
import { Database, _DB } from "../../../config/db";
import { _FAObtener_tipos_ordenes, _buscar_tipo_orden_id, _buscar_tipo_orden_nombre, 
    _buscar_tipo_producto_orden, _editar_tipo_orden, _editar_tipo_produco_orden, 
    _insertar_tipo_orden, _insertar_tipo_producto_orden, _obtener_tipo_producto_orden } from "../../../dao/Opciones_Basicas/Compras/DaoTipoOrdenes";

export default class _QueryTipoOrdenes extends Database{
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
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

    public async Obtener_Tipo_Producto_Orden(orden: any) {
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