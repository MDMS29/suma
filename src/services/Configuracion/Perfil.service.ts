import { MessageError, ModulosUsuario } from "../../validations/Types"
import QueryPerfil from "../../querys/Configuracion/QuerysPerfil"
import { EstadosTablas } from "../../validations/utils";

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

    public async Obtener_Perfiles(estado: number): Promise<MessageError | any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Perfil.Obtener_Perfiles(estado)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado perfiles' } //!ERROR
            }

            for (let res of respuesta) {
                const modulos = await this._Query_Perfil.Modulos_Perfil(res.id_perfil)
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

    public async Obtener_Modulos_Perfil(perfiles: any): Promise<MessageError | any> {
        let Modulos = []

        try {
            for (let perfil of perfiles) {
                //INVOCAR LA FUNCION PARA OBTENER LOS MODULOS DE LOS PERFILES
                const respuesta = await this._Query_Perfil.Modulos_Perfil(perfil.id_perfil)
                Modulos.push(respuesta);
            }
            const result: Array<{ id_modulo: number; cod_modulo: string; nombre_modulo: string, permisos?: any }> = Modulos.reduce(this.ReduceModulos, []);

            if (result.length <= 0) {
                return { error: true, message: 'No se han podido cargar los modulos del perfil' } //!ERROR
            }

            //OBTENER LOS PERMISOS DE LOS MODULOS
            for (let modulo of result) {
                const permisos = await this._Query_Perfil.Permisos_Modulos_Perfil(modulo.id_modulo)
                modulo.permisos = permisos
            }
            return result

        } catch (error) {
            console.log(error)
            return { error: true, message: 'No se han podido cargar los modulos del perfil' } //!ERROR
        }
    }

    public async Insertar_Perfil(nombre_perfil: string, usuario_creacion: string, modulos: Omit<ModulosUsuario, 'menus' | 'permisos'>): Promise<MessageError | any> {
        try {
            // const Query_Perfil = new QueryPerfil()
            //VALIDAR SI EL PERFIL EXISTE
            const Bperfil: any = await this._Query_Perfil.Buscar_Perfil_Nombre(nombre_perfil)
            if (Bperfil?.length > 0) {
                return { error: true, message: 'Ya existe este perfil' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR PERFIL
            const respuesta = await this._Query_Perfil.Insertar_Perfil({ nombre_perfil, usuario_creacion })
            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el perfil' } //!ERROR
            }

            //COMPROBAR SI LOS MODULOS VIENEN TIPO ARRAY
            const modulosArray = Array.isArray(modulos) ? modulos : [modulos]
            for (let modulo of modulosArray) {
                //INVOCAR FUNCION PARA INSERTAR LOS MODULOS DEL PERFIL
                const modulos = await this._Query_Perfil.Insertar_Modulo_Perfil(respuesta[0].id_perfil, modulo.id_modulo)
                if (!modulos) {
                    return { error: true, message: 'Error al insetar los modulos del perfil' } //!ERROR
                }
            }

            //INVOCAR FUNCION PARA BUSCAR EL PERFIL POR ID
            const perfil = await this._Query_Perfil.Buscar_Perfil_ID(respuesta[0].id_perfil)
            if (!perfil) {
                return { error: true, message: 'No se ha encontrado el perfil' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR LOS MODULOS DEL PERFIL POR ID
            const Modulos_Perfil = await this._Query_Perfil.Modulos_Perfil(respuesta[0].id_perfil)
            perfil.modulos = Modulos_Perfil

            return perfil
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el perfil' } //!ERROR
        }
    }

    public async Editar_Perfil(id_perfil: number, nombre_perfil: string, usuario_creacion: string) {
        let nombre_editado: string
        try {
            const perfil_filtrado: any = await this._Query_Perfil.Buscar_Perfil_ID(id_perfil)

            const perfil_filtrado_nombre: any = await this._Query_Perfil.Buscar_Perfil_Nombre(nombre_perfil)
            if (perfil_filtrado_nombre?.length > 0 && perfil_filtrado_nombre[0].nombre_perfil !== perfil_filtrado.nombre_perfil) {
                return { error: true, message: 'Ya existe este perfil' } //!ERROR
            }


            const respuesta = await this._Query_Perfil.Buscar_Perfil_ID(id_perfil)
            if (respuesta?.nombre_perfil === nombre_perfil) {
                nombre_editado = respuesta.nombre_perfil
            } else {
                nombre_editado = nombre_perfil
            }

            const res = await this._Query_Perfil.Editar_Perfil({ id_perfil, nombre_editado, usuario_creacion })
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el perfil' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar perfil' } //!ERROR
        }
    }

    public async Editar_Modulos_Perfil(id_perfil: number, modulos: any) {
        for (let modulo of modulos) {
            const B_Modulo = await this._Query_Perfil.Buscar_Modulo_Perfil(id_perfil, modulo.id_modulo)
            if (!B_Modulo || B_Modulo?.length <= 0) {
                ///INSERTAR
                const Modulos_Insertar = await this._Query_Perfil.Insertar_Modulo_Perfil(id_perfil, modulo.id_modulo)
                if (!Modulos_Insertar) {
                    return { error: true, message: 'Error al insertar el nuevo modulo ' } //!ERROR
                }
            } else {
                //EDITAR MODULOS
                const Modulos_Editar = await this._Query_Perfil.Editar_Modulo_Perfil(id_perfil, modulo)
                if (!Modulos_Editar) {
                    return { error: true, message: 'Error al editar el modulo' } //!ERROR
                }

                // PREVENIR QUE EL PERFIL QUEDE SIN MODULOS
                //TODO: SOLUCIONAR.
                // const modulos = await this._Query_Perfil.Modulos_Perfil(id_perfil)
                // if (modulos.length == 0) {
                //     modulo.id_estado = 1
                //     const Modulos_Editar = await this._Query_Perfil.Editar_Modulo_Perfil(id_perfil, modulo)
                //     if (!Modulos_Editar) {
                //         return { error: true, message: 'Error al editar el modulo' } //!ERROR
                //     }
                // }
            }
        }

        return { error: false, message: 'Modulos del perfil editados con exito' } //!ERROR
    }

    public async Cambiar_Estado_Perfil(id_perfil: number, estado: number) {
        try {

            const perfil_editado = await this._Query_Perfil.Cambiar_Estado_Perfil(id_perfil, estado);
            if (!perfil_editado?.rowCount) {
                return { error: true, message: 'Error al editar el perfil' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado del perfil' }
        } catch (error) {
            console.log(error)
            return { error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el perfil' : 'Error al desactivar del perfil' } //!ERROR
        }
    }

    public async Buscar_Perfil(id_perfil: number): Promise<MessageError | any> {
        try {
            const perfil = await this._Query_Perfil.Buscar_Perfil_ID(id_perfil)
            if (!perfil?.id_perfil) {
                return { error: true, message: 'No se ha encontrado este perfil' } //!ERROR
            }
            // CARGAR LOS MODULOS DEL PERFIL
            const modulos = await this._Query_Perfil.Modulos_Perfil(id_perfil)
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