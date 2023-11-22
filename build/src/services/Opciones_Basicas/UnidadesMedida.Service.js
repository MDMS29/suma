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
exports.UnidadesMedidaService = void 0;
const QueryUnidadesMedida_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryUnidadesMedida"));
class UnidadesMedidaService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Unidades_Medida = new QueryUnidadesMedida_1.default();
    }
    Obtener_Unidades_Medida(estado, id_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!estado) {
                return { error: true, message: 'Estado no definido' }; //!ERROR
            }
            try {
                const respuesta = yield this._Query_Unidades_Medida.Obtener_Unidades_Medida(estado, id_empresa);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado las unidades de medida' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar las unidades de medida' }; //!ERROR
            }
        });
    }
    Insertar_Unidad_Medida(unidad_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //VALIDAR SI EL MENU EXISTE
                const unidad_filtrada = yield this._Query_Unidades_Medida.Buscar_Unidad_Medida(unidad_request);
                if ((unidad_filtrada === null || unidad_filtrada === void 0 ? void 0 : unidad_filtrada.length) > 0) {
                    return { error: true, message: 'Ya existe esta unidad de medida' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR MENU
                const respuesta = yield this._Query_Unidades_Medida.Insertar_Unidad_Medida(unidad_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear la unidad de medida' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
                const unidad_medida = yield this._Query_Unidades_Medida.Buscar_Unidad_Medida_ID(respuesta[0].id_unidad);
                if (!unidad_medida) {
                    return { error: true, message: 'No se ha encontrado la unidad de medida' }; //!ERROR
                }
                return unidad_medida[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear la unidad de medida' }; //!ERROR
            }
        });
    }
    Buscar_Unidad_Medida(id_unidad) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unidad_medida = yield this._Query_Unidades_Medida.Buscar_Unidad_Medida_ID(id_unidad);
                if (!unidad_medida) {
                    return { error: true, message: 'No se ha encontrado la unidad de medida' }; //!ERROR
                }
                return unidad_medida[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar la unidad de medida' };
            }
        });
    }
    Editar_Unidad_Medida(id_unidad, unidad_medida_request) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Unidades_Medida.Buscar_Unidad_Medida_ID(id_unidad);
                const unidad_filtrada = yield this._Query_Unidades_Medida.Buscar_Unidad_Medida(unidad_medida_request);
                if ((unidad_filtrada === null || unidad_filtrada === void 0 ? void 0 : unidad_filtrada.length) > 0 && unidad_filtrada[0].unidad !== respuesta[0].unidad) {
                    return { error: true, message: 'Ya existe esta unidad de medida' }; //!ERROR
                }
                unidad_medida_request.unidad = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.unidad) === unidad_medida_request.unidad ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.unidad : unidad_medida_request.unidad;
                const res = yield this._Query_Unidades_Medida.Editar_Unidad_Medida(id_unidad, unidad_medida_request);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar la unidad de medida' }; //!ERROR
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar la unidad de medida' }; //!ERROR
            }
        });
    }
}
exports.UnidadesMedidaService = UnidadesMedidaService;
