import { pool } from "../../../config/db";
import { _obtener_tipos_documentos } from "../../../dao/Opciones_Basicas/Parametrizadas/DaoParametros";


export default class QueryParametros {
    public async Obtener_Tipos_Documento(): Promise<any> {
        const client = await pool.connect()
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

}