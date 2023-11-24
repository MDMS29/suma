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
const DaoFamiliaProducto_1 = require("../../dao/Opciones_Basicas/DaoFamiliaProducto");
class QueryFamiliaProducto {
    Obtener_Familias_Producto(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoFamiliaProducto_1._obtener_familias_producto, [estado, empresa]);
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
    Insertar_Familia_Producto(familia_producto_request, _) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, referencia, descripcion } = familia_producto_request;
            try {
                let result = yield client.query(DaoFamiliaProducto_1._insertar_familia_producto, [id_empresa, referencia, descripcion]);
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
    Buscar_Familia_Producto(familia_producto_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, referencia } = familia_producto_request;
            try {
                let result = yield client.query(DaoFamiliaProducto_1._buscar_familia_producto, [id_empresa, referencia]);
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
    Buscar_Familia_Descripcion(familia_producto_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, descripcion } = familia_producto_request;
            try {
                let result = yield client.query(DaoFamiliaProducto_1._buscar_familia_descripcion, [id_empresa, descripcion]);
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
    Buscar_Familia_Producto_ID(id_familia_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoFamiliaProducto_1._buscar_familia_producto_id, [id_familia_producto]);
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
    Editar_Familia_Producto(id_familia_producto, familia_producto_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, referencia, descripcion } = familia_producto_request;
            try {
                let result = yield client.query(DaoFamiliaProducto_1._editar_familia_producto, [id_familia_producto, id_empresa, referencia, descripcion]);
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
    Cambiar_Estado_Familia(id_familia_producto, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoFamiliaProducto_1._cambiar_estado_familia, [id_familia_producto, estado]);
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
exports.default = QueryFamiliaProducto;
