import { Database } from "../../../config/db";
import { _obtener_formas_pago, _obtener_tipos_documentos } from "../../../dao/Opciones_Basicas/Parametrizadas/DaoParametros";


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

}