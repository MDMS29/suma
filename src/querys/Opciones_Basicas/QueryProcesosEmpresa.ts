import { Database } from "../../config/db";
import {
    _buscar_proceso_codigo, _buscar_proceso_id, _buscar_proceso_nombre, _editar_proceso_empresa, _insertar_proceso_empresa,
    _obtener_procesos_empresa
} from "../../dao/Opciones_Basicas/DaoProcesosEmpresa";

import { Procesos_Empresa } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

export default class QueryProcesosEmpresa extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Procesos_Empresa(empresa: number): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_procesos_empresa, [empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Proceso_Empresa(proceso_empresa_request: Procesos_Empresa, usuario_creacion: string) {
        const client = await this.pool.connect()

        const { id_empresa, codigo, proceso } = proceso_empresa_request
        try {
            let result = await client.query(_insertar_proceso_empresa, [id_empresa, codigo, proceso, usuario_creacion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Proceso_Codigo(proceso_empresa_request: Procesos_Empresa) {
        const client = await this.pool.connect()

        const { id_empresa, codigo } = proceso_empresa_request
        try {
            let result = await client.query(_buscar_proceso_codigo, [id_empresa, codigo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Buscar_Proceso_Nombre(proceso_empresa_request: Procesos_Empresa) {
        const client = await this.pool.connect()

        const { id_empresa, proceso } = proceso_empresa_request

        try {
            let result = await client.query(_buscar_proceso_nombre, [id_empresa, proceso]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Proceso_ID(id_proceso_empresa: number) {
        const client = await this.pool.connect()

        try {
            let result = await client.query(_buscar_proceso_id, [id_proceso_empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Proceso_Empresa(id_proceso_empresa: number, proceso_empresa_request: Procesos_Empresa) {
        const client = await this.pool.connect()

        const { codigo, proceso } = proceso_empresa_request

        try {
            let result = await client.query(_editar_proceso_empresa, [id_proceso_empresa, codigo, proceso]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}