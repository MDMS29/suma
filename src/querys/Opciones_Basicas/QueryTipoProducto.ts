import { Database } from "../../config/db";

import {
    _buscar_tipo_producto, _buscar_tipo_producto_id, _editar_tipo_producto,
    _insertar_tipo_producto, _obtener_tipos_producto
} from "../../dao/Opciones_Basicas/DaoTipoProducto";

import { Tipo_Producto } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

export default class QueryTipoProducto extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Tipos_Producto(id_empresa: number): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_tipos_producto, [id_empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Tipo_Producto(unidad_request: Tipo_Producto, _: string) {
        const client = await this.pool.connect()

        const { id_empresa, descripcion } = unidad_request
        try {
            let result = await client.query(_insertar_tipo_producto, [id_empresa, descripcion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Tipo_Producto(tipos_producto_request: Tipo_Producto) {
        const client = await this.pool.connect()

        const { id_empresa, descripcion } = tipos_producto_request
        try {
            let result = await client.query(_buscar_tipo_producto, [id_empresa, descripcion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Tipo_Producto_ID(id_tipo_producto: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_tipo_producto_id, [id_tipo_producto]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Tipo_Producto(id_tipo_producto: number, tipos_producto_request: Tipo_Producto) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_editar_tipo_producto, [id_tipo_producto, tipos_producto_request.descripcion]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}