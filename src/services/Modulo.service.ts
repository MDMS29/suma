import QueryModulo from "../querys/QuerysModulo";
import { EstadosTablas } from "../validations/utils";
export default class ModuloService {
    private _Query_Modulo: QueryModulo;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Modulo = new QueryModulo();
    }

    public async Obtener_Modulos(estado: number): Promise<any> {
        if (!estado) return { error: true, message: 'Estado no definido' } //!ERROR
        try {
            const modulos = await this._Query_Modulo.Obtener_Modulos(estado)
            if (!modulos) {
                return { error: true, message: `No hay modulos ${estado == EstadosTablas.ESTADO_ACTIVO ? 'activos' : 'inactivos'}` } //!ERROR
            }
            return modulos
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al obtener los modulos' } //!ERROR
        }
    }

    public async Insertar_Modulo(codigo: string, nombre_modulo: string, icono: string, usuario_creador: string, roles: any): Promise<any> {
        try {
            // BUSCAR EL NOMBRE DEL MODULO SI NO SE ENCUENTRA DUPLICADO
            const modulo = await this._Query_Modulo.Buscar_Modulo_Nombre(nombre_modulo)
            if (modulo) {
                if (modulo.nombre_modulo.toLowerCase() === nombre_modulo.toLowerCase()) {
                    return { error: true, message: 'Este nombre ya esta en uso' } //!ERROR
                }
            }

            // BUSCAR EL CODIGO DEL MODULO SI NO SE ENCUENTRA DUPLICADO
            const codigo_modulo = await this._Query_Modulo.Buscar_Codigo_Modulo(codigo)
            if (codigo_modulo) {
                return { error: true, message: 'Este codigo ya esta en uso' } //!ERROR

            }

            if (!icono.startsWith('pi-')) {
                icono = 'pi-box'
            }

            // INSERTAR EL MODULO
            const modulo_insertado = await this._Query_Modulo.Insertar_Modulo(nombre_modulo, usuario_creador, codigo, icono)
            if (!modulo_insertado) {
                return { error: true, message: 'Error al insertar el modulo' } //!ERROR
            }

            for (let rol of roles) {
                const roles_modulo = await this._Query_Modulo.Insertar_Roles_Modulo(rol.id_rol, modulo_insertado.id_modulo, usuario_creador)
                if (!roles_modulo) {
                    return { error: true, message: 'Error al insertar el rol del modulo' }
                }
            }


            // BUSCAR EL MODULO AGREGADO
            const modulo_nuevo = await this._Query_Modulo.Buscar_Modulo_ID(modulo_insertado.id_modulo)
            if (!modulo_nuevo.id_modulo) {
                return { error: true, message: 'No se ha encontrado el modulo' } //!ERROR
            }

            const roles_modulo = await this._Query_Modulo.Obtener_Roles_Modulo(modulo_insertado.id_modulo)
            if (!roles_modulo) {
                return { error: true, message: 'Error al encontrar los permisos del modulo' } //!ERROR
            }
            modulo_nuevo.roles = roles_modulo
            return modulo_nuevo //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al insertar el modulo' } //!ERROR
        }
    }

    public async Buscar_Modulo(id_modulo: number): Promise<any> {
        try {
            const modulo = await this._Query_Modulo.Buscar_Modulo_ID(id_modulo)
            if (!modulo) {
                return { error: true, message: 'No se ha encontrado el modulo' } //!ERROR
            }

            const roles = await this._Query_Modulo.Obtener_Roles_Modulo(id_modulo)
            if (!roles) {
                return { error: true, message: 'Error al encontrar los permisos del modulo' } //!ERROR
            }
            modulo.roles = roles
            return modulo //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el modulo' } //!ERROR
        }
    }

    public async Editar_Modulo(id_modulo: number, Request_Modulo: Partial<any>, usuario_modi: string, roles: any): Promise<any> {
        let _Codigo_Editado: string
        let _Nombre_Editado: string
        let _Icono_Editado: string

        
        try {
            const moduloB = await this._Query_Modulo.Buscar_Modulo_ID(id_modulo)
            if (!moduloB) {
                return { error: true, message: 'No se ha encontrado el modulo' }
            }
            
            if (moduloB.nombre_modulo !== Request_Modulo.nombre_modulo) {
                const nombre = await this._Query_Modulo.Buscar_Modulo_Nombre(Request_Modulo.nombre_modulo)
                if (nombre?.id_modulo) {
                    return { error: true, message: 'Ya existe este modulo, ingrese un nombre diferente' }
                } else {
                    _Nombre_Editado = Request_Modulo.nombre_modulo
                }
            } else {
                _Nombre_Editado = moduloB.nombre_modulo
            }

            if (moduloB.cod_modulo !== Request_Modulo.cod_modulo) {
                const codigo = await this._Query_Modulo.Buscar_Codigo_Modulo(Request_Modulo.cod_modulo)
                if (codigo) {
                    return { error: true, message: 'Ya existe este modulo, ingrese un codigo diferente' }
                } else {
                    _Codigo_Editado = Request_Modulo.cod_modulo
                }
            } else {
                _Codigo_Editado = moduloB.cod_modulo
            }

            if (moduloB.icono !== Request_Modulo.icono) {
                if (!Request_Modulo.icono.startsWith('pi-')) {
                    return { error: true, message: 'Este icono es invalido, ingrese a: https://primereact.org/icons/#list' }
                }
                const icono = await this._Query_Modulo.Buscar_Icono_Modulo(Request_Modulo.icono)
                if (icono) {
                    return { error: true, message: 'Ya existe este modulo, ingrese un icono diferente' }
                } else {
                    _Icono_Editado = Request_Modulo.icono
                }
            } else {
                _Icono_Editado =  Request_Modulo.icono
            }

            const nuevoModulo = {
                cod_modulo: _Codigo_Editado,
                nombre_modulo: _Nombre_Editado,
                icono: _Icono_Editado
            }

            const modulo = await this._Query_Modulo.Editar_Modulo(id_modulo, nuevoModulo, usuario_modi)
            if (!modulo?.rowCount) {
                return { error: true, message: 'Error al editar el modulo' } //!ERROR
            }

            // EDITAR LOS ROLES DEL MODULO
            for (let rol of roles) {
                const rol_buscado: any = await this._Query_Modulo.Buscar_Rol_Modulo(id_modulo, rol.id_rol)
                if (rol_buscado?.length === 0) {
                    //INSERTAR
                    const roles_modulo = await this._Query_Modulo.Insertar_Roles_Modulo(rol.id_rol, id_modulo, usuario_modi)
                    if (!roles_modulo) {
                        return { error: true, message: 'Error al insertar el rol del modulo' }
                    }
                } else {
                    //EDITAR ESTADO
                    const rol_editado = await this._Query_Modulo.Editar_Rol_Modulo(rol_buscado[0]?.id_rol_modulo, rol.id_estado)
                    if (rol_editado === 0) {
                        return { error: true, message: 'Error al editar el rol del modulo' }
                    }
                    const roles = await this._Query_Modulo.Obtener_Roles_Modulo(id_modulo)
                    if (roles.length === 0) { //SI NO HAY ROLES ACTIVOS DEBERÁ ACTIVAR EL ACTUAL
                        const rol_editado = await this._Query_Modulo.Editar_Rol_Modulo(rol_buscado[0]?.id_rol_modulo, 1)
                        if (!rol_editado) {
                            return { error: true, message: 'Error al editar el rol del modulo' }
                        }
                    }
                }
            }


            return modulo //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el modulo' } //!ERROR
        }
    }

    public async Cambiar_Estado_Modulo(id_modulo: number, estado: number): Promise<any> {
        const busqueda = await this._Query_Modulo.Buscar_Modulo_ID(id_modulo)
        if (busqueda.length <= 0) {
            return { error: true, message: 'No se ha encontrado el modulo' }
        }
        try {
            const res = await this._Query_Modulo.Cambiar_Estado_Modulo(id_modulo, estado)
            if (!res) {
                return { error: true, message: 'No se pudo cambiar el estado del modulo' }
            }
            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado del modulo' }
        }
    }
}