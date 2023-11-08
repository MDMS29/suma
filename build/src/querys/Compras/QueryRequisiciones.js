"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../../config/db");
const DaoRequisiciones_1 = require("../../dao/Compras/DaoRequisiciones");
class QueryRequisiciones {
    Obtener_Requisiciones_Enc(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoRequisiciones_1._obtener_requisicion_enc, [estado, empresa]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Buscar_Detalle_Requisicion(id_requisicion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoRequisiciones_1._buscar_detalle_requisicion, [id_requisicion]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Buscar_Requisicion_Consecutivo(requisicion_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { consecutivo } = requisicion_request;
            try {
                let result = yield client.query(DaoRequisiciones_1._buscar_requisicion_consecutivo, [consecutivo]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Insertar_Requisicion_Enc(requisicion_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, id_proceso, id_centro, id_tipo_producto, consecutivo, fecha_requisicion, hora_requisicion, comentarios, equipo } = requisicion_request;
            try {
                let result = yield client.query(DaoRequisiciones_1._insertar_requisicion_enc, [
                    id_empresa, id_proceso, id_centro,
                    id_tipo_producto, consecutivo, fecha_requisicion,
                    hora_requisicion, comentarios, equipo,
                    usuario_creacion
                ]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Insertar_Requisicion_Det(requisicion_det_request, id_requisicion_enc, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_producto, cantidad, justificacion } = requisicion_det_request;
            try {
                let result = yield client.query(DaoRequisiciones_1._insertar_requisicion_det, [
                    id_requisicion_enc,
                    id_producto, cantidad, justificacion,
                    usuario_creacion
                ]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Buscar_Requisicion_ID(id_requisicion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoRequisiciones_1._buscar_requisicion_id, [id_requisicion]);
                if (result.rows.length > 0) {
                    let detalle = yield client.query(DaoRequisiciones_1._buscar_detalle_requisicion, [result.rows[0].id_requisicion]);
                    if (!detalle.rows) {
                        return;
                    }
                    result.rows[0].det_requisicion = detalle.rows;
                }
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Editar_Requisicion_Enc(id_requisicion, requisicion_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, id_proceso, id_centro, id_tipo_producto, consecutivo, comentarios, equipo } = requisicion_request;
            try {
                let result = yield client.query(DaoRequisiciones_1._editar_requisicion_enc, [
                    id_requisicion,
                    id_empresa, id_proceso, id_centro,
                    id_tipo_producto, consecutivo, comentarios,
                    equipo
                ]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Editar_Requisicion_Det(requisicion_det_request, usuario_modificacion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_detalle, id_producto, cantidad, justificacion, id_estado } = requisicion_det_request;
            try {
                let result = yield client.query(DaoRequisiciones_1._editar_requisicion_det, [
                    id_detalle,
                    id_producto, cantidad, justificacion,
                    id_estado, usuario_modificacion
                ]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Buscar_Detalle_ID(id_detalle) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoRequisiciones_1._buscar_requisicion_id, [id_detalle]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Cambiar_Estado_Requisicion(id_empresa, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoRequisiciones_1._cambiar_estado_requisicion, [id_empresa, estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.default = QueryRequisiciones;
