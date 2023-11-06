import { pool } from "../../../config/db";
import {
    _buscar_detalle_requisicion, _buscar_requisicion_consecutivo, _buscar_requisicion_id, _insertar_requisicion_det,
    _insertar_requisicion_enc, _obtener_requisicion_enc
} from "../../dao/Compras/DaoRequisiciones";

import {
    _buscar_empresa_id, _buscar_empresa_nit, _buscar_razon_social, _cambiar_estado_empresa,
    _editar_empresa, _insertar_empresa
} from "../../dao/Configuracion/DaoEmpresa";

import { Empresa, Requisicion_Enc } from "../../validations/Types";

export default class QueryRequisiciones {
    public async Obtener_Requisiciones_Enc(estado: number, empresa: number): Promise<any> {
        const client = await pool.connect()

        try {
            let result = await client.query(_obtener_requisicion_enc, [estado, empresa]);
            return result.rows
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
        const { id_empresa, id_proceso, id_centro, id_tipo_producto, consecutivo, fecha_requisicion, hora_requisicion, comentarios, equipo } = requisicion_request

        try {
            let result = await client.query(
                _insertar_requisicion_enc,
                [
                    id_empresa, id_proceso, id_centro,
                    id_tipo_producto, consecutivo, fecha_requisicion,
                    hora_requisicion, comentarios, equipo,
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

    public async Buscar_Nit(nit: string) {
        const client = await pool.connect()

        try {
            let result = await client.query(_buscar_empresa_nit, [nit]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Empresa(id_empresa: number, empresa_request: Empresa, usuario_modificacion: string) {
        const client = await pool.connect()
        const { nit, razon_social, direccion, telefono, correo } = empresa_request

        try {
            let result = await client.query(_editar_empresa, [id_empresa, nit, razon_social, telefono, direccion, correo, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Empresa(id_empresa: number, estado: number) {
        const client = await pool.connect()
        try {
            let result = await client.query(_cambiar_estado_empresa, [id_empresa, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}