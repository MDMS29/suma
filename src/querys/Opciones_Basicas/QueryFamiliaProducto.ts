import { pool } from "../../../config/db";
import {
    _buscar_familia_descripcion, _buscar_familia_producto, _buscar_familia_producto_id,
    _cambiar_estado_familia, _editar_familia_producto, _insertar_familia_producto, _obtener_familias_producto
} from "../../dao/Opciones_Basicas/DaoFamiliaProducto";

import { Familia_Producto } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

export default class QueryFamiliaProducto {
    public async Obtener_Familias_Producto(estado: number, empresa: number): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await client.query(_obtener_familias_producto, [estado, empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Familia_Producto(familia_producto_request: Familia_Producto, _: string) {
        const client = await pool.connect()

        const { id_empresa, referencia, descripcion } = familia_producto_request
        try {
            let result = await client.query(_insertar_familia_producto, [id_empresa, referencia, descripcion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Familia_Producto(familia_producto_request: Familia_Producto) {
        const client = await pool.connect()

        const { id_empresa, referencia } = familia_producto_request
        try {
            let result = await client.query(_buscar_familia_producto, [id_empresa, referencia]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Buscar_Familia_Descripcion(familia_producto_request: Familia_Producto) {
        const client = await pool.connect()

        const { id_empresa, descripcion } = familia_producto_request
        try {
            let result = await client.query(_buscar_familia_descripcion, [id_empresa, descripcion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Familia_Producto_ID(id_familia_producto: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_familia_producto_id, [id_familia_producto]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Familia_Producto(id_familia_producto: number, familia_producto_request: Familia_Producto) {
        const client = await pool.connect()

        const { id_empresa, referencia, descripcion } = familia_producto_request

        try {
            let result = await client.query(_editar_familia_producto, [id_familia_producto, id_empresa, referencia, descripcion]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Familia(id_familia_producto: number, estado: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_cambiar_estado_familia, [id_familia_producto, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}