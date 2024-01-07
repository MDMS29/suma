import { Logs_Info } from "../../Interfaces/IConstants";
import QueryRol from "../../querys/Configuracion/QueryRol";
import Querys from "../../querys/Querys";

export class RolService {
    private _Query_Rol: QueryRol;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Rol = new QueryRol();
        this._Querys = new Querys();
    }

    public async Obtener_Roles(estado: number): Promise<any> {
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
            return { error: true, message: 'Error al cargar los roles' } //!ERROR
        }
    }

    public async Insertar_Rol(request_rol: any, usuario_creacion: string) {
        const { nombre, descripcion } = request_rol
        try {
            //VALIDAR SI EL ROL EXISTE
            const Brol: any = await this._Query_Rol.Buscar_Rol_Nombre(nombre)
            if (Brol?.length > 0) {
                return { error: true, message: 'Ya existe este rol' } //!ERROR
            }
            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, request_rol.ip, request_rol?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${request_rol.ip}, UBICACIÓN: \n ${request_rol?.ubicacion}`)
            }

            //INVOCAR FUNCION PARA INSERTAR ROL
            const respuesta = await this._Query_Rol.Insertar_Rol(nombre, descripcion, usuario_creacion)
            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el rol' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL ROL POR ID
            const rol = await this._Query_Rol.Buscar_Rol_ID(respuesta[0].id_rol)
            if (!rol) {
                return { error: true, message: 'No se ha encontrado el rol' } //!ERROR
            }

            return rol[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el rol' } //!ERROR
        }
    }

    public async Buscar_Rol(id_rol: number): Promise<any> {
        try {
            const rol = await this._Query_Rol.Buscar_Rol_ID(id_rol)
            if (!rol) {
                return { error: true, message: 'No se ha encontrado este rol' } //!ERROR
            }
            return rol[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el rol' }
        }
    }

    public async Editar_Rol(id_rol: number, request_rol: any, usuario_modificacion: string) {
        const { nombre, descripcion } = request_rol
        let nombre_editado: string
        let descripcion_editado: string
        try {
            // COMPROBAR SI ESTE ROL EXISTE
            const respuesta: any = await this._Query_Rol.Buscar_Rol_ID(id_rol)
            if (respuesta.length === 0) {
                return { error: true, message: 'No existe este rol' } //!ERROR
            }

            const rol_filtrado: any = await this._Query_Rol.Buscar_Rol_Nombre(nombre)
            if (rol_filtrado?.length > 0 && rol_filtrado[0].nombre !== respuesta[0].nombre) {
                return { error: true, message: 'Ya existe este rol' } //!ERROR
            }


            // ACTUALIZAR
            if (respuesta[0]?.nombre === nombre) {
                nombre_editado = respuesta[0]?.nombre
            } else {
                nombre_editado = nombre
            }

            if (respuesta[0]?.descripcion === descripcion) {
                descripcion_editado = respuesta[0]?.descripcion
            } else {
                descripcion_editado = descripcion
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modificacion, request_rol.ip, request_rol?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modificacion}, IP: \n ${request_rol.ip}, UBICACIÓN: \n ${request_rol?.ubicacion}`)
            }

            const res = await this._Query_Rol.Editar_Rol(id_rol, nombre_editado, descripcion_editado, usuario_modificacion)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el rol' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar rol' } //!ERROR
        }
    }

    public async Cambiar_Estado_Rol(id_rol: number, estado: number, info_user: Logs_Info, usuario: string) {
        try {
            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
            }
            
            const rol_editado = await this._Query_Rol.Cambiar_Estado_Rol(id_rol, estado);
            if (!rol_editado?.rowCount) {
                return { error: true, message: 'Error al editar el rol' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado del rol' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el rol' } //!ERROR
        }
    }
}