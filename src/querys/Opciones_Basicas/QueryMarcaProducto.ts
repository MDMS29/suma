import { pool } from "../../../config/db";

import {
    _buscar_marca_producto, _buscar_marca_producto_id, _editar_marca_producto, _insertar_marca_producto, _obtener_marcas_producto
} from "../../dao/Opciones_Basicas/DaoMarcaProducto";

import { Marca_Producto } from "../../validations/Types";

export default class QueryMarcaProducto {
    public async Obtener_Marcas_Producto(): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await client.query(_obtener_marcas_producto);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Marca_Producto(marca_producto_request: Marca_Producto, _: string) {
        const client = await pool.connect()

        const { marca } = marca_producto_request
        try {
            let result = await client.query(_insertar_marca_producto, [marca]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Marca_Producto(marca_producto_request: Marca_Producto) {
        const client = await pool.connect()

        const { marca } = marca_producto_request
        try {
            let result = await client.query(_buscar_marca_producto, [marca]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Marca_Producto_ID(id_marca: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_marca_producto_id, [id_marca]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Marca_Producto(id_marca_producto: number, marca_producto_request: Marca_Producto) {
        const client = await pool.connect()

        try {
            let result = await client.query(_editar_marca_producto, [id_marca_producto, marca_producto_request.marca]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}