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
const DaoCentroCostoEmpresa_1 = require("../../dao/Opciones_Basicas/DaoCentroCostoEmpresa");
class QueryCentroCostoEmpresa {
    Obtener_Centros_Costo_Empresa(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._obtener_centros_costos_empresa, [estado, empresa]);
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
    Obtener_Centros_Costo_Filtro(empresa, tipo, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield db_1._DB.func(DaoCentroCostoEmpresa_1._FA_obtener_centros_filtro, [empresa, tipo, +valor]);
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
    Insertar_Centro_Costo(centro_costo_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, id_proceso, codigo, consecutivo, centro_costo, correo_responsable } = centro_costo_request;
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._insertar_centro_costo, [id_empresa, id_proceso, codigo, centro_costo, correo_responsable, usuario_creacion, consecutivo]);
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
    Buscar_Centro_Codigo(centro_costo_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, codigo } = centro_costo_request;
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._buscar_centro_codigo, [id_empresa, codigo]);
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
    Buscar_Centro_Nombre(centro_costo_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, centro_costo } = centro_costo_request;
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._buscar_centro_nombre, [id_empresa, centro_costo]);
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
    Buscar_Responsable_Centro(centro_costo_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, correo_responsable } = centro_costo_request;
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._buscar_responsable_centro, [id_empresa, correo_responsable]);
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
    Buscar_Centro_ID(id_centro_costo) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._buscar_centro_id, [id_centro_costo]);
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
    Editar_Centro_Costo(id_centro_costo, centro_costo_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                const { id_proceso, codigo, centro_costo, correo_responsable, consecutivo } = centro_costo_request;
                let result = yield client.query(DaoCentroCostoEmpresa_1._editar_centro_costo, [id_centro_costo, id_proceso, codigo, centro_costo, correo_responsable, consecutivo]);
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
    Cambiar_Estado_Centro(id_centro_costo, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoCentroCostoEmpresa_1._cambiar_estado_centro, [id_centro_costo, estado]);
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
exports.default = QueryCentroCostoEmpresa;
