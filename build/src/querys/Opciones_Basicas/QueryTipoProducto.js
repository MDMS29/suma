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
const DaoTipoProducto_1 = require("../../dao/Opciones_Basicas/DaoTipoProducto");
class QueryTipoProducto {
    Obtener_Tipos_Producto(id_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoTipoProducto_1._obtener_tipos_producto, [id_empresa]);
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
    Insertar_Tipo_Producto(unidad_request, _) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, descripcion } = unidad_request;
            try {
                let result = yield client.query(DaoTipoProducto_1._insertar_tipo_producto, [id_empresa, descripcion]);
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
    Buscar_Tipo_Producto(tipos_producto_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, descripcion } = tipos_producto_request;
            try {
                let result = yield client.query(DaoTipoProducto_1._buscar_tipo_producto, [id_empresa, descripcion]);
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
    Buscar_Tipo_Producto_ID(id_tipo_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoTipoProducto_1._buscar_tipo_producto_id, [id_tipo_producto]);
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
    Editar_Tipo_Producto(id_tipo_producto, tipos_producto_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoTipoProducto_1._editar_tipo_producto, [id_tipo_producto, tipos_producto_request.descripcion]);
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
exports.default = QueryTipoProducto;
