import { Tipos_Movimientos } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'
import Querys from "../../querys/Querys";
import QueryTiposMovimientos from "../../querys/Opciones_Basicas/QueryTiposMovimientos";

export class TiposMovimientosService {
    private _query_tipo_mov: QueryTiposMovimientos;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._query_tipo_mov = new QueryTiposMovimientos();
        this._Querys = new Querys();
    }

    public async Obtener_Tipos_Movimientos(id_empresa: number): Promise<any> {
        try {
            const respuesta = await this._query_tipo_mov.Obtener_Tipos_Movimientos(id_empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado tipos de movimientos' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los tipos de movimientos' } //!ERROR
        }
    }

    public async Insertar_Tipo_Movimiento(tipos_movimiento_request: Tipos_Movimientos, usuario_creacion: string): Promise<any> {
        try {
            //VALIDAR SI EL MENU EXISTE
            const unidad_filtrada: any = await this._query_tipo_mov.Buscar_Tipo_Movimiento(tipos_movimiento_request)
            if (unidad_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe este tipo de movimiento' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, tipos_movimiento_request.ip, tipos_movimiento_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${tipos_movimiento_request.ip}, UBICACIÓN: \n ${tipos_movimiento_request?.ubicacion}`)
            }

            //INVOCAR FUNCION PARA INSERTAR TIPO DE MOVIMEINTO
            const respuesta = await this._query_tipo_mov.Insertar_Tipo_Movimiento(tipos_movimiento_request)

            if (respuesta.length <= 0) {
                return { error: true, message: 'No se ha podido crear el tipo de movimiento' } //!ERROR
            }

            const tipo_movimiento = await this._query_tipo_mov.Buscar_Tipo_Movimiento_ID(respuesta[0].id_tipo_mov)
            if (tipo_movimiento.length <= 0) {
                return { error: true, message: 'No se ha encontrado el tipo de movimiento' } //!ERROR
            }

            return tipo_movimiento[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el tipo de movimiento' } //!ERROR
        }
    }

    public async Buscar_Tipo_Movimiento_ID(id_tipo_mov: number): Promise<any> {
        try {
            const tipo_movimiento = await this._query_tipo_mov.Buscar_Tipo_Movimiento_ID(id_tipo_mov)
            if (tipo_movimiento.length <= 0) {
                return { error: true, message: 'No se ha encontrado el tipo de movimiento' } //!ERROR
            }
            return tipo_movimiento[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el tipo de movimiento' }
        }
    }

    public async Editar_Tipo_Movimiento(id_tipo_mov: number, tipos_producto_request: Tipos_Movimientos, usuario_modi: string) {
        try {
            const tipo_mov_desc = await this._query_tipo_mov.Buscar_Tipo_Movimiento(tipos_producto_request)

            const exisTipoMov = tipo_mov_desc.some((tipo: Tipos_Movimientos) => tipo.id_tipo_mov !== id_tipo_mov)

            if (tipo_mov_desc?.length > 0 &&  exisTipoMov) {
                return { error: true, message: 'Ya existe este tipo de movimiento' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, tipos_producto_request.ip, tipos_producto_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${tipos_producto_request.ip}, UBICACIÓN: \n ${tipos_producto_request?.ubicacion}`)
            }

            const res = await this._query_tipo_mov.Editar_Tipo_Movimiento(id_tipo_mov, tipos_producto_request)
            if (res == 0) {
                return { error: true, message: 'Error al actualizar el tipo de movimiento' } //!ERROR
            }

            return tipos_producto_request
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el tipo de movimiento' } //!ERROR
        }
    }
}