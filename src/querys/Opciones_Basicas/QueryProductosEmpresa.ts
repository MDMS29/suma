import { pool } from "../../../config/db";
import {
    _buscar_familia_descripcion, _buscar_familia_producto, _buscar_familia_producto_id,
    _cambiar_estado_familia, _editar_familia_producto, _insertar_familia_producto
} from "../../dao/Opciones_Basicas/DaoFamiliaProducto";

import {
    _buscar_producto_id, _buscar_producto_nombre, _buscar_producto_referencia,
    _insertar_producto_empresa,
    _obtener_productos_empresa
} from "../../dao/Opciones_Basicas/DaoProductosEmpresa";

import { Familia_Producto, Producto_Empresa } from "../../validations/Types";

export default class QueryProductosEmpresa {
    public async Obtener_Productos_Empresa(estado: number, empresa: number): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await client.query(_obtener_productos_empresa, [estado, empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Producto_Empresa(familia_producto_request: Producto_Empresa, usuario_creacion: string) {
        const client = await pool.connect()

        const {
            id_empresa, id_familia, id_marca, id_tipo_producto, referencia, id_unidad, descripcion,
            precio_costo, precio_venta, critico, inventariable, foto, compuesto, ficha, certificado
        } = familia_producto_request
        try {
            let result = await client.query(
                _insertar_producto_empresa,
                //INFORMACION DEL PRODUCTO
                [
                    id_empresa, id_familia, id_marca, 
                    id_tipo_producto, referencia, id_unidad, 
                    descripcion, precio_costo, precio_venta, 
                    critico, inventariable, foto, 
                    compuesto, ficha, certificado, 
                    usuario_creacion
                ]
            );
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Producto_Nombre(producto_empresa_request: Producto_Empresa) {
        const client = await pool.connect()

        const { id_empresa, descripcion } = producto_empresa_request
        try {
            let result = await client.query(_buscar_producto_nombre, [id_empresa, descripcion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Producto_Referencia(producto_empresa_request: Producto_Empresa) {
        const client = await pool.connect()

        const { id_empresa, referencia } = producto_empresa_request
        try {
            let result = await client.query(_buscar_producto_referencia, [id_empresa, referencia]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Producto_ID(id_producto: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_producto_id, [id_producto]);
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