import { MessageError } from "../validations/Types"
// import QueryPerfil from "../querys/QuerysPerfil"
import QueryRol from "../querys/QueryRol";

export class RolService {
    private _Query_Rol: QueryRol;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Rol = new QueryRol();
    }

    // private ReduceModulos(result: Array<{ id_modulo: number; cod_modulo: string; nombre_modulo: string, permisos?: any }>, modulos: Array<{ id_modulo: number; cod_modulo: string; nombre_modulo: string, permisos?: any }>) {
    //     modulos.forEach((modulo) => {
    //         const esModulo = result.find((existe) => existe.nombre_modulo === modulo.nombre_modulo);
    //         if (!esModulo) {
    //             result.push(modulo);
    //         }
    //     });
    //     return result;
    // }

    public async ObtenerRoles(estado: number): Promise<MessageError | any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Rol.ObtenerRoles(estado)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado roles' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los modulos del perfil' } //!ERROR
        }
    }

    public async InsertarRol(nombre: string, descripcion: string, usuario_creacion: string) {
        try {
                //VALIDAR SI EL ROL EXISTE
            const Brol: any = await this._Query_Rol.BuscarRolNombre(nombre)
            if (Brol?.length > 0) {
                return { error: true, message: 'Ya existe este rol' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR ROL
            const respuesta = await this._Query_Rol.InsertarRol(nombre, descripcion, usuario_creacion)
            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el rol' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL ROL POR ID
            const rol = await this._Query_Rol.BuscarRolID(respuesta[0].id_rol)
            if (!rol) {
                return { error: true, message: 'No se ha encontrado el rol' } //!ERROR
            }

            return rol[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el rol' } //!ERROR
        }
    }
}