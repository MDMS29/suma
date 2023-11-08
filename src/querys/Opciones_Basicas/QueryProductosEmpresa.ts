import { pool, _DB } from "../../../config/db";

import {
    _buscar_producto_id, _buscar_producto_nombre, _buscar_producto_referencia,
    _cambiar_estado_producto, _editar_producto_empresa, _insertar_producto_empresa,
    _FA_obtener_productos_filtro, _obtener_productos_empresa
} from "../../dao/Opciones_Basicas/DaoProductosEmpresa";

import { Producto_Empresa } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

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

    public async Buscar_Producto_Filtro(tipo: string, valor:any) {
        const client = await pool.connect()

        try {
            let result = await _DB.func(_FA_obtener_productos_filtro, [tipo, valor])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Producto_Empresa(id_producto: number, familia_producto_request: Producto_Empresa, usuario_edicion: string) {
        const client = await pool.connect()


        const {
            id_empresa, id_familia, id_marca, id_tipo_producto, referencia, id_unidad, descripcion,
            precio_costo, precio_venta, critico, inventariable, foto, compuesto, ficha, certificado
        } = familia_producto_request


        try {
            let result = await client.query(
                _editar_producto_empresa,
                //INFORMACION DEL PRODUCTO
                [
                    id_producto,
                    id_empresa, id_familia, id_marca,
                    id_tipo_producto, referencia, id_unidad,
                    descripcion, precio_costo, precio_venta,
                    critico, inventariable, foto,
                    compuesto, ficha, certificado,
                    usuario_edicion
                ]
            ); return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Producto(id_producto: number, estado: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_cambiar_estado_producto, [id_producto, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}