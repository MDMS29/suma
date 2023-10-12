import { MessageError, ModulosUsuario } from "../validations/Types"
import QueryPerfil from "../querys/QuerysPerfil"

export class PerfilService {
    private _Query_Perfil: QueryPerfil;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Perfil = new QueryPerfil();
    }

    private ReduceModulos(result: Array<{ id_modulo: number; cod_modulo: string; nombre_modulo: string, permisos?: any }>, modulos: Array<{ id_modulo: number; cod_modulo: string; nombre_modulo: string, permisos?: any }>) {
        modulos.forEach((modulo) => {
            const esModulo = result.find((existe) => existe.nombre_modulo === modulo.nombre_modulo);
            if (!esModulo) {
                result.push(modulo);
            }
        });
        return result;
    }

    public async ObtenerPerfiles(estado: number): Promise<MessageError | any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Perfil.ObtenerPerfiles(estado)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado perfiles' } //!ERROR
            }

            for (let res of respuesta) {
                const modulos = await this._Query_Perfil.ModulosPerfil(res.id_perfil)
                if (!modulos) {
                    return res.json({ error: true, message: 'No se han podido cargar los modulos del perfil' }) //!ERROR
                }
                res.modulos = modulos
            }
            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los modulos del perfil' } //!ERROR
        }
    }

    public async ObtenerModulosPerfil(perfiles: any): Promise<MessageError | any> {
        let Modulos = []

        try {
            for (let perfil of perfiles) {
                //INVOCAR LA FUNCION PARA OBTENER LOS MODULOS DE LOS PERFILES
                const respuesta = await this._Query_Perfil.ModulosPerfil(perfil.id_perfil)
                Modulos.push(respuesta);
            }
            const result: Array<{ id_modulo: number; cod_modulo: string; nombre_modulo: string, permisos?: any }> = Modulos.reduce(this.ReduceModulos, []);

            if (result.length <= 0) {
                return { error: true, message: 'No se han podido cargar los modulos del perfil' } //!ERROR
            }

            //OBTENER LOS PERMISOS DE LOS MODULOS
            for (let modulo of result) {
                const permisos = await this._Query_Perfil.PermisosModulosPerfil(modulo.id_modulo)
                modulo.permisos = permisos
            }
            return result

        } catch (error) {
            console.log(error)
            return { error: true, message: 'No se han podido cargar los modulos del perfil' } //!ERROR
        }
    }

    public async InsertarPerfil(nombre_perfil: string, usuario_creacion: string, modulos: Omit<ModulosUsuario, 'menus' | 'permisos'>): Promise<MessageError | any> {
        try {
            // const Query_Perfil = new QueryPerfil()
            //VALIDAR SI EL PERFIL EXISTE
            const Bperfil: any = await this._Query_Perfil.BuscarPerfilNombre(nombre_perfil)
            if (Bperfil?.length > 0) {
                return { error: true, message: 'Ya existe este perfil' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR PERFIL
            const respuesta = await this._Query_Perfil.InsertarPerfil({ nombre_perfil, usuario_creacion })
            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el perfil' } //!ERROR
            }

            //COMPROBAR SI LOS MODULOS VIENEN TIPO ARRAY
            const modulosArray = Array.isArray(modulos) ? modulos : [modulos]
            for (let modulo of modulosArray) {
                //INVOCAR FUNCION PARA INSERTAR LOS MODULOS DEL PERFIL
                const modulos = await this._Query_Perfil.InsertarModuloPerfil(respuesta[0].id_perfil, modulo.id_modulo)
                if (!modulos) {
                    return { error: true, message: 'Error al insetar los modulos del perfil' } //!ERROR
                }
            }

            //INVOCAR FUNCION PARA BUSCAR EL PERFIL POR ID
            const perfil = await this._Query_Perfil.BuscarPerfilID(respuesta[0].id_perfil)
            if (!perfil) {
                return { error: true, message: 'No se ha encontrado el perfil' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR LOS MODULOS DEL PERFIL POR ID
            const modulosPerfil = await this._Query_Perfil.ModulosPerfil(respuesta[0].id_perfil)
            perfil.modulos = modulosPerfil

            return perfil
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el perfil' } //!ERROR
        }
    }

    public async EditarPerfil(id_perfil: number, nombre_perfil: string, usuario_creacion: string) {
        let nombre_editado: string
        try {
            const respuesta = await this._Query_Perfil.BuscarPerfilID(id_perfil)
            if (respuesta?.nombre_perfil === nombre_perfil) {
                nombre_editado = respuesta.nombre_perfil
            } else {
                nombre_editado = nombre_perfil
            }

            const res = await this._Query_Perfil.EditarPerfil({ id_perfil, nombre_editado, usuario_creacion })
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el perfil' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar perfil' } //!ERROR
        }
    }

    public async EditarModulosPerfil(id_perfil: number, modulos: any) {
        for (let modulo of modulos) {
            const B_Modulo = await this._Query_Perfil.BuscarModuloPerfil(id_perfil, modulo.id_modulo)
            if (!B_Modulo || B_Modulo?.length <= 0) {
                ///INSERTAR
                const Modulos_Insertar = await this._Query_Perfil.InsertarModuloPerfil(id_perfil, modulo.id_modulo)
                if (!Modulos_Insertar) {
                    return { error: true, message: 'Error al insertar el nuevo modulo ' } //!ERROR
                }
            }
            //EDITAR
            const Modulos_Editar = await this._Query_Perfil.EditarModuloPerfil(id_perfil, modulo)
            if (!Modulos_Editar) {
                return { error: true, message: 'Error al editar el modulo' } //!ERROR
            }
            const AllModulos = await this._Query_Perfil.ModulosPerfil(id_perfil)
            if (AllModulos.length <= 0) {
                modulo.id_estado = 1 //CAMBIAR EL ESTADO DEL MODULO A "ACTIVO" PARA NO DEJAR EL PERFIL CON UN SOLO MODULO
                const Modulos_Editar = await this._Query_Perfil.EditarModuloPerfil(id_perfil, modulo)
                if (!Modulos_Editar) {
                    return { error: true, message: 'Error al editar el modulo' } //!ERROR
                }
                return { error: true, message: 'El perfil debe tener al menos un perfil' } //!ERROR
            }
        }

        return { error: false, message: 'Modulos del perfil editados con exito' } //!ERROR
    }

    public async CambiarEstadoPerfil(id_perfil: number, estado: number) {
        try {

            const perfil_editado = await this._Query_Perfil.CambiarEstadoPerfil(id_perfil, estado);
            if (!perfil_editado?.rowCount) {
                return { error: true, message: 'Error al editar el perfil' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado del perfil' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el perfil' } //!ERROR
        }
    }

    public async BuscarPerfil(id_perfil: number): Promise<MessageError | any> {
        try {
            const perfil = await this._Query_Perfil.BuscarPerfilID(id_perfil)
            if (!perfil?.id_perfil) {
                return { error: true, message: 'No se ha encontrado este perfil' } //!ERROR
            }
            // CARGAR LOS MODULOS DEL PERFIL
            const modulos = await this._Query_Perfil.ModulosPerfil(id_perfil)
            if (!modulos) {
                return { error: true, message: 'No se han podido cargar los modulos del perfil' } //!ERROR
            }
            perfil.modulos = modulos
            return perfil
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el perfil' }
        }
    }
}