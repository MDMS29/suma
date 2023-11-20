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
exports.MenuService = void 0;
const QueryMenu_1 = __importDefault(require("../querys/QueryMenu"));
class MenuService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Menu = new QueryMenu_1.default();
    }
    Obtener_Menus(estado, id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!estado) {
                return { error: true, message: 'Estado no definido' }; //!ERROR
            }
            try {
                const respuesta = yield this._Query_Menu.Obtener_Menus(estado, id_modulo);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: false, message: 'No se han encontrado menus' }; //!ERROR
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los menus' }; //!ERROR
            }
        });
    }
    Insertar_Menu(nombre, link_menu, id_modulo, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //VALIDAR SI EL MENU EXISTE
                const BMenu = yield this._Query_Menu.Buscar_Menu_Nombre(nombre);
                if ((BMenu === null || BMenu === void 0 ? void 0 : BMenu.length) > 0) {
                    return { error: true, message: 'Ya existe este menu' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR MENU
                const respuesta = yield this._Query_Menu.Insertar_Menu(nombre, link_menu.toLowerCase(), id_modulo, usuario_creacion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el menu' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
                const menu = yield this._Query_Menu.Buscar_Menu_ID(respuesta[0].id_menu);
                if (!menu) {
                    return { error: true, message: 'No se ha encontrado el menu' }; //!ERROR
                }
                return menu[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el menu' }; //!ERROR
            }
        });
    }
    Buscar_Menu(id_menu) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menu = yield this._Query_Menu.Buscar_Menu_ID(id_menu);
                if (!menu) {
                    return { error: true, message: 'No se ha encontrado este menu' }; //!ERROR
                }
                return menu[0];
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el menu' };
            }
        });
    }
    Editar_menu(id_menu, nombre, link_menu, usuario_modificacion) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let nombre_editado;
            let link_menu_editado;
            try {
                const BMenu = yield this._Query_Menu.Buscar_Menu_Nombre(nombre);
                if ((BMenu === null || BMenu === void 0 ? void 0 : BMenu.length) > 0 && BMenu[0].nombre_menu !== nombre) {
                    return { error: true, message: 'Ya existe este menu' }; //!ERROR
                }
                const respuesta = yield this._Query_Menu.Buscar_Menu_ID(id_menu);
                if (((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.nombre_menu) === nombre) {
                    nombre_editado = (_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.nombre_menu;
                }
                else {
                    nombre_editado = nombre;
                }
                if (((_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.link_menu) === link_menu) {
                    link_menu_editado = (_d = respuesta[0]) === null || _d === void 0 ? void 0 : _d.link_menu;
                }
                else {
                    link_menu_editado = link_menu;
                }
                const res = yield this._Query_Menu.Editar_Menu(id_menu, nombre_editado, link_menu_editado.toLowerCase(), usuario_modificacion);
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el menu' }; //!ERROR
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar menu' }; //!ERROR
            }
        });
    }
    Cambiar_Estado_Menu(id_menu, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const menu_editado = yield this._Query_Menu.Cambiar_Estado_Menu(id_menu, estado);
                if (!(menu_editado === null || menu_editado === void 0 ? void 0 : menu_editado.rowCount)) {
                    return { error: true, message: 'Error al editar el menu' }; //!ERROR
                }
                return { error: false, message: 'Se ha cambiado el estado del menu' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el menu' }; //!ERROR
            }
        });
    }
}
exports.MenuService = MenuService;
