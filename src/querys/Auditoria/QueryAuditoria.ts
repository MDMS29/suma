import { LogsAuditoria } from "../../Interfaces/Auditoria/IAuditoria";
import { _DB, pool } from "../../config/db";
import { _FAFiltro_logs_auditoria, _obtener_logs_auditoria } from "../../dao/Auditoria/DaoLogs";

export default class QueryAuditoria {
    public async Obtener_Logs_Auditoria() {
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
    public async Obtener_Logs_Auditoria_Filtro(body_request: LogsAuditoria) {
        const { inputs } = body_request

        try {
            let result = await _DB.func(_FAFiltro_logs_auditoria, [
                inputs || '',
                '',
                null,
                null
            ]);

            console.log('RESPUESTA QUERY', result)

            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}