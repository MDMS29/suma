import { Database } from "../../config/db";
import { _obtener_ordenes } from "../../dao/Compras/DaoOrdenes";

export default class QueryOrdenes extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }
    public async Obtener_Ordenes(tipo: string, empresa: string, estado: string) {
        const client = await this.pool.connect()
        try {
            let result = await client.query(_obtener_ordenes, [tipo, empresa, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

}