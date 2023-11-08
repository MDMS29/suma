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
exports.TiposProductoService = void 0;
const QueryTipoProducto_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryTipoProducto"));
class TiposProductoService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._QueryTipoProducto = new QueryTipoProducto_1.default();
    }
    Obtener_Tipos_Producto(id_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._QueryTipoProducto.Obtener_Tipos_Producto(id_empresa);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado tipos de producto' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los tipos de producto' }; //!ERROR
            }
        });
    }
    Insertar_Tipo_Producto(tipos_producto_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //VALIDAR SI EL MENU EXISTE
                const unidad_filtrada = yield this._QueryTipoProducto.Buscar_Tipo_Producto(tipos_producto_request);
                if ((unidad_filtrada === null || unidad_filtrada === void 0 ? void 0 : unidad_filtrada.length) > 0) {
                    return { error: true, message: 'Ya existe este tipo de producto' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR MENU
                const respuesta = yield this._QueryTipoProducto.Insertar_Tipo_Producto(tipos_producto_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el tipo de producto' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
                const unidad_medida = yield this._QueryTipoProducto.Buscar_Tipo_Producto_ID(respuesta[0].id_tipo_producto);
                if (!unidad_medida) {
                    return { error: true, message: 'No se ha encontrado el tipo de producto' }; //!ERROR
                }
                return unidad_medida[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el tipo de producto' }; //!ERROR
            }
        });
    }
    Buscar_Tipo_Producto(id_tipo_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tipo_producto = yield this._QueryTipoProducto.Buscar_Tipo_Producto_ID(id_tipo_producto);
                if (!tipo_producto) {
                    return { error: true, message: 'No se ha encontrado el tipo de producto' }; //!ERROR
                }
                return tipo_producto[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar el tipo de producto' };
            }
        });
    }
    Editar_Tipo_Producto(id_tipo_producto, tipos_producto_request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._QueryTipoProducto.Buscar_Tipo_Producto_ID(id_tipo_producto);
                const unidad_filtrada = yield this._QueryTipoProducto.Buscar_Tipo_Producto(tipos_producto_request);
                if ((unidad_filtrada === null || unidad_filtrada === void 0 ? void 0 : unidad_filtrada.length) > 0 && unidad_filtrada[0].descripcion !== respuesta[0].descripcion) {
                    return { error: true, message: 'Ya existe este tipo de producto' }; //!ERROR
                }
                tipos_producto_request.descripcion = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.descripcion) === tipos_producto_request.descripcion ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.descripcion : tipos_producto_request.descripcion;
                const res = yield this._QueryTipoProducto.Editar_Tipo_Producto(id_tipo_producto, tipos_producto_request);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el tipo de producto' }; //!ERROR
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el tipo de producto' }; //!ERROR
            }
        });
    }
}
exports.TiposProductoService = TiposProductoService;
