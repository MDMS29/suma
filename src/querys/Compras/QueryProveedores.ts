import { Database } from "../../config/db";

import {
    _buscar_correo_proveedor, _buscar_documento_proveedor,
    _buscar_proveedor_id, _buscar_suministro_proveedor, _cambiar_estado_proveedor,
    _editar_direccion,
    _editar_proveedor, _editar_suministro, _insertar_direccion, _insertar_proveedor,
    _insertar_suministro_proveedor, _obtener_proveedores
} from "../../dao/Compras/DaoProveedores";

import { Tercero } from '../../Interfaces/Compras/ICompras';
import { Direccion } from "../../Interfaces/IConstants";

export default class QueryProveedores extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Proveedores(estado: string, empresa: string): Promise<any> {
        const client = await this.pool.connect()

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
        const client = await this.pool.connect()

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
        const client = await this.pool.connect()

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

    //TODO: IMPLEMENTAR ESTO EN OTRO SITIO PARA REUTILIZAR
    public async Insertar_Direccion(direccion_request: Direccion) {
        const client = await this.pool.connect()

        const {
            tipo_via, numero_u, letra_u,
            numero_d, complemento_u, numero_t,
            letra_d, complemento_d, numero_c,
            complemento_f, departamento, municipio
        } = direccion_request

        try {
            let result = await client.query(
                _insertar_direccion,
                [
                    tipo_via, numero_u, letra_u,
                    numero_d, complemento_u, numero_t,
                    letra_d, complemento_d, numero_c,
                    complemento_f, departamento, municipio
                ]
            );
            return result.rows || []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Direccion(id_direccion: number, direccion_request: Direccion) {
        const client = await this.pool.connect()

        const {
            tipo_via, numero_u, letra_u,
            numero_d, complemento_u, numero_t,
            letra_d, complemento_d, numero_c,
            complemento_f, departamento, municipio
        } = direccion_request

        try {
            let result = await client.query(
                _editar_direccion,
                [
                    id_direccion,
                    tipo_via, numero_u, letra_u,
                    numero_d, complemento_u, numero_t,
                    letra_d, complemento_d, numero_c,
                    complemento_f, departamento, municipio
                ]
            );
            return result.rowCount || 0
        } catch (error) {
            console.log(error)
            return 0
        } finally {
            client.release();
        }
    }



    public async Insertar_Proveedor(proveedor_request: Tercero, usuario_creacion: string) {
        const client = await this.pool.connect()

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
        const client = await this.pool.connect()
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
        const client = await this.pool.connect()

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
        const client = await this.pool.connect()

        const { id_empresa, id_tipo_tercero, id_tipo_documento, documento, nombre, direccion, telefono, correo, contacto, telefono_contacto } = proveedor_request
        const { id_direccion } = direccion


        try {
            let result = await client.query(
                _editar_proveedor,
                [
                    id_proveedor,
                    id_empresa, id_tipo_tercero, id_tipo_documento,
                    documento, nombre, id_direccion,
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

    public async Buscar_Suministro_Proveedor(suministro: { id_tipo_producto: number }, id_proveedor: number) {
        const client = await this.pool.connect()

        try {
            let result: any = await client.query(_buscar_suministro_proveedor, [id_proveedor, suministro.id_tipo_producto]);
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Suministro_Proveedor(id_suministro:number, suministro: { id_suministro: number, id_estado: number }) {
        const client = await this.pool.connect()
        const { id_estado } = suministro

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
        const client = await this.pool.connect()
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