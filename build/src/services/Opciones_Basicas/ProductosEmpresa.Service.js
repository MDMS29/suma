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
exports.ProductosEmpresaService = void 0;
const QueryProductosEmpresa_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryProductosEmpresa"));
class ProductosEmpresaService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Productos_Empresa = new QueryProductosEmpresa_1.default();
    }
    Obtener_Productos_Empresa(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Productos_Empresa.Obtener_Productos_Empresa(estado, empresa);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado los productos' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los productos' }; //!ERROR
            }
        });
    }
    Insertar_Producto_Empresa(producto_empresa_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //TODO: ARREGLAR VALIDACION DE DATOS
                const familia_filtrada_nombre = yield this._Query_Productos_Empresa.Buscar_Producto_Nombre(producto_empresa_request);
                if ((familia_filtrada_nombre === null || familia_filtrada_nombre === void 0 ? void 0 : familia_filtrada_nombre.length) > 0) {
                    return { error: true, message: 'Ya existe este nombre de producto' }; //!ERROR
                }
                const producto_filtrado_refe = yield this._Query_Productos_Empresa.Buscar_Producto_Referencia(producto_empresa_request);
                if ((producto_filtrado_refe === null || producto_filtrado_refe === void 0 ? void 0 : producto_filtrado_refe.length) > 0) {
                    return { error: true, message: 'Ya existe esta referencia de producto' }; //!ERROR
                }
                //MOSTRAR POR DEFAULT UNA IMAGEN SI NO EXISTE
                producto_empresa_request.foto = producto_empresa_request.foto === '' ? 'imagen.png' : producto_empresa_request.foto;
                const respuesta = yield this._Query_Productos_Empresa.Insertar_Producto_Empresa(producto_empresa_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el producto' }; //!ERROR
                }
                const producto_empresa = yield this._Query_Productos_Empresa.Buscar_Producto_ID(respuesta[0].id_producto);
                if (!producto_empresa) {
                    return { error: true, message: 'No se ha encontrado el producto' }; //!ERROR
                }
                return producto_empresa[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el producto' }; //!ERROR
            }
        });
    }
    Buscar_Producto_Empresa(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const producto_empresa = yield this._Query_Productos_Empresa.Buscar_Producto_ID(id_producto);
                if (!producto_empresa) {
                    return { error: true, message: 'No se ha encontrado el producto' }; //!ERROR
                }
                return producto_empresa[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar el producto' };
            }
        });
    }
    Buscar_Producto_Filtro(tipo, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            const TIPOS_FILTROS = {
                tipo_producto: 'tipo_producto',
            };
            try {
                if (TIPOS_FILTROS.tipo_producto === tipo) {
                    const producto_empresa = yield this._Query_Productos_Empresa.Buscar_Producto_Filtro(tipo, valor);
                    if (!producto_empresa) {
                        return { error: true, message: 'No se han encontrado los productos' }; //!ERROR
                    }
                    return producto_empresa;
                }
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar los productos' };
            }
        });
    }
    Editar_Producto_Empresa(id_producto, producto_empresa_request, usuario_edicion) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Productos_Empresa.Buscar_Producto_ID(id_producto);
                const producto_filtrado_refe = yield this._Query_Productos_Empresa.Buscar_Producto_Referencia(producto_empresa_request);
                if ((producto_filtrado_refe === null || producto_filtrado_refe === void 0 ? void 0 : producto_filtrado_refe.length) > 0 && producto_filtrado_refe[0].referencia !== respuesta[0].referencia && producto_empresa_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe esta referencia' }; //!ERROR
                }
                const producto_filtrado_desc = yield this._Query_Productos_Empresa.Buscar_Producto_Nombre(producto_empresa_request);
                if ((producto_filtrado_desc === null || producto_filtrado_desc === void 0 ? void 0 : producto_filtrado_desc.length) > 0 && producto_filtrado_desc[0].descripcion !== respuesta[0].descripcion && producto_empresa_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe este nombre de producto' }; //!ERROR
                }
                producto_empresa_request.referencia = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.referencia) === producto_empresa_request.referencia ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.referencia : producto_empresa_request.referencia;
                producto_empresa_request.descripcion = ((_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.descripcion) === producto_empresa_request.descripcion ? (_d = respuesta[0]) === null || _d === void 0 ? void 0 : _d.descripcion : producto_empresa_request.descripcion;
                producto_empresa_request.foto = producto_empresa_request.foto === '' ? respuesta[0].foto : producto_empresa_request.foto;
                const res = yield this._Query_Productos_Empresa.Editar_Producto_Empresa(id_producto, producto_empresa_request, usuario_edicion);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el producto' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el producto' }; //!ERROR
            }
        });
    }
    Cambiar_Estado_Producto(id_producto, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const producto_filtrado = yield this._Query_Productos_Empresa.Buscar_Producto_ID(id_producto);
                if ((producto_filtrado === null || producto_filtrado === void 0 ? void 0 : producto_filtrado.length) <= 0) {
                    return { error: true, message: 'No se ha encontrado este producto' }; //!ERROR
                }
                const producto = yield this._Query_Productos_Empresa.Cambiar_Estado_Producto(id_producto, estado);
                if ((producto === null || producto === void 0 ? void 0 : producto.rowCount) != 1) {
                    return { error: true, message: 'Error al cambiar el estado del producto' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar el estado del producto' }; //!ERROR
            }
        });
    }
}
exports.ProductosEmpresaService = ProductosEmpresaService;
