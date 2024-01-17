import { Bodega, MOVBodega } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'
import Querys from "../../querys/Querys";
import QueryBodegas from '../../querys/Opciones_Basicas/QueryBodegas';

export class BodegasService {
    private _query_bodegas: QueryBodegas;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._query_bodegas = new QueryBodegas();
        this._Querys = new Querys();
    }

    public async Obtener_Bodegas(id_empresa: number, estado_id: number): Promise<any> {
        try {
            const respuesta = await this._query_bodegas.Obtener_Bodegas(id_empresa, estado_id)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado bodegas' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las bodegas' } //!ERROR
        }
    }

    public async Insertar_Bodega(bodega_request: Bodega, usuario_creacion: string): Promise<any> {
        try {
            //VALIDAR SI EL MENU EXISTE
            const bodega_filtrada: any = await this._query_bodegas.Buscar_Bodega(bodega_request)
            if (bodega_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe esta bodega' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, bodega_request.ip, bodega_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${bodega_request.ip}, UBICACIÓN: \n ${bodega_request?.ubicacion}`)
            }

            //INVOCAR FUNCION PARA INSERTAR BODEGA
            const respuesta = await this._query_bodegas.Insertar_Bodega(bodega_request)
            if (respuesta.length <= 0) {
                return { error: true, message: 'Error al insertar la bodega' } //!ERROR
            }

            for (let mov_bodega of bodega_request.mov_bodega) {
                const respuesta_movi = await this._query_bodegas.Insertar_Movimiento_Bodega(respuesta[0].id_bodega, mov_bodega)
                if (respuesta_movi.length <= 0) {
                    return { error: true, message: 'Error al insertar el movimiento de la bodega' } //!ERROR
                }
            }

            const bodega = await this._query_bodegas.Buscar_Bodega_ID(respuesta[0].id_bodega)
            if (bodega.length <= 0) {
                return { error: true, message: 'No se ha encontrado la bodega' } //!ERROR
            }

            return bodega[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear la bodega' } //!ERROR
        }
    }

    public async Buscar_Bodega_Mov(bodega_id: number): Promise<any> {
        try {
            const [tipo_movimiento] = await this._query_bodegas.Buscar_Bodega_ID(bodega_id)
            if (!tipo_movimiento) {
                return { error: true, message: 'No se ha encontrado la bodega' } //!ERROR
            }

            tipo_movimiento.mov_bodega = await this._query_bodegas.Buscar_Movimientos_Bodega(bodega_id)

            return tipo_movimiento
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la bodega' }
        }
    }

    public async Buscar_Bodega_ID(bodega_id: number): Promise<any> {
        try {
            const tipo_movimiento = await this._query_bodegas.Buscar_Bodega_ID(bodega_id)
            if (tipo_movimiento.length <= 0) {
                return { error: true, message: 'No se ha encontrado la bodega' } //!ERROR
            }
            return tipo_movimiento[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la bodega' }
        }
    }

    public async Editar_Bodega(bodega_id: number, bodega_request: Bodega, usuario_modi: string) {
        try {
            const bodegas_filtradas = await this._query_bodegas.Buscar_Bodega(bodega_request)

            const exisBodega = bodegas_filtradas.some((bodega: Bodega) => bodega.id_bodega !== bodega_id)

            if (bodegas_filtradas?.length > 0 && exisBodega) {
                return { error: true, message: 'Ya existe esta bodega' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, bodega_request.ip, bodega_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${bodega_request.ip}, UBICACIÓN: \n ${bodega_request?.ubicacion}`)
            }

            const res = await this._query_bodegas.Editar_Bodega(bodega_id, bodega_request)
            if (res == 0) {
                return { error: true, message: 'Error al actualizar el tipo de movimiento' } //!ERROR
            }

            const movimientos = await this._query_bodegas.Buscar_Movimientos_Bodega(bodega_id)
            console.log("🚀 ~ BodegasService ~ Editar_Bodega ~ movimientos:", movimientos)

            // EDITAR LOS MOVIMIENTOS DE LA BODEGA
            for (let mov_bodega of bodega_request.mov_bodega) {
                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, bodega_request.ip, bodega_request?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${bodega_request.ip}, UBICACIÓN: \n ${bodega_request?.ubicacion}`)
                }

                // BUSCAR EL MOVIMIENTO
                const esMovimiento = movimientos.some((mov: MOVBodega) => mov.id_tipo_mov === mov_bodega.id_tipo_mov)
                console.log("🚀 ~ BodegasService ~ Editar_Bodega ~ esMovimiento:", esMovimiento)
                if (esMovimiento) {
                    // EDITAR MOVIMIENTO EN CASO DE EXISTIR
                    const respuesta_movi = await this._query_bodegas.Editar_Movimiento_Bodega(mov_bodega)
                    if (respuesta_movi <= 0) {
                        return { error: true, message: 'Error al editar el movimiento de la bodega' } //!ERROR
                    }

                } else {
                    // GUARDAR MOVIMIENTO SI NO EXISTE
                    const respuesta_movi = await this._query_bodegas.Insertar_Movimiento_Bodega(bodega_id, mov_bodega)
                    if (respuesta_movi.length <= 0) {
                        return { error: true, message: 'Error al insertar el movimiento de la bodega' } //!ERROR
                    }
                }

            }

            return bodega_request
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el tipo de movimiento' } //!ERROR
        }
    }
}