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
const DaoModulo_1 = require("../dao/DaoModulo");
class QueryModulo {
    Obtener_Modulos(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._ObtenerModulos, [estado]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Modulo_Nombre(nombre_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._BuscarModuloNombre, [nombre_modulo]);
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Codigo_Modulo(codigo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._BuscarCodigoModulo, [codigo]);
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Modulo_ID(id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._BuscarModuloID, [id_modulo]);
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Obtener_Roles_Modulo(id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._ObtenerRolesModulo, [id_modulo]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Icono_Modulo(id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._BuscarIconoModulo, [id_modulo]);
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Modulo(nombre_modulo, usuario_creador, codigo, icono) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._InsertarModulo, [codigo, nombre_modulo, icono, usuario_creador]);
                return result.rows[0];
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Roles_Modulo(id_rol, id_modulo, usuario_creador) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ultimo_id = yield db_1.client.query(DaoModulo_1._ObtenerUltimoID);
                ultimo_id = ultimo_id.rows[0].id_rol_modulo + 1;
                const result = yield db_1.client.query(DaoModulo_1._InsertarRolModulo, [ultimo_id, id_modulo, id_rol, usuario_creador]);
                return result.rowCount;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Editar_Modulo(id_modulo, nuevoModulo, usuario_modi) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._EditarModulo, [id_modulo, nuevoModulo.cod_modulo, nuevoModulo.nombre_modulo, nuevoModulo.icono, usuario_modi]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Cambiar_Estado_Modulo(id_modulo, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._CambiarEstadoModulo, [id_modulo, estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Rol_Modulo(id_modulo, rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._BuscarRolModulo, [id_modulo, rol]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Editar_Rol_Modulo(rol_modulo, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.client.query(DaoModulo_1._EditarRolModulo, [rol_modulo, estado]);
                return result.rowCount;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.default = QueryModulo;
