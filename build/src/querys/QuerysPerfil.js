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
const DaoPerfil_1 = require("../dao/DaoPerfil");
class QueryPerfil {
    Obtener_Perfiles(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoPerfil_1._ObtenerPerfiles, [estado]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Modulos_Perfil(id_perfil) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoPerfil_1._ObtenerModulosPerfil, [id_perfil]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Perfil({ nombre_perfil, usuario_creacion }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._InsertarPerfil, [nombre_perfil, usuario_creacion]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Modulo_Perfil(id_perfil, id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._InsertarModuloPerfil, [id_perfil, id_modulo]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Perfil_ID(id_perfil) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._BuscarPerfilID, [id_perfil]);
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Perfil_Nombre(nombre_perfil) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._ObtenerPerfiles, [1]);
                const repetido = result.rows.filter(x => x.nombre_perfil.toLowerCase() === nombre_perfil.toLowerCase());
                return repetido;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Permisos_Modulos_Perfil(id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._PermisosModulosPerfil, [id_modulo]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Editar_Perfil({ id_perfil, nombre_editado, usuario_creacion }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._EditarPerfil, [id_perfil, nombre_editado, usuario_creacion]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Modulo_Perfil(id_perfil, id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._BuscarModulosPerfil, [id_perfil, id_modulo]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Editar_Modulo_Perfil(id_perfil, modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._EditarModuloPerfil, [id_perfil, modulo.id_modulo, modulo.id_estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Cambiar_Estado_Perfil(id_perfil, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoPerfil_1._CambiarEstadoPerfil, [id_perfil, estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.default = QueryPerfil;
