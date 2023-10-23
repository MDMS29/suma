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
exports._RolController = void 0;
const Rol_service_1 = require("../services/Rol.service");
const utils_1 = require("../validations/utils");
class _RolController {
    Obtener_Roles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!estado) {
                return res.status(404).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _RolService = new Rol_service_1.RolService();
                const respuesta = yield _RolService.Obtener_Roles(+estado);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(404).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los roles' }); //!ERROR
            }
        });
    }
    Insertar_Rol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { nombre, descripcion } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!nombre) {
                return res.status(404).json({ error: true, message: 'Debe ingresar un nombre al rol' }); //!ERROR
            }
            if (!descripcion) {
                return res.status(404).json({ error: true, message: 'Debe ingresar una descripcion al rol' }); //!ERROR
            }
            try {
                const _RolService = new Rol_service_1.RolService();
                const respuesta = yield _RolService.Insertar_Rol(nombre, descripcion, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(404).json(respuesta);
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el reol' }); //!ERROR
            }
        });
    }
    Buscar_Rol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_rol } = req.params;
            const { usuario } = req;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_rol) {
                return res.json({ error: true, message: 'No se ha encontrado el rol' }); //!ERROR
            }
            try {
                const _RolService = new Rol_service_1.RolService();
                const respuesta = yield _RolService.Buscar_Rol(+id_rol);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar el rol' }); //!ERROR
            }
        });
    }
    Editar_Rol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_rol } = req.params;
            const { nombre, descripcion } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_rol) {
                return res.status(404).json({ error: true, message: 'No se ha encontrado el rol' }); //!ERROR
            }
            if (!nombre) {
                return res.status(404).json({ error: true, message: 'Ingrese el nombre del rol' }); //!ERROR
            }
            if (!descripcion) {
                return res.status(404).json({ error: true, message: 'Ingrese al descripcion del rol' }); //!ERROR
            }
            // const result = PerfilesSchema.safeParse(req.body)
            // if (!result.success) {
            //     return res.status(404).json({ error: true, message: result.error.issues }) //!ERROR
            // }
            try {
                const _RolService = new Rol_service_1.RolService();
                const respuesta = yield _RolService.Editar_Rol(+id_rol, nombre, descripcion, usuario.usuario);
                if (respuesta.error) {
                    return res.status(404).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield _RolService.Buscar_Rol(+id_rol);
                if (!response) {
                    return res.status(404).json({ error: true, message: 'Error al editar el rol' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el rol' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Rol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_rol } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_rol) {
                return res.json({ error: true, message: 'No se ha encontrado el rol' }); //!ERROR
            }
            if (!estado) {
                return res.json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _RolService = new Rol_service_1.RolService();
                const respuesta = yield _RolService.Cambiar_Estado_Rol(+id_rol, +estado);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json({ error: false, message: +estado === utils_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el rol' : 'Se ha desactivado el rol' }); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: +estado === utils_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el rol' : 'Error al desactivar el rol' }); //!ERROR
            }
        });
    }
}
exports._RolController = _RolController;
