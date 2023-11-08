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
exports.CentroCostoEmpresaService = void 0;
const QueryCentroCostoEmpresa_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryCentroCostoEmpresa"));
class CentroCostoEmpresaService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Centro_Costo_Empresa = new QueryCentroCostoEmpresa_1.default();
    }
    Obtener_Centros_Costo_Empresa(estado, empresa, tipo, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            const TIPOS_CONSULTA = {
                proceso: 'proceso'
            };
            try {
                let respuesta;
                if (TIPOS_CONSULTA.proceso === tipo) {
                    respuesta = yield this._Query_Centro_Costo_Empresa.Obtener_Centros_Costo_Filtro(empresa, tipo, valor);
                    if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                        return { error: false, message: 'No se han encontrado procesos en la empresa' }; //!ERROR
                    }
                }
                else {
                    respuesta = yield this._Query_Centro_Costo_Empresa.Obtener_Centros_Costo_Empresa(estado, empresa);
                    if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                        return { error: false, message: 'No se han encontrado procesos en la empresa' }; //!ERROR
                    }
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los procesos de la empresa' }; //!ERROR
            }
        });
    }
    Insertar_Centro_Costo_Empresa(centro_costo_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proceso_filtrado_codigo = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_Codigo(centro_costo_request);
                if ((proceso_filtrado_codigo === null || proceso_filtrado_codigo === void 0 ? void 0 : proceso_filtrado_codigo.length) > 0) {
                    return { error: true, message: 'Ya existe este codigo' }; //!ERROR
                }
                const centro_filtrado_nombre = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_Nombre(centro_costo_request);
                if ((centro_filtrado_nombre === null || centro_filtrado_nombre === void 0 ? void 0 : centro_filtrado_nombre.length) > 0) {
                    return { error: true, message: 'Ya existe este nombre' }; //!ERROR
                }
                const responsable_filtrado = yield this._Query_Centro_Costo_Empresa.Buscar_Responsable_Centro(centro_costo_request);
                if ((responsable_filtrado === null || responsable_filtrado === void 0 ? void 0 : responsable_filtrado.length) > 0) {
                    return { error: true, message: 'Este correo esta asociado a un centro de costo diferente' }; //!ERROR
                }
                const respuesta = yield this._Query_Centro_Costo_Empresa.Insertar_Centro_Costo(centro_costo_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el centro' }; //!ERROR
                }
                const centro_empresa = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(respuesta[0].id_centro);
                if (!centro_empresa) {
                    return { error: true, message: 'No se ha encontrado el centro' }; //!ERROR
                }
                return centro_empresa[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el proceso' }; //!ERROR
            }
        });
    }
    Buscar_Centro_Costo(id_centro_costo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const centro = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(id_centro_costo);
                if (!centro) {
                    return { error: true, message: 'No se ha encontrado el centro de costo' }; //!ERROR
                }
                return centro[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar el centro de costo' };
            }
        });
    }
    Editar_Centro_Costo(id_proceso_empresa, centro_costo_request) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(id_proceso_empresa);
                const proceso_filtrado_codigo = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_Codigo(centro_costo_request);
                if ((proceso_filtrado_codigo === null || proceso_filtrado_codigo === void 0 ? void 0 : proceso_filtrado_codigo.length) > 0 && proceso_filtrado_codigo[0].codigo !== respuesta[0].codigo && centro_costo_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe este codigo de centro' }; //!ERROR
                }
                const centro_filtrado_nombre = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_Nombre(centro_costo_request);
                if ((centro_filtrado_nombre === null || centro_filtrado_nombre === void 0 ? void 0 : centro_filtrado_nombre.length) > 0 && centro_filtrado_nombre[0].centro_costo !== respuesta[0].centro_costo && centro_costo_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe este nombre de centro' }; //!ERROR
                }
                const centro_filtrado_responsable = yield this._Query_Centro_Costo_Empresa.Buscar_Responsable_Centro(centro_costo_request);
                if ((centro_filtrado_responsable === null || centro_filtrado_responsable === void 0 ? void 0 : centro_filtrado_responsable.length) > 0 && centro_filtrado_responsable[0].correo_responsable !== respuesta[0].correo_responsable && centro_costo_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Este correo esta asociado a un centro de costo diferente' }; //!ERROR
                }
                //ACTUALIZAR INFORMACION
                centro_costo_request.codigo = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.codigo) === centro_costo_request.codigo ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.codigo : centro_costo_request.codigo;
                centro_costo_request.centro_costo = ((_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.centro_costo) === centro_costo_request.centro_costo ? (_d = respuesta[0]) === null || _d === void 0 ? void 0 : _d.centro_costo : centro_costo_request.centro_costo;
                centro_costo_request.id_proceso = ((_e = respuesta[0]) === null || _e === void 0 ? void 0 : _e.id_proceso) === centro_costo_request.id_proceso ? (_f = respuesta[0]) === null || _f === void 0 ? void 0 : _f.id_proceso : centro_costo_request.id_proceso;
                centro_costo_request.correo_responsable = ((_g = respuesta[0]) === null || _g === void 0 ? void 0 : _g.correo_responsable) === centro_costo_request.correo_responsable ? (_h = respuesta[0]) === null || _h === void 0 ? void 0 : _h.correo_responsable : centro_costo_request.correo_responsable;
                const res = yield this._Query_Centro_Costo_Empresa.Editar_Centro_Costo(id_proceso_empresa, centro_costo_request);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el centro' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el centro' }; //!ERROR
            }
        });
    }
    Cambiar_Estado_Centro(id_centro_costo, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const familia_filtrada = yield this._Query_Centro_Costo_Empresa.Buscar_Centro_ID(id_centro_costo);
                if ((familia_filtrada === null || familia_filtrada === void 0 ? void 0 : familia_filtrada.length) <= 0) {
                    return { error: true, message: 'No se ha encontrado este centro de costo' }; //!ERROR
                }
                const familia_cambiada = yield this._Query_Centro_Costo_Empresa.Cambiar_Estado_Centro(id_centro_costo, estado);
                if ((familia_cambiada === null || familia_cambiada === void 0 ? void 0 : familia_cambiada.rowCount) != 1) {
                    return { error: true, message: 'Error al cambiar el estado del centro' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar el estado del centro' }; //!ERROR
            }
        });
    }
}
exports.CentroCostoEmpresaService = CentroCostoEmpresaService;
