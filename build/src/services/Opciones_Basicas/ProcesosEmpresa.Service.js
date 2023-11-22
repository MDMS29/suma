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
exports.ProcesosEmpresaService = void 0;
const QueryProcesosEmpresa_1 = __importDefault(require("../../querys/Opciones_Basicas/QueryProcesosEmpresa"));
class ProcesosEmpresaService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Proceso_Empresa = new QueryProcesosEmpresa_1.default();
    }
    Obtener_Procesos_Empresa(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Proceso_Empresa.Obtener_Procesos_Empresa(empresa);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado procesos en la empresa' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los procesos de la empresa' }; //!ERROR
            }
        });
    }
    Insertar_Procesos_Empresa(proceso_empresa_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proceso_filtrado_codigo = yield this._Query_Proceso_Empresa.Buscar_Proceso_Codigo(proceso_empresa_request);
                if ((proceso_filtrado_codigo === null || proceso_filtrado_codigo === void 0 ? void 0 : proceso_filtrado_codigo.length) > 0) {
                    return { error: true, message: 'Ya existe este codigo de proceso' }; //!ERROR
                }
                const proceso_filtrado_nombre = yield this._Query_Proceso_Empresa.Buscar_Proceso_Nombre(proceso_empresa_request);
                if ((proceso_filtrado_nombre === null || proceso_filtrado_nombre === void 0 ? void 0 : proceso_filtrado_nombre.length) > 0) {
                    return { error: true, message: 'Ya existe este nombre de proceso' }; //!ERROR
                }
                const respuesta = yield this._Query_Proceso_Empresa.Insertar_Proceso_Empresa(proceso_empresa_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el proceso' }; //!ERROR
                }
                const proceso_empresa = yield this._Query_Proceso_Empresa.Buscar_Proceso_ID(respuesta[0].id_proceso);
                if (!proceso_empresa) {
                    return { error: true, message: 'No se ha encontrado el proceso' }; //!ERROR
                }
                return proceso_empresa[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el proceso' }; //!ERROR
            }
        });
    }
    Buscar_Proceso_Empresa(id_proceso_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const proceso_empresa = yield this._Query_Proceso_Empresa.Buscar_Proceso_ID(id_proceso_empresa);
                if (!proceso_empresa) {
                    return { error: true, message: 'No se ha encontrado el proceso' }; //!ERROR
                }
                return proceso_empresa[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar el proceso' };
            }
        });
    }
    Editar_Proceso_Empresa(id_proceso_empresa, proceso_empresa_request) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Proceso_Empresa.Buscar_Proceso_ID(id_proceso_empresa);
                const proceso_filtrado_codigo = yield this._Query_Proceso_Empresa.Buscar_Proceso_Codigo(proceso_empresa_request);
                if ((proceso_filtrado_codigo === null || proceso_filtrado_codigo === void 0 ? void 0 : proceso_filtrado_codigo.length) > 0 && proceso_filtrado_codigo[0].codigo !== respuesta[0].codigo && proceso_empresa_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe este codigo de proceso' }; //!ERROR
                }
                const proceso = yield this._Query_Proceso_Empresa.Buscar_Proceso_Nombre(proceso_empresa_request);
                if ((proceso === null || proceso === void 0 ? void 0 : proceso.length) > 0 && proceso[0].proceso !== respuesta[0].proceso && proceso_empresa_request.id_empresa === respuesta[0].id_empresa) {
                    return { error: true, message: 'Ya existe este nombre de proceso' }; //!ERROR
                }
                proceso_empresa_request.codigo = ((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.codigo) === proceso_empresa_request.codigo ? (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.codigo : proceso_empresa_request.codigo;
                proceso_empresa_request.proceso = ((_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.proceso) === proceso_empresa_request.proceso ? (_d = respuesta[0]) === null || _d === void 0 ? void 0 : _d.proceso : proceso_empresa_request.proceso;
                const res = yield this._Query_Proceso_Empresa.Editar_Proceso_Empresa(id_proceso_empresa, proceso_empresa_request);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el proceso' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el proceso' }; //!ERROR
            }
        });
    }
}
exports.ProcesosEmpresaService = ProcesosEmpresaService;
