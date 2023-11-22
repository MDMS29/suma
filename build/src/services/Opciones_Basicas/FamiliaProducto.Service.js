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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FamiliaProductoService = void 0;
const QueryFamiliaProducto_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryFamiliaProducto"));
class FamiliaProductoService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Familia_Producto = new QueryFamiliaProducto_1.default();
    }
    Obtener_Familias_Producto(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Familia_Producto.Obtener_Familias_Producto(estado, empresa);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado familias de productos' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar las familias de productos' }; //!ERROR
            }
        });
    }
    Insertar_Familia_Producto(familia_producto_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const familia_filtrada = yield this._Query_Familia_Producto.Buscar_Familia_Producto(familia_producto_request);
                if ((familia_filtrada === null || familia_filtrada === void 0 ? void 0 : familia_filtrada.length) > 0) {
                    return { error: true, message: 'Ya existe esta familia de producto' }; //!ERROR
                }
                const respuesta = yield this._Query_Familia_Producto.Insertar_Familia_Producto(familia_producto_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear la familia de productos' }; //!ERROR
                }
                const familia_producto = yield this._Query_Familia_Producto.Buscar_Familia_Producto_ID(respuesta[0].id_familia);
                if (!familia_producto) {
                    return { error: true, message: 'No se ha encontrado la familia de productos' }; //!ERROR
                }
                return familia_producto[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear la familia de productos' }; //!ERROR
            }
        });
    }
    Buscar_Familia_Producto(id_familia_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const familia_producto = yield this._Query_Familia_Producto.Buscar_Familia_Producto_ID(id_familia_producto);
                if (!familia_producto) {
                    return { error: true, message: 'No se ha encontrado la familia' }; //!ERROR
                }
                return familia_producto[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar la familia' };
            }
        });
    }
    Editar_Familia_Producto(id_familia_producto, familia_producto_request) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Familia_Producto.Buscar_Familia_Producto_ID(id_familia_producto);
                const familia_filtrada_referencia = yield this._Query_Familia_Producto.Buscar_Familia_Producto(familia_producto_request);
                if ((familia_filtrada_referencia === null || familia_filtrada_referencia === void 0 ? void 0 : familia_filtrada_referencia.length) > 0 && familia_filtrada_referencia[0].referencia !== respuesta[0].referencia && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe esta referencia' }; //!ERROR
                }
                const familia_filtrada_descripcion = yield this._Query_Familia_Producto.Buscar_Familia_Descripcion(familia_producto_request);
                if ((familia_filtrada_descripcion === null || familia_filtrada_descripcion === void 0 ? void 0 : familia_filtrada_descripcion.length) > 0 && familia_filtrada_descripcion[0].descripcion !== respuesta[0].descripcion && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe este nombre de familia' }; //!ERROR
                }
                familia_producto_request.referencia = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.referencia) === familia_producto_request.referencia ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.referencia : familia_producto_request.referencia;
                familia_producto_request.descripcion = ((_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.descripcion) === familia_producto_request.descripcion ? (_d = respuesta[0]) === null || _d === void 0 ? void 0 : _d.descripcion : familia_producto_request.descripcion;
                const res = yield this._Query_Familia_Producto.Editar_Familia_Producto(id_familia_producto, familia_producto_request);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar la familia' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar la familia' }; //!ERROR
            }
        });
    }
    Cambiar_Estado_Familia(id_familia_producto, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const familia_filtrada = yield this._Query_Familia_Producto.Buscar_Familia_Producto_ID(id_familia_producto);
                if ((familia_filtrada === null || familia_filtrada === void 0 ? void 0 : familia_filtrada.length) <= 0) {
                    return { error: true, message: 'No se ha encontrado esta la familia' }; //!ERROR
                }
                const familia_cambiada = yield this._Query_Familia_Producto.Cambiar_Estado_Familia(id_familia_producto, estado);
                if ((familia_cambiada === null || familia_cambiada === void 0 ? void 0 : familia_cambiada.rowCount) != 1) {
                    return { error: true, message: 'Error al cambiar el estado de la familia' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar el estado de la familia' }; //!ERROR
            }
        });
    }
}
exports.FamiliaProductoService = FamiliaProductoService;
