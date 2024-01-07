import QueryUnidadesMedida from "../../querys/Opciones_Basicas/QueryUnidadesMedida";
import { Unidad_Medida } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'
import Querys from "../../querys/Querys";

export class UnidadesMedidaService {
    private _Query_Unidades_Medida: QueryUnidadesMedida;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Unidades_Medida = new QueryUnidadesMedida();
        this._Querys = new Querys();
    }

    public async Obtener_Unidades_Medida(estado: number, id_empresa: number): Promise<any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Unidades_Medida.Obtener_Unidades_Medida(estado, id_empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado las unidades de medida' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las unidades de medida' } //!ERROR
        }
    }

    public async Insertar_Unidad_Medida(unidad_request: Unidad_Medida, usuario_creacion: string) {
        try {
            //VALIDAR SI EL MENU EXISTE
            const unidad_filtrada: any = await this._Query_Unidades_Medida.Buscar_Unidad_Medida(unidad_request)
            if (unidad_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe esta unidad de medida' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, unidad_request.ip, unidad_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${unidad_request.ip}, UBICACIÓN: \n ${unidad_request?.ubicacion}`)
            }

            //INVOCAR FUNCION PARA INSERTAR MENU
            const respuesta = await this._Query_Unidades_Medida.Insertar_Unidad_Medida(unidad_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear la unidad de medida' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
            const unidad_medida = await this._Query_Unidades_Medida.Buscar_Unidad_Medida_ID(respuesta[0].id_unidad)
            if (!unidad_medida) {
                return { error: true, message: 'No se ha encontrado la unidad de medida' } //!ERROR
            }

            return unidad_medida[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear la unidad de medida' } //!ERROR
        }
    }

    public async Buscar_Unidad_Medida(id_unidad: number): Promise<any> {
        try {
            const unidad_medida = await this._Query_Unidades_Medida.Buscar_Unidad_Medida_ID(id_unidad)
            if (!unidad_medida) {
                return { error: true, message: 'No se ha encontrado la unidad de medida' } //!ERROR
            }
            return unidad_medida[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la unidad de medida' }
        }
    }

    public async Editar_Unidad_Medida(id_unidad: number, unidad_medida_request: Unidad_Medida, usuario_modi:string) {
        try {
            const respuesta: any = await this._Query_Unidades_Medida.Buscar_Unidad_Medida_ID(id_unidad)

            const unidad_filtrada: any = await this._Query_Unidades_Medida.Buscar_Unidad_Medida(unidad_medida_request)
            if (unidad_filtrada?.length > 0 && unidad_filtrada[0].unidad !== respuesta[0].unidad) {
                return { error: true, message: 'Ya existe esta unidad de medida' } //!ERROR
            }

            unidad_medida_request.unidad = respuesta[0]?.unidad === unidad_medida_request.unidad ? respuesta[0]?.unidad : unidad_medida_request.unidad

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, unidad_medida_request.ip, unidad_medida_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${unidad_medida_request.ip}, UBICACIÓN: \n ${unidad_medida_request?.ubicacion}`)
            }

            const res = await this._Query_Unidades_Medida.Editar_Unidad_Medida(id_unidad, unidad_medida_request)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar la unidad de medida' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar la unidad de medida' } //!ERROR
        }
    }
}