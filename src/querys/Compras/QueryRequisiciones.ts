import { _DB, pool } from "../../../config/db";
import {
    _FA_obtener_requisicion_enc,

    _aprobar_desaprobar_detalle,
    _buscar_detalle_id,
    _buscar_detalle_requisicion, _buscar_requisicion_consecutivo, _buscar_requisicion_id,
    _cambiar_estado_requisicion, _editar_requisicion_det, _editar_requisicion_enc,
    _editar_usuario_revision,
    _insertar_requisicion_det, _insertar_requisicion_enc
} from "../../dao/Compras/DaoRequisiciones";

import { Requisicion_Det, Requisicion_Enc } from '../../Interfaces/Compras/ICompras';

export default class QueryRequisiciones {
    public async Obtener_Requisiciones_Enc(estado: string, empresa: number, usuario: string): Promise<any> {
        const client = await pool.connect()

        try {
            let result = await _DB.func(_FA_obtener_requisicion_enc, [estado, empresa, usuario]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Detalle_Requisicion(id_requisicion: number) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_detalle_requisicion, [id_requisicion])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release()
        }
    }

    public async Buscar_Requisicion_Consecutivo(requisicion_request: Requisicion_Enc) {
        const client = await pool.connect()

        const { consecutivo } = requisicion_request

        try {
            let result = await client.query(_buscar_requisicion_consecutivo, [consecutivo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Requisicion_Enc(requisicion_request: Requisicion_Enc, usuario_creacion: string) {
        const client = await pool.connect()
        const { id_empresa, id_proceso, id_centro, id_tipo_producto, consecutivo, fecha_requisicion, comentarios, equipo } = requisicion_request

        try {
            let result = await client.query(
                _insertar_requisicion_enc,
                [
                    id_empresa, id_proceso, id_centro,
                    id_tipo_producto, consecutivo, fecha_requisicion,
                    comentarios, equipo, usuario_creacion
                ]
            );
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Requisicion_Det(requisicion_det_request: any, id_requisicion_enc: number, usuario_creacion: string) {
        const client = await pool.connect()
        const { id_producto, cantidad, justificacion } = requisicion_det_request

        try {
            let result = await client.query(
                _insertar_requisicion_det,
                [
                    id_requisicion_enc,
                    id_producto, cantidad, justificacion,
                    usuario_creacion
                ]
            );
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Requisicion_ID(id_requisicion: number) {
        const client = await pool.connect()

        try {
            let result: any = await client.query(_buscar_requisicion_id, [id_requisicion]);
            if (result.rows.length > 0) {
                let detalle = await client.query(_buscar_detalle_requisicion, [result.rows[0].id_requisicion])
                if (!detalle.rows) {
                    return
                }
                result.rows[0].det_requisicion = detalle.rows
            }

            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Requisicion_Enc(id_requisicion: number, requisicion_request: Requisicion_Enc) {
        const client = await pool.connect()
        const { id_empresa, id_proceso, id_centro, id_tipo_producto, consecutivo, comentarios, fecha_requisicion } = requisicion_request


        try {
            let result = await client.query(
                _editar_requisicion_enc,
                [
                    id_requisicion,
                    id_empresa, id_proceso, id_centro,
                    id_tipo_producto, consecutivo, comentarios,
                    fecha_requisicion
                ]
            );
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Editar_Requisicion_Det(requisicion_det_request: Requisicion_Det, usuario_modificacion: string) {
        const client = await pool.connect()
        const { id_detalle, id_producto, cantidad, justificacion, id_estado } = requisicion_det_request

        try {
            let result = await client.query(
                _editar_requisicion_det,
                [
                    id_detalle,
                    id_producto, cantidad, justificacion,
                    id_estado, usuario_modificacion
                ]
            );
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Detalle_ID(id_detalle: number) {
        const client = await pool.connect()

        try {
            let result: any = await client.query(_buscar_detalle_id, [id_detalle]);
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Cambiar_Estado_Requisicion(id_requisicion: number, estado: number) {
        const client = await pool.connect()
        try {
            let result = await client.query(_cambiar_estado_requisicion, [id_requisicion, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Aprobar_Desaprobar_Detalle(detalle: any) {
        const client = await pool.connect()
        const { id_detalle, id_estado } = detalle
        try {
            const result = await client.query(_aprobar_desaprobar_detalle, [id_detalle, id_estado])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Editar_Usuario_Revi_Requisicion(id_requisicion: any, usuario: string) {
        const client = await pool.connect()
        try {
            const result = await client.query(_editar_usuario_revision, [id_requisicion, usuario])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}