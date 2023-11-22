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
const constants_1 = require("../../helpers/constants");
const Menu_service_1 = require("../../services/Configuracion/Menu.service");
const Configuracion_Zod_1 = require("../../validations/Configuracion.Zod");
class _MenuController {
    Obtener_Menus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO
            const { id_modulo } = req.params;
            const { estado } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_modulo) {
                return res.status(400).json({ error: true, message: 'No se ha definido el modulo a consultar' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const menu_service = new Menu_service_1.MenuService();
                const respuesta = yield menu_service.Obtener_Menus(+estado, +id_modulo);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los menus del modulo' }); //!ERROR
            }
        });
    }
    Insertar_Menu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO
            const { id_modulo } = req.params;
            const { nombre_menu, link_menu } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_modulo) {
                return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }); //!ERROR
            }
            if (!nombre_menu || nombre_menu === "") {
                return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }); //!ERROR
            }
            if (!link_menu || link_menu === "") {
                return res.status(400).json({ error: true, message: 'Debe ingresar una url para el menu' }); //!ERROR
            }
            const result = Configuracion_Zod_1.MenuSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const menu_service = new Menu_service_1.MenuService();
                const respuesta = yield menu_service.Insertar_Menu(nombre_menu, link_menu, id_modulo, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta);
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el menu' }); //!ERROR
            }
        });
    }
    Buscar_Menu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_menu } = req.params;
            const { usuario } = req;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_menu) {
                return res.json({ error: true, message: 'No se ha encontrado el menu' }); //!ERROR
            }
            try {
                const menu_service = new Menu_service_1.MenuService();
                const respuesta = yield menu_service.Buscar_Menu(+id_menu);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar el menu' }); //!ERROR
            }
        });
    }
    Editar_Menu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_menu } = req.params;
            const { nombre_menu, link_menu } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_menu) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el rol' }); //!ERROR
            }
            if (!nombre_menu || nombre_menu === "") {
                return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }); //!ERROR
            }
            if (!link_menu || link_menu === "") {
                return res.status(400).json({ error: true, message: 'Debe ingresar una url para el menu' }); //!ERROR
            }
            const result = Configuracion_Zod_1.MenuSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const menu_service = new Menu_service_1.MenuService();
                const respuesta = yield menu_service.Editar_menu(+id_menu, nombre_menu, link_menu, usuario.usuario);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield menu_service.Buscar_Menu(+id_menu);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar el rol' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el rol' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Menu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_menu } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_menu) {
                return res.json({ error: true, message: 'No se ha encontrado el menu' }); //!ERROR
            }
            if (!estado) {
                return res.json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const menu_service = new Menu_service_1.MenuService();
                const respuesta = yield menu_service.Cambiar_Estado_Menu(+id_menu, +estado);
                if (respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el menu' : 'Se ha desactivado el menu' }); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el menu' : 'Error al desactivar el menu' }); //!ERROR
            }
        });
    }
}
exports.default = _MenuController;
