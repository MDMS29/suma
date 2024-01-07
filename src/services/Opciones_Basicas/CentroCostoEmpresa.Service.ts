import QueryCentroCostoEmpresa from "../../querys/Opciones_Basicas/QueryCentroCostoEmpresa";
import { Centro_Costo } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'
import Querys from "../../querys/Querys";

export class CentroCostoEmpresaService {
    private _Query_Centro_Costo_Empresa: QueryCentroCostoEmpresa;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Centro_Costo_Empresa = new QueryCentroCostoEmpresa();
        this._Querys = new Querys();
    }

    public async Obtener_Centros_Costo_Empresa(estado: number, empresa: number, tipo: string, valor: number): Promise<any> {
        const TIPOS_CONSULTA = {
            proceso: 'proceso'
        }
        try {
            let respuesta: any
            if (TIPOS_CONSULTA.proceso === tipo) {
                respuesta = await this._Query_Centro_Costo_Empresa.Obtener_Centros_Costo_Filtro(empresa, tipo, valor)
                if (respuesta?.length <= 0) {
                    return { error: false, message: 'No se han encontrado procesos en la empresa' } //!ERROR
                }
            } else {

                respuesta = await this._Query_Centro_Costo_Empresa.Obtener_Centros_Costo_Empresa(estado, empresa)

                if (respuesta?.length <= 0) {
                    return { error: false, message: 'No se han encontrado procesos en la empresa' } //!ERROR
                }
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los procesos de la empresa' } //!ERROR
        }
    }

    public async Insertar_Centro_Costo_Empresa(centro_costo_request: Centro_Costo, usuario_creacion: string) {
        try {

            const proceso_filtrado_codigo: any = await this._Query_Centro_Costo_Empresa.Buscar_Centro_Codigo(centro_costo_request)
            if (proceso_filtrado_codigo?.length > 0) {
                return { error: true, message: 'Ya existe este código' } //!ERROR
            }
            const centro_filtrado_nombre: any = await this._Query_Centro_Costo_Empresa.Buscar_Centro_Nombre(centro_costo_request)
            if (centro_filtrado_nombre?.length > 0) {
                return { error: true, message: 'Ya existe este nombre' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, centro_costo_request.ip, centro_costo_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${centro_costo_request.ip}, UBICACIÓN: \n ${centro_costo_request?.ubicacion}`)
            }

            const respuesta = await this._Query_Centro_Costo_Empresa.Insertar_Centro_Costo(centro_costo_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el centro' } //!ERROR
            }

            const centro_empresa = await this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(respuesta[0].id_centro)
            if (!centro_empresa) {
                return { error: true, message: 'No se ha encontrado el centro' } //!ERROR
            }

            return centro_empresa[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el proceso' } //!ERROR
        }
    }

    public async Buscar_Centro_Costo(id_centro_costo: number): Promise<any> {
        try {
            const centro = await this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(id_centro_costo)
            if (!centro) {
                return { error: true, message: 'No se ha encontrado el centro de costo' } //!ERROR
            }
            return centro[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el centro de costo' }
        }
    }

    public async Editar_Centro_Costo(id_proceso_empresa: number, centro_costo_request: Centro_Costo, usuario: string) {
        try {
            const respuesta: any = await this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(id_proceso_empresa)

            const proceso_filtrado_codigo: any = await this._Query_Centro_Costo_Empresa.Buscar_Centro_Codigo(centro_costo_request)
            if (proceso_filtrado_codigo?.length > 0 && proceso_filtrado_codigo[0].codigo !== respuesta[0].codigo && centro_costo_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe este codigo de centro' } //!ERROR
            }

            const centro_filtrado_nombre: any = await this._Query_Centro_Costo_Empresa.Buscar_Centro_Nombre(centro_costo_request)
            if (centro_filtrado_nombre?.length > 0 && centro_filtrado_nombre[0].centro_costo !== respuesta[0].centro_costo && centro_costo_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe este nombre de centro' } //!ERROR
            }

            //ACTUALIZAR INFORMACION
            centro_costo_request.codigo = respuesta[0]?.codigo === centro_costo_request.codigo ? respuesta[0]?.codigo : centro_costo_request.codigo
            centro_costo_request.centro_costo = respuesta[0]?.centro_costo === centro_costo_request.centro_costo ? respuesta[0]?.centro_costo : centro_costo_request.centro_costo
            centro_costo_request.id_proceso = respuesta[0]?.id_proceso === centro_costo_request.id_proceso ? respuesta[0]?.id_proceso : centro_costo_request.id_proceso
            centro_costo_request.correo_responsable = respuesta[0]?.correo_responsable === centro_costo_request.correo_responsable ? respuesta[0]?.correo_responsable : centro_costo_request.correo_responsable

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, centro_costo_request.ip, centro_costo_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${centro_costo_request.ip}, UBICACIÓN: \n ${centro_costo_request?.ubicacion}`)
            }

            const res = await this._Query_Centro_Costo_Empresa.Editar_Centro_Costo(id_proceso_empresa, centro_costo_request)

            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el centro' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el centro' } //!ERROR
        }
    }

    public async Cambiar_Estado_Centro(id_centro_costo: number, estado: number, info_user: any, usuario:string) {
        try {
            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
            }

            const familia_filtrada: any = await this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(id_centro_costo)
            if (familia_filtrada?.length <= 0) {
                return { error: true, message: 'No se ha encontrado este centro de costo' } //!ERROR
            }

            const familia_cambiada = await this._Query_Centro_Costo_Empresa.Cambiar_Estado_Centro(id_centro_costo, estado)
            if (familia_cambiada?.rowCount != 1) {
                return { error: true, message: 'Error al cambiar el estado del centro' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado del centro' } //!ERROR
        }
    }
}