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
        const { nombre_tabla,
            tipo_accion,
            nombre_esquema,
            nombre_usuario,
            fecha_inicial,
            fecha_final } = body_request

        try {
            let result = await _DB.func(_FAFiltro_logs_auditoria, [
                nombre_tabla || '',
                tipo_accion || '',
                nombre_esquema || '',
                nombre_usuario || '',
                fecha_inicial || null,
                fecha_final || null
            ]);
            
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}