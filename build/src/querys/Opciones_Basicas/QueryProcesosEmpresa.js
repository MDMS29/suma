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
const db_1 = require("../../config/db");
const DaoProcesosEmpresa_1 = require("../../dao/Opciones_Basicas/DaoProcesosEmpresa");
class QueryProcesosEmpresa {
    Obtener_Procesos_Empresa(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoProcesosEmpresa_1._obtener_procesos_empresa, [empresa]);
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
    Insertar_Proceso_Empresa(proceso_empresa_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, codigo, proceso } = proceso_empresa_request;
            try {
                let result = yield client.query(DaoProcesosEmpresa_1._insertar_proceso_empresa, [id_empresa, codigo, proceso, usuario_creacion]);
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
    Buscar_Proceso_Codigo(proceso_empresa_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, codigo } = proceso_empresa_request;
            try {
                let result = yield client.query(DaoProcesosEmpresa_1._buscar_proceso_codigo, [id_empresa, codigo]);
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
    Buscar_Proceso_Nombre(proceso_empresa_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, proceso } = proceso_empresa_request;
            try {
                let result = yield client.query(DaoProcesosEmpresa_1._buscar_proceso_nombre, [id_empresa, proceso]);
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
    Buscar_Proceso_ID(id_proceso_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoProcesosEmpresa_1._buscar_proceso_id, [id_proceso_empresa]);
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
    Editar_Proceso_Empresa(id_proceso_empresa, proceso_empresa_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { codigo, proceso } = proceso_empresa_request;
            try {
                let result = yield client.query(DaoProcesosEmpresa_1._editar_proceso_empresa, [id_proceso_empresa, codigo, proceso]);
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
exports.default = QueryProcesosEmpresa;
