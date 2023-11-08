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
exports.MarcaProductoService = void 0;
const QueryMarcaProducto_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryMarcaProducto"));
class MarcaProductoService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Marca_Producto = new QueryMarcaProducto_1.default();
    }
    Obtener_Marcas_Producto() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Marca_Producto.Obtener_Marcas_Producto();
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado las marcas de productos' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar las marcas de productos' }; //!ERROR
            }
        });
    }
    Insertar_Marca_Producto(marca_producto_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //VALIDAR SI EL MENU EXISTE
                const marca_filtrada = yield this._Query_Marca_Producto.Buscar_Marca_Producto(marca_producto_request);
                if ((marca_filtrada === null || marca_filtrada === void 0 ? void 0 : marca_filtrada.length) > 0) {
                    return { error: true, message: 'Ya existe esta marca' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR MENU
                const respuesta = yield this._Query_Marca_Producto.Insertar_Marca_Producto(marca_producto_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear la marca de producto' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
                const marca_producto = yield this._Query_Marca_Producto.Buscar_Marca_Producto_ID(respuesta[0].id_marca);
                if (!marca_producto) {
                    return { error: true, message: 'No se ha encontrado la marca de producto' }; //!ERROR
                }
                return marca_producto[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear la marca de producto' }; //!ERROR
            }
        });
    }
    Buscar_Marca_Producto(id_marca_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tipo_producto = yield this._Query_Marca_Producto.Buscar_Marca_Producto_ID(id_marca_producto);
                if (!tipo_producto) {
                    return { error: true, message: 'No se ha encontrado la marca' }; //!ERROR
                }
                return tipo_producto[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar la marca' };
            }
        });
    }
    Editar_Marca_Producto(id_marca_producto, marca_producto_request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Marca_Producto.Buscar_Marca_Producto_ID(id_marca_producto);
                const marca_filtrada = yield this._Query_Marca_Producto.Buscar_Marca_Producto(marca_producto_request);
                if ((marca_filtrada === null || marca_filtrada === void 0 ? void 0 : marca_filtrada.length) > 0 && marca_filtrada[0].marca !== respuesta[0].marca) {
                    return { error: true, message: 'Ya existe esta marca' }; //!ERROR
                }
                marca_producto_request.marca = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.marca) === marca_producto_request.marca ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.marca : marca_producto_request.marca;
                const res = yield this._Query_Marca_Producto.Editar_Marca_Producto(id_marca_producto, marca_producto_request);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar la marca' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar la marca' }; //!ERROR
            }
        });
    }
}
exports.MarcaProductoService = MarcaProductoService;
