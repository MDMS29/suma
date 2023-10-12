import QueryModulo from "../querys/QuerysModulo";
import { MessageError } from "../validations/Types"
import { EstadosTablas } from "../validations/utils";
// import QueryPerfil from "../querys/QuerysPerfil"

export default class ModuloService {
    private _Query_Modulo: QueryModulo;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Modulo = new QueryModulo();
    }

    public async ObtenerModulos(estado: number): Promise<MessageError | any> {
        if (!estado) return { error: true, message: 'Estado no definido' } //!ERROR
        try {
            const modulos = await this._Query_Modulo.ObtenerModulos(estado)
            if (!modulos) {
                return { error: true, message: `No hay modulos ${estado == EstadosTablas.ESTADO_ACTIVO ? 'activos' : 'inactivos'}` }
            }
            return modulos
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al obtener los modulos' } //!ERROR
        }
    }

    public async InsertarModulo(nombre_modulo: string, icono: string) {
        try {
            const modulo = await this._Query_Modulo.BuscarModuloNombre(nombre_modulo)
            return
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al insertar el modulo' }
        }
    }
}