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
const QueryEmpresa_1 = __importDefault(require("../../querys/Configuracion/QueryEmpresa"));
class EmpresaService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Empresa = new QueryEmpresa_1.default();
    }
    Obtener_Empresas(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!estado) {
                return { error: true, message: 'Estado no definido' }; //!ERROR
            }
            try {
                const respuesta = yield this._Query_Empresa.Obtener_Empresas(estado);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: true, message: 'No se han encontrado empresas' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar las empresas' }; //!ERROR
            }
        });
    }
    Insertar_Empresa(empresa_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //VALIDAR SI LA EMPRESA EXISTE
                const empresa_filtrada_nit = yield this._Query_Empresa.Buscar_Nit(empresa_request.nit);
                if ((empresa_filtrada_nit === null || empresa_filtrada_nit === void 0 ? void 0 : empresa_filtrada_nit.length) > 0) {
                    return { error: true, message: 'Ya existe este nit' }; //!ERROR
                }
                const empresa_filtrada = yield this._Query_Empresa.Buscar_Razon_Social(empresa_request.razon_social);
                if ((empresa_filtrada === null || empresa_filtrada === void 0 ? void 0 : empresa_filtrada.length) > 0) {
                    return { error: true, message: 'Ya existe este nombre de empresa' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR ROL
                const respuesta = yield this._Query_Empresa.Insertar_Empresa(empresa_request, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear la empresa' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR EL ROL POR ID
                const empresa = yield this._Query_Empresa.Buscar_Empresa_ID(respuesta[0].id_empresa);
                if (!empresa) {
                    return { error: true, message: 'No se ha encontrado la empresa' }; //!ERROR
                }
                return empresa[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear la empresa' }; //!ERROR
            }
        });
    }
    Buscar_Empresa(id_empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol = yield this._Query_Empresa.Buscar_Empresa_ID(id_empresa);
                if (!rol) {
                    return { error: true, message: 'No se ha encontrado esta empresa' }; //!ERROR
                }
                return rol[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error buscar la empresa' };
            }
        });
    }
    Editar_Empresa(id_empresa, empresa_request, usuario_modificacion) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // COMPROBAR SI ESTE ROL EXISTE
                const empresa = yield this._Query_Empresa.Buscar_Empresa_ID(id_empresa);
                if (empresa.length === 0) {
                    return { error: true, message: 'No existe esta empresa' }; //!ERROR
                }
                //VERIFICACION DE EMPRESAS CON INFORMACION DUPLICADA
                const empresa_filtrada_razon = yield this._Query_Empresa.Buscar_Razon_Social(empresa_request.razon_social);
                if ((empresa_filtrada_razon === null || empresa_filtrada_razon === void 0 ? void 0 : empresa_filtrada_razon.length) > 0 && empresa_filtrada_razon[0].razon_social !== empresa[0].razon_social) {
                    return { error: true, message: 'Ya existe este nombre de empresa' }; //!ERROR
                }
                const empresa_filtrada_nit = yield this._Query_Empresa.Buscar_Nit(empresa_request.nit);
                if ((empresa_filtrada_nit === null || empresa_filtrada_nit === void 0 ? void 0 : empresa_filtrada_nit.length) > 0 && empresa_filtrada_nit[0].nit !== empresa[0].nit) {
                    return { error: true, message: 'Ya existe este nit de empresa' }; //!ERROR
                }
                // ACTUALIZAR
                empresa_request.nit = ((_a = empresa[0]) === null || _a === void 0 ? void 0 : _a.nit) === empresa_request.nit ? empresa[0].nit : empresa_request.nit;
                empresa_request.razon_social = ((_b = empresa[0]) === null || _b === void 0 ? void 0 : _b.razon_social) === empresa_request.razon_social ? empresa[0].razon_social : empresa_request.razon_social;
                empresa_request.telefono = ((_c = empresa[0]) === null || _c === void 0 ? void 0 : _c.telefono) === empresa_request.telefono ? empresa[0].telefono : empresa_request.telefono;
                empresa_request.correo = ((_d = empresa[0]) === null || _d === void 0 ? void 0 : _d.correo) === empresa_request.telefono ? empresa[0].telefono : empresa_request.telefono;
                empresa_request.direccion = ((_e = empresa[0]) === null || _e === void 0 ? void 0 : _e.direccion) === empresa_request.telefono ? empresa[0].telefono : empresa_request.telefono;
                const res = yield this._Query_Empresa.Editar_Empresa(id_empresa, empresa_request, usuario_modificacion);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el rol' }; //!ERROR
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar rol' }; //!ERROR
            }
        });
    }
    Cambiar_Estado_Empresa(id_empresa, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const empresa_editada = yield this._Query_Empresa.Cambiar_Estado_Empresa(id_empresa, estado);
                if (!(empresa_editada === null || empresa_editada === void 0 ? void 0 : empresa_editada.rowCount)) {
                    return { error: true, message: 'Error al cambiar el estado de la empresa' }; //!ERROR
                }
                return { error: false, message: 'Se ha cambiado el estado de la empresa' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar el estado de la empresa' }; //!ERROR
            }
        });
    }
}
exports.default = EmpresaService;
