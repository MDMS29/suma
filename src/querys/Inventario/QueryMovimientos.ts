import { Database } from "../../config/db";
import {
    _buscar_empresa_id, _buscar_empresa_nit, _buscar_razon_social, _cambiar_estado_empresa,
    _editar_empresa, _insertar_empresa, _obtener_empresas
} from "../../dao/Configuracion/DaoEmpresa";

import { _obtener_movimientos } from "../../dao/Inventario/DaoMovimientos";
import { Empresa } from '../../Interfaces/Configuracion/IConfig';

export default class QueryMovimientosAlmacen extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Movimiento_Almacen(empresa: number, estado: number): Promise<any> {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_obtener_movimientos, [empresa, estado]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Razon_Social(razon_social: string) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_razon_social, [razon_social]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Insertar_Empresa(empresa_request: Empresa, usuario_creacion: string) {
        const client = await this.pool.connect()
        const { nit, razon_social, direccion, telefono, correo } = empresa_request

        try {
            let result = await client.query(_insertar_empresa, [nit, razon_social, telefono, direccion, correo, usuario_creacion]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Empresa_ID(id_empresa: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_empresa_id, [id_empresa]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Buscar_Nit(nit: string) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_empresa_nit, [nit]);
            return result.rows ?? []
        } catch (error) {
            console.log(error)
            return []
        } finally {
            client.release();
        }
    }

    public async Editar_Empresa(id_empresa: number, empresa_request: Empresa, usuario_modificacion: string) {
        const client = await this.pool.connect()
        const { nit, razon_social, direccion, telefono, correo } = empresa_request

        try {
            let result = await client.query(_editar_empresa, [id_empresa, nit, razon_social, telefono, direccion, correo, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Empresa(id_empresa: number, estado: number) {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_cambiar_estado_empresa, [id_empresa, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}