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
exports.RolService = void 0;
const QueryRol_1 = __importDefault(require("../../querys/Configuracion/QueryRol"));
class RolService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Rol = new QueryRol_1.default();
    }
    Obtener_Roles(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!estado) {
                return { error: true, message: 'Estado no definido' }; //!ERROR
            }
            try {
                const respuesta = yield this._Query_Rol.ObtenerRoles(estado);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: true, message: 'No se han encontrado roles' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los roles' }; //!ERROR
            }
        });
    }
    Insertar_Rol(nombre, descripcion, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //VALIDAR SI EL ROL EXISTE
                const Brol = yield this._Query_Rol.Buscar_Rol_Nombre(nombre);
                if ((Brol === null || Brol === void 0 ? void 0 : Brol.length) > 0) {
                    return { error: true, message: 'Ya existe este rol' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR ROL
                const respuesta = yield this._Query_Rol.Insertar_Rol(nombre, descripcion, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el rol' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR EL ROL POR ID
                const rol = yield this._Query_Rol.Buscar_Rol_ID(respuesta[0].id_rol);
                if (!rol) {
                    return { error: true, message: 'No se ha encontrado el rol' }; //!ERROR
                }
                return rol[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el rol' }; //!ERROR
            }
        });
    }
    Buscar_Rol(id_rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol = yield this._Query_Rol.Buscar_Rol_ID(id_rol);
                if (!rol) {
                    return { error: true, message: 'No se ha encontrado este rol' }; //!ERROR
                }
                return rol[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar el rol' };
            }
        });
    }
    Editar_Rol(id_rol, nombre, descripcion, usuario_modificacion) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let nombre_editado;
            let descripcion_editado;
            try {
                // COMPROBAR SI ESTE ROL EXISTE
                const respuesta = yield this._Query_Rol.Buscar_Rol_ID(id_rol);
                if (respuesta.length === 0) {
                    return { error: true, message: 'No existe este rol' }; //!ERROR
                }
                const rol_filtrado = yield this._Query_Rol.Buscar_Rol_Nombre(nombre);
                if ((rol_filtrado === null || rol_filtrado === void 0 ? void 0 : rol_filtrado.length) > 0 && rol_filtrado[0].nombre !== respuesta[0].nombre) {
                    return { error: true, message: 'Ya existe este rol' }; //!ERROR
                }
                // ACTUALIZAR
                if (((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.nombre) === nombre) {
                    nombre_editado = (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.nombre;
                }
                else {
                    nombre_editado = nombre;
                }
                if (((_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.descripcion) === descripcion) {
                    descripcion_editado = (_d = respuesta[0]) === null || _d === void 0 ? void 0 : _d.descripcion;
                }
                else {
                    descripcion_editado = descripcion;
                }
                const res = yield this._Query_Rol.Editar_Rol(id_rol, nombre_editado, descripcion_editado, usuario_modificacion);
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
    Cambiar_Estado_Rol(id_rol, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rol_editado = yield this._Query_Rol.Cambiar_Estado_Rol(id_rol, estado);
                if (!(rol_editado === null || rol_editado === void 0 ? void 0 : rol_editado.rowCount)) {
                    return { error: true, message: 'Error al editar el rol' }; //!ERROR
                }
                return { error: false, message: 'Se ha cambiado el estado del rol' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el rol' }; //!ERROR
            }
        });
    }
}
exports.RolService = RolService;
