import QueryProcesosEmpresa from "../../querys/Opciones_Basicas/QueryProcesosEmpresa";
import { Procesos_Empresa } from "../../validations/Types";

export class ProcesosEmpresaService {
    private _Query_Proceso_Empresa: QueryProcesosEmpresa;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Proceso_Empresa = new QueryProcesosEmpresa();
    }

    public async Obtener_Procesos_Empresa(empresa: number): Promise<any> {
        try {
            const respuesta = await this._Query_Proceso_Empresa.Obtener_Procesos_Empresa(empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado procesos en la empresa' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los procesos de la empresa' } //!ERROR
        }
    }

    public async Insertar_Procesos_Empresa(proceso_empresa_request: Procesos_Empresa, usuario_creacion: string) {
        try {

            const proceso_filtrado_codigo: any = await this._Query_Proceso_Empresa.Buscar_Proceso_Codigo(proceso_empresa_request)
            if (proceso_filtrado_codigo?.length > 0) {
                return { error: true, message: 'Ya existe este codigo de proceso' } //!ERROR
            }
            const proceso_filtrado_nombre: any = await this._Query_Proceso_Empresa.Buscar_Proceso_Nombre(proceso_empresa_request)
            if (proceso_filtrado_nombre?.length > 0) {
                return { error: true, message: 'Ya existe este nombre de proceso' } //!ERROR
            }

            const respuesta = await this._Query_Proceso_Empresa.Insertar_Proceso_Empresa(proceso_empresa_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el proceso' } //!ERROR
            }

            const proceso_empresa = await this._Query_Proceso_Empresa.Buscar_Proceso_ID(respuesta[0].id_proceso)
            if (!proceso_empresa) {
                return { error: true, message: 'No se ha encontrado el proceso' } //!ERROR
            }

            return proceso_empresa[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el proceso' } //!ERROR
        }
    }

    public async Buscar_Proceso_Empresa(id_proceso_empresa: number): Promise<any> {
        try {
            const proceso_empresa = await this._Query_Proceso_Empresa.Buscar_Proceso_ID(id_proceso_empresa)
            if (!proceso_empresa) {
                return { error: true, message: 'No se ha encontrado el proceso' } //!ERROR
            }
            return proceso_empresa[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el proceso' }
        }
    }

    public async Editar_Proceso_Empresa(id_proceso_empresa: number, proceso_empresa_request: Procesos_Empresa) {
        try {
            const respuesta: any = await this._Query_Proceso_Empresa.Buscar_Proceso_ID(id_proceso_empresa)

            const proceso_filtrado_codigo: any = await this._Query_Proceso_Empresa.Buscar_Proceso_Codigo(proceso_empresa_request)
            if (proceso_filtrado_codigo?.length > 0 && proceso_filtrado_codigo[0].codigo !== respuesta[0].codigo && proceso_empresa_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe este codigo de proceso' } //!ERROR
            }

            const proceso: any = await this._Query_Proceso_Empresa.Buscar_Proceso_Nombre(proceso_empresa_request)
            if (proceso?.length > 0 && proceso[0].proceso !== respuesta[0].proceso && proceso_empresa_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe este nombre de proceso' } //!ERROR
            }

            proceso_empresa_request.codigo = respuesta[0]?.codigo === proceso_empresa_request.codigo ? respuesta[0]?.codigo : proceso_empresa_request.codigo
            proceso_empresa_request.proceso = respuesta[0]?.proceso === proceso_empresa_request.proceso ? respuesta[0]?.proceso : proceso_empresa_request.proceso

            const res = await this._Query_Proceso_Empresa.Editar_Proceso_Empresa(id_proceso_empresa, proceso_empresa_request)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el proceso' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el proceso' } //!ERROR
        }
    }
}