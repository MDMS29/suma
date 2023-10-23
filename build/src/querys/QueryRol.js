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
const DaoRol_1 = require("../dao/DaoRol");
class QueryRol {
    ObtenerRoles(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoRol_1._ObtenerRoles, [estado]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Rol_Nombre(nombre_rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoRol_1._BuscarRolNombre, [nombre_rol]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Rol(nombre_rol, descripcion, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ultimo_id = yield db_1.client.query(DaoRol_1._ObtenerUltimoID);
                ultimo_id = ultimo_id.rows[0].id_rol + 1;
                let result = yield db_1.client.query(DaoRol_1._InsertarRol, [ultimo_id, nombre_rol, descripcion, usuario_creacion]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Rol_ID(id_rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoRol_1._BuscarRolID, [id_rol]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Editar_Rol(id_rol, nombre_editado, descripcion, usuario_modificacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoRol_1._EditarRol, [id_rol, nombre_editado, descripcion, usuario_modificacion]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Cambiar_Estado_Rol(id_rol, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoRol_1._CambiarEstadoRol, [id_rol, estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.default = QueryRol;
