import { Iva } from "../../../Interfaces/Opciones_Basicas/IOpcioBasic";
import { Database } from "../../../config/db";
import { _buscar_iva_id, _buscar_iva_nombre, _editar_iva, _insertar_iva, _obtener_formas_pago, _obtener_ivas, _obtener_tipos_documentos } from "../../../dao/Opciones_Basicas/Parametrizadas/DaoParametros";


export default class QueryParametros extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Tipos_Documento(): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_tipos_documentos);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Obtener_Formas_Pago(): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_formas_pago);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Obtener_Ivas(empresa: string): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_ivas, [empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Iva(iva_request: Iva) {
        const client = await this.pool.connect()

        const { descripcion, porcentaje, id_empresa } = iva_request

        try {
            let result = await client.query(_insertar_iva, [descripcion, porcentaje, id_empresa ]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Iva_ID(iva_id: number | undefined): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_buscar_iva_id, [iva_id]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Iva_Nombre(iva_id: string): Promise<any> {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_buscar_iva_nombre, [iva_id]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Iva(iva_id:number, iva_request: Iva) {
        const client = await this.pool.connect()

        const { descripcion, porcentaje, id_empresa } = iva_request

        try {
            let result = await client.query(_editar_iva, [iva_id, descripcion, porcentaje, id_empresa]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}