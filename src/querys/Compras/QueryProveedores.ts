import { pool } from "../../config/db";

import {
    _buscar_correo_proveedor, _buscar_documento_proveedor,
    _buscar_proveedor_id, _buscar_suministro_proveedor, _cambiar_estado_proveedor,
    _editar_proveedor, _editar_suministro, _insertar_proveedor,
    _insertar_suministro_proveedor, _obtener_proveedores
} from "../../dao/Compras/DaoProveedores";

import { Tercero } from '../../Interfaces/Compras/ICompras';

export default class QueryProveedores {
    public async Obtener_Proveedores(estado: string, empresa: string): Promise<any> {
        const client = await pool.connect()

        try {
            let result = await client.query(_obtener_proveedores, [+estado, +empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Proveedor_Documento(proveedor_request: Tercero) {
        const client = await pool.connect()

        const { id_tipo_documento, documento } = proveedor_request

        try {
            let result = await client.query(_buscar_documento_proveedor, [documento, id_tipo_documento]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Proveedor_Correo(proveedor_request: Tercero) {
        const client = await pool.connect()

        const { correo } = proveedor_request

        try {
            let result = await client.query(_buscar_correo_proveedor, [correo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Proveedor(proveedor_request: Tercero, usuario_creacion: string) {
        const client = await pool.connect()

        const { id_empresa, id_tipo_tercero, id_tipo_documento, documento, nombre, direccion, telefono, correo, contacto, telefono_contacto } = proveedor_request

        try {
            let result = await client.query(
                _insertar_proveedor,
                [
                    id_empresa, id_tipo_tercero, id_tipo_documento,
                    documento, nombre, direccion,
                    telefono, correo, contacto,
                    telefono_contacto, 1, usuario_creacion
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

    public async Insertar_Sumnistro(suministro: { id_tipo_producto: number }, id_tercero: number) {
        const client = await pool.connect()
        const { id_tipo_producto } = suministro

        try {
            let result = await client.query(
                _insertar_suministro_proveedor,
                [
                    id_tercero, id_tipo_producto
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

    public async Buscar_Proveedor_ID(id_proveedor: number) {
        const client = await pool.connect()

        try {
            let result: any = await client.query(_buscar_proveedor_id, [id_proveedor]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Proveedor(id_proveedor: number, proveedor_request: Tercero) {
        const client = await pool.connect()

        const { id_empresa, id_tipo_tercero, id_tipo_documento, documento, nombre, direccion, telefono, correo, contacto, telefono_contacto } = proveedor_request


        try {
            let result = await client.query(
                _editar_proveedor,
                [
                    id_proveedor,
                    id_empresa, id_tipo_tercero, id_tipo_documento,
                    documento, nombre, direccion,
                    telefono, correo, contacto,
                    telefono_contacto
                ]
            );
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Suministro_Proveedor(suministro: { id_suministro: number }, id_proveedor: number) {
        const client = await pool.connect()

        try {
            let result: any = await client.query(_buscar_suministro_proveedor, [id_proveedor, suministro.id_suministro]);
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Suministro_Proveedor(suministro: { id_suministro: number, id_estado: number }) {
        const client = await pool.connect()
        const { id_suministro, id_estado } = suministro

        try {
            let result = await client.query(
                _editar_suministro,
                [
                    id_suministro, id_estado
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


    public async Cambiar_Estado_Proveedor(id_proveedor: number, estado: number) {
        const client = await pool.connect()
        try {
            let result = await client.query(_cambiar_estado_proveedor, [id_proveedor, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}