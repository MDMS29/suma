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
const DaoProductosEmpresa_1 = require("../../dao/Opciones_Basicas/DaoProductosEmpresa");
class QueryProductosEmpresa {
    Obtener_Productos_Empresa(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoProductosEmpresa_1._obtener_productos_empresa, [estado, empresa]);
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
    Insertar_Producto_Empresa(familia_producto_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, id_familia, id_marca, id_tipo_producto, referencia, id_unidad, descripcion, precio_costo, precio_venta, critico, inventariable, foto, compuesto, ficha, certificado } = familia_producto_request;
            try {
                let result = yield client.query(DaoProductosEmpresa_1._insertar_producto_empresa, 
                //INFORMACION DEL PRODUCTO
                [
                    id_empresa, id_familia, id_marca,
                    id_tipo_producto, referencia, id_unidad,
                    descripcion, precio_costo, precio_venta,
                    critico, inventariable, foto,
                    compuesto, ficha, certificado,
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
    Buscar_Producto_Nombre(producto_empresa_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, descripcion } = producto_empresa_request;
            try {
                let result = yield client.query(DaoProductosEmpresa_1._buscar_producto_nombre, [id_empresa, descripcion]);
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
    Buscar_Producto_Referencia(producto_empresa_request) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, referencia } = producto_empresa_request;
            try {
                let result = yield client.query(DaoProductosEmpresa_1._buscar_producto_referencia, [id_empresa, referencia]);
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
    Buscar_Producto_ID(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoProductosEmpresa_1._buscar_producto_id, [id_producto]);
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
    Buscar_Producto_Filtro(tipo, valor, empresa_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield db_1._DB.func(DaoProductosEmpresa_1._FA_obtener_productos_filtro, [tipo, valor, empresa_usuario]);
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
    Editar_Producto_Empresa(id_producto, familia_producto_request, usuario_edicion) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            const { id_empresa, id_familia, id_marca, id_tipo_producto, referencia, id_unidad, descripcion, precio_costo, precio_venta, critico, inventariable, foto, compuesto, ficha, certificado } = familia_producto_request;
            try {
                let result = yield client.query(DaoProductosEmpresa_1._editar_producto_empresa, 
                //INFORMACION DEL PRODUCTO
                [
                    id_producto,
                    id_empresa, id_familia, id_marca,
                    id_tipo_producto, referencia, id_unidad,
                    descripcion, precio_costo, precio_venta,
                    critico, inventariable, foto,
                    compuesto, ficha, certificado,
                    usuario_edicion
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
    Cambiar_Estado_Producto(id_producto, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                let result = yield client.query(DaoProductosEmpresa_1._cambiar_estado_producto, [id_producto, estado]);
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
exports.default = QueryProductosEmpresa;
