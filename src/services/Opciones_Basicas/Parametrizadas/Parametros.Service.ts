import QueryParametros from "../../../querys/Opciones_Basicas/Parametrizadas/QueryParametros";

export class ParametrosService {
    private _Query_Parametros: QueryParametros;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Parametros = new QueryParametros();
    }

    public async Obtener_Tipos_Documento(): Promise<any> {
        try {
            const respuesta = await this._Query_Parametros.Obtener_Tipos_Documento()

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado los tipos de documentos' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los tipos de documentos' } //!ERROR
        }
    }

}