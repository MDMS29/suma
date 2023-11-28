import QueryAuditoria from "../../querys/Auditoria/QueryAuditoria";

export class HistorialService {
    private _Query_Auditoria: QueryAuditoria;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Auditoria = new QueryAuditoria();
    }

    public async Obtener_Logs_Auditoria() {
        try {
            const respuesta:any = await this._Query_Auditoria.Obtener_Logs_Auditoria()
            if(respuesta?.rows?.length <= 0){
                return { error: true, message: 'No se han encontrado logs' } //!ERROR
            }
            return respuesta.rows
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los los de auditoria' } //!ERROR
        }
    }
}