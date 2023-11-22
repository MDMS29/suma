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
const DaoMenu_1 = require("../dao/DaoMenu");
class QueryMenu {
    Obtener_Menus(estado, id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoMenu_1._Obtener_Menu, [estado, id_modulo]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Menu(nombre_rol, link_menu, id_modulo, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ultimo_id = yield db_1.client.query(DaoMenu_1._ObtenerUltimoIDMenu);
                ultimo_id = ultimo_id.rows[0].id_menu + 1;
                let result = yield db_1.client.query(DaoMenu_1._InsertarMenu, [ultimo_id, nombre_rol, link_menu, id_modulo, usuario_creacion]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Menu_Nombre(nombre_menu) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoMenu_1._BuscarMenuNombre, [nombre_menu]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Menu_ID(id_menu) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoMenu_1._BuscarMenuID, [id_menu]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Editar_Menu(id_menu, nombre_editado, link_menu, usuario_modificacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoMenu_1._EditarMenu, [id_menu, nombre_editado, link_menu, usuario_modificacion]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Cambiar_Estado_Menu(id_menu, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield db_1.client.query(DaoMenu_1._CambiarEstadoMenu, [id_menu, estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.default = QueryMenu;
