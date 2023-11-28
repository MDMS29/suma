import { pool } from "../../config/db";
import { _obtener_logs_auditoria } from "../../dao/Auditoria/DaoLogs";

export default class QueryAuditoria {
    public async Obtener_Logs_Auditoria(){
        const client = await pool.connect()
        try {
            let result = await client.query(_obtener_logs_auditoria);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}