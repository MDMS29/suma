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
const DaoUnidadesMedida_1 = require("../../dao/Opciones_Basicas/DaoUnidadesMedida");
class QueryUnidadesMedida {
    Obtener_Unidades_Medida(_, id_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoUnidadesMedida_1._obtener_unidades_medida, [id_empresa]);
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
    Insertar_Unidad_Medida(unidad_request, _) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, unidad } = unidad_request;
            try {
                let result = yield client.query(DaoUnidadesMedida_1._insertar_unidad_medida, [id_empresa, unidad]);
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
    Buscar_Unidad_Medida(unidad_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, unidad } = unidad_request;
            try {
                let result = yield client.query(DaoUnidadesMedida_1._buscar_unidad_medida, [id_empresa, unidad]);
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
    Buscar_Unidad_Medida_ID(id_unidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoUnidadesMedida_1._buscar_unidad_medida_id, [id_unidad]);
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
    Editar_Unidad_Medida(id_unidad, unidad_medida_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoUnidadesMedida_1._editar_unidad_medida, [id_unidad, unidad_medida_request.unidad]);
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
exports.default = QueryUnidadesMedida;
