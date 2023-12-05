import QueryOrdenes from "../../querys/Compras/QueryOrdenes";

export class OrdenesService {
    private _Query_Ordenes: QueryOrdenes;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Ordenes = new QueryOrdenes();
    }

    public async Obtener_Ordenes(tipo: string, empresa: string, estado: string) {
        try {
            const respuesta: any = await this._Query_Ordenes.Obtener_Ordenes(tipo, empresa, estado)
            if (respuesta?.rows?.length <= 0) {
                return { error: true, message: 'No se han encontrado las ordenes' } //!ERROR
            }
            return respuesta.rows
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las ordenes' } //!ERROR
        }
    }

}