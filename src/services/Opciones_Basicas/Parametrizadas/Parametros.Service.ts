import { Iva } from "../../../Interfaces/Opciones_Basicas/IOpcioBasic";
import QueryParametros from "../../../querys/Opciones_Basicas/Parametrizadas/QueryParametros";
import Querys from "../../../querys/Querys";

export class ParametrosService {
    private _Query_Parametros: QueryParametros;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Parametros = new QueryParametros();
        this._Querys = new Querys();
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

    public async Obtener_Formas_Pago(): Promise<any> {
        try {
            const respuesta = await this._Query_Parametros.Obtener_Formas_Pago()

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado las formas de pago' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las formas de pago' } //!ERROR
        }
    }

    public async Obtener_Ivas(empresa: string): Promise<any> {
        try {
            const respuesta = await this._Query_Parametros.Obtener_Ivas(empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado ivas en la empresa' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los ivas' } //!ERROR
        }
    }

    public async Insertar_Iva(iva_request: Iva, usuario_creacion:string) {

        const iva_filtrado_nombre = await this._Query_Parametros.Buscar_Iva_Nombre(iva_request.descripcion)
        if (iva_filtrado_nombre.length > 0) {
            return { error: true, message: 'Ya existe este nombre de iva' } //!ERROR

        }

        try {

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, iva_request.ip, iva_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${iva_request.ip}, UBICACIÓN: \n ${iva_request?.ubicacion}`)
            }

            const respuesta = await this._Query_Parametros.Insertar_Iva(iva_request)

            if (!respuesta) {
                return { error: true, message: 'Error al insertar el iva' } //!ERROR
            }

            iva_request.id_iva = respuesta[0].id_iva

            return iva_request
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al insertar el iva' } //!ERROR
        }
    }

    public async Buscar_Iva(iva_id: string): Promise<any> {
        try {
            const respuesta = await this._Query_Parametros.Buscar_Iva_ID(+iva_id)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado el iva' } //!ERROR
            }

            return respuesta[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al buscar el iva' } //!ERROR
        }
    }

    public async Editar_Iva(iva_id:number, iva_request: Iva, usuario_modi:string) {
        const iva_filtrado_nombre = await this._Query_Parametros.Buscar_Iva_Nombre(iva_request.descripcion)
        if (iva_filtrado_nombre.length > 0 && iva_id !== iva_filtrado_nombre[0].id_iva) {
            return { error: true, message: 'Ya existe este nombre de iva' } //!ERROR
        }

        try {
            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, iva_request.ip, iva_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${iva_request.ip}, UBICACIÓN: \n ${iva_request?.ubicacion}`)
            }

            const respuesta = await this._Query_Parametros.Editar_Iva(iva_id, iva_request)

            if (respuesta !== 1 ) {
                return { error: false, message: 'Error al editar el iva' } //!ERROR
            }

            const iva_editado = await this._Query_Parametros.Buscar_Iva_ID(iva_id)
            if (iva_editado.length <= 0) {
                return { error: false, message: 'No se ha encontrado el iva editado' } //!ERROR
            }
            return iva_editado[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al insertar el iva' } //!ERROR
        }
    }

}