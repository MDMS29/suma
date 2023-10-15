import QueryModulo from "../querys/QuerysModulo";
import { MessageError, ModulosUsuario } from "../validations/Types"
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
                return { error: true, message: `No hay modulos ${estado == EstadosTablas.ESTADO_ACTIVO ? 'activos' : 'inactivos'}` } //!ERROR
            }
            return modulos
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al obtener los modulos' } //!ERROR
        }
    }

    public async InsertarModulo(codigo: string, nombre_modulo: string, usuario_creador: string, icono: string): Promise<MessageError | any> {
        try {
            // BUSCAR EL NOMBRE DEL MODULO SI NO SE ENCUENTRA DUPLICADO
            const modulo = await this._Query_Modulo.BuscarModuloNombre(nombre_modulo)
            if (modulo) {
                if (modulo.nombre_modulo.toLowerCase() === nombre_modulo.toLowerCase()) {
                    return { error: true, message: 'Ya existe este modulo' } //!ERROR
                }
            }

            // BUSCAR EL CODIGO DEL MODULO SI NO SE ENCUENTRA DUPLICADO
            const codigo_modulo = await this._Query_Modulo.BuscarCodigoModulo(codigo)
            if (codigo_modulo) {
                return { error: true, message: 'Este codigo ya esta en uso' } //!ERROR

            }

            // INSERTAR EL MODULO
            const modulo_insertado = await this._Query_Modulo.InsertarModulo(nombre_modulo, usuario_creador, codigo, icono)
            if (!modulo_insertado) {
                return { error: true, message: 'Error al insertar el modulo' } //!ERROR
            }

            // BUSCAR EL MODULO AGREGADO
            const modulo_nuevo = await this._Query_Modulo.BuscarModuloID(modulo_insertado.id_modulo)
            if (!modulo_nuevo.id_modulo) {
                return { error: true, message: 'No se ha encontrado el modulo' } //!ERROR
            }
            return modulo_nuevo //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al insertar el modulo' } //!ERROR
        }
    }

    public async BuscarModulo(id_modulo: number): Promise<MessageError | any> {
        try {
            const modulo = await this._Query_Modulo.BuscarModuloID(id_modulo)
            if (!modulo) {
                return { error: true, message: 'No se ha encontrado el modulo' } //!ERROR
            }
            return modulo //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el modulo' } //!ERROR
        }
    }

    public async EditarModulo(id_modulo: number, Request_Modulo: Partial<ModulosUsuario>, usuario_modi: string): Promise<MessageError | any> {
        try {

            const moduloB = await this._Query_Modulo.BuscarModuloID(id_modulo)
            if (!moduloB) {
                return { error: true, message: 'No se ha encontrado el modulo' }
            }
            if (!Request_Modulo) {
                return
            }

            let nombreEditado: string
            
            if (Request_Modulo.nombre_modulo) {
                if (moduloB.nombre_modulo !== Request_Modulo.nombre_modulo) {
                    const nombre = await this._Query_Modulo.BuscarModuloNombre(Request_Modulo.nombre_modulo)
                    if (nombre) {
                        return { error: true, message: 'Ya existe este modulo' }
                    }
                    nombreEditado = Request_Modulo.nombre_modulo
                } else {

                }
            }

            const modulo = await this._Query_Modulo.EditarModulo(id_modulo, Request_Modulo, usuario_modi)
            if (!modulo?.rowCount) {
                return { error: true, message: 'Error al editar el modulo' } //!ERROR
            }
            return modulo //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el modulo' } //!ERROR
        }
    }
}