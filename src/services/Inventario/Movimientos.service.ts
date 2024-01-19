import Querys from "../../querys/Querys";
import QueryMovimientosAlmacen from "../../querys/Inventario/QueryMovimientos";
import { Movimientos } from '../../Interfaces/Inventario/IInventario';

export default class MovimientosAlmacenService {
    private _Query_Mov: QueryMovimientosAlmacen;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Mov = new QueryMovimientosAlmacen();
        this._Querys = new Querys();
    }

    public async Obtener_Movimiento_Almacen(empresa: number, estado: number): Promise<any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Mov.Obtener_Movimiento_Almacen(empresa, estado)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado movimientos en el almacen' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los movimientos de la empresa' } //!ERROR
        }
    }

    public async Insertar_Movimiento(movimiento_request: Movimientos, usuario_creacion: any) {
        const { id_usuario, usuario } = usuario_creacion

        try {
            // LOS MOVIMIENTOS NO TENDRAN VALIDACIONES DE SI EXISTEN O NO, PORQUE PUEDEN SER IGUALES

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, movimiento_request.ip, movimiento_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${movimiento_request.ip}, UBICACIÓN: \n ${movimiento_request?.ubicacion}`)
            }

            const respuesta_insert = await this._Query_Mov.Insertar_Movimiento(movimiento_request, id_usuario)
            if (respuesta_insert.length <= 0) {
                return { error: true, message: 'No se ha podido crear el movimiento de almacen' } //!ERROR
            }

            for (let detalle of movimiento_request.detalle_movi) {
                const log = await this._Querys.Insertar_Log_Auditoria(usuario, movimiento_request.ip, movimiento_request?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${movimiento_request.ip}, UBICACIÓN: \n ${movimiento_request?.ubicacion}`)
                }
                // INSERTAR DETALLES DEL MOVIMIENTO
                const respuesta = await this._Query_Mov.Insertar_Detalle_Movimiento(detalle, respuesta_insert[0].id_movimiento)
                if (respuesta.length <= 0) {
                    return { error: true, message: 'Error al insertar el detalle del movimiento' } //!ERROR
                }
            }

            const movimiento = await this._Query_Mov.Buscar_Movimiento_ID(respuesta_insert[0].id_movimiento)
            if (!movimiento) {
                return { error: true, message: 'No se ha encontrado el movimiento' } //!ERROR
            }

            return movimiento[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el movimiento' } //!ERROR
        }
    }

    public async Buscar_Movimiento(movimiento_id: number): Promise<any> {
        try {
            const movimiento: Movimientos[] = await this._Query_Mov.Buscar_Movimiento_ID(movimiento_id)
            if (!movimiento) {
                return { error: true, message: 'No se ha encontrado el movimiento' } //!ERROR
            }

            const detalles_movimientos = await this._Query_Mov.Buscar_Detalle_Movimiento(movimiento_id)
            if (detalles_movimientos.length <= 0) {
                return { error: true, message: 'Este movimiento no tiene detalles' } //!ERROR
            }

            movimiento[0].detalle_movi = detalles_movimientos

            return movimiento[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el movimiento' }
        }
    }

    public async Editar_Movimiento(movimiento_id: number, movimiento_request: Movimientos, usuario: string) {
        try {
            const empresa: any = await this._Query_Mov.Buscar_Movimiento_ID(movimiento_id)
            if (empresa.length === 0) {
                return { error: true, message: 'No existe este movimiento' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, movimiento_request.ip, movimiento_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${movimiento_request.ip}, UBICACIÓN: \n ${movimiento_request?.ubicacion}`)
            }

            const res = await this._Query_Mov.Editar_Enc_Movimiento(movimiento_id, movimiento_request)
            if (res == 0) {
                return { error: true, message: 'Error al actualizar el movimiento' } //!ERROR
            }

            const detalles_movimiento = await this._Query_Mov.Buscar_Detalle_Movimiento(movimiento_id)

            for (let detalle of movimiento_request.detalle_movi) {
                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log = await this._Querys.Insertar_Log_Auditoria(usuario, movimiento_request.ip, movimiento_request?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${movimiento_request.ip}, UBICACIÓN: \n ${movimiento_request?.ubicacion}`)
                }

                // BUSCAR EL DETALLE DEL MOVIMIENTO 
                let esDetalle = detalles_movimiento.some(det_mov => det_mov.id_detalle == detalle.id_detalle)
                if (esDetalle) {
                    // SI EL DETALLE EXISTE LO EDITARA
                    const res = await this._Query_Mov.Editar_Detalle_Movimiento(detalle.id_detalle, movimiento_id, detalle)
                    if (res == 0) {
                        return { error: true, message: 'Error al actualizar el detalle del movimiento' } //!ERROR
                    }
                } else {
                    // SI NO EXISTE LO INSERTA
                    const respuesta = await this._Query_Mov.Insertar_Detalle_Movimiento(detalle, movimiento_id)
                    if (respuesta.length <= 0) {
                        return { error: true, message: 'Error al insertar el detalle del movimiento' } //!ERROR
                    }
                }

            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el movimiento' } //!ERROR
        }
    }

    public async Cambiar_Estado_Empresa(id_empresa: number, estado: number, info_user: any, usuario: string) {
        try {

            const log = await this._Querys.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
            }


            const empresa_editada = await this._Query_Mov.Cambiar_Estado_Empresa(id_empresa, estado);
            if (!empresa_editada?.rowCount) {
                return { error: true, message: 'Error al cambiar el estado de la empresa' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado de la empresa' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado de la empresa' } //!ERROR
        }
    }
}