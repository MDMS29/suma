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
exports._PerfilController = void 0;
const Perfil_service_1 = require("../services/Perfil.service");
const UsuarioSchemas_1 = require("../validations/UsuarioSchemas");
const utils_1 = require("../validations/utils");
class _PerfilController {
    ObtenerPerfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!estado) {
                return res.json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.ObtenerPerfiles(+estado);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al obtener los perfiles' }); //!ERROR
            }
        });
    }
    ObtenerModulosPerfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { perfiles } = req.body
            const { usuario } = req;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!req.body || req.body.length <= 0) {
                return res.json({ error: true, message: 'Debe asignar perfiles' }); //!ERROR
            }
            try {
                const Perfil_Service = new Perfil_service_1.PerfilService();
                //OBTENER LOS MODULOS DE LOS PERFILES
                const respuesta = yield Perfil_Service.ObtenerModulosPerfil(req.body);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al cargar los modulos del perfil' }); //!ERROR
            }
        });
    }
    InsertarPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { nombre_perfil, modulos } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!nombre_perfil) {
                return res.json({ error: true, message: 'Debe ingresar un nombre al perfil' }); //!ERROR
            }
            if (modulos.length <= 0) {
                return res.json({ error: true, message: 'El perfil debe tener al menos un modulo' }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.InsertarPerfil(nombre_perfil, usuario.usuario, modulos);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta);
                }
                return res.json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al crear el perfil' }); //!ERROR
            }
        });
    }
    EditarPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_perfil } = req.params;
            const { nombre_perfil, modulos } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_perfil) {
                return res.json({ error: true, message: 'No se ha encontrado el perfil' }); //!ERROR
            }
            if (!nombre_perfil) {
                return res.json({ error: true, message: 'Ingrese el nombre del perfil' }); //!ERROR
            }
            if (modulos.length <= 0) {
                return res.json({ error: true, message: 'El perfil debe tener al menos un modulo' }); //!ERROR
            }
            const result = UsuarioSchemas_1.PerfilesSchema.safeParse(req.body);
            if (!result.success) {
                return res.json({ error: true, message: result.error.issues }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.EditarPerfil(+id_perfil, nombre_perfil, usuario.usuario);
                if (respuesta.error) {
                    return res.json({ error: respuesta.error, message: respuesta.message });
                }
                const modulosEditado = yield _PerfilService.EditarModulosPerfil(+id_perfil, modulos);
                if (modulosEditado.error) {
                    return res.json({ error: modulosEditado.error, message: modulosEditado.message });
                }
                return res.json({ error: false, message: 'Perfil editado correctamente' }); //*SUCCESS
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al editar el perfil' }); //!ERROR
            }
        });
    }
    CambiarEstadoPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_perfil } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_perfil) {
                return res.json({ error: true, message: 'No se ha encontrado el perfil' }); //!ERROR
            }
            if (!estado) {
                return res.json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.CambiarEstadoPerfil(+id_perfil, +estado);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json({ error: true, message: +estado === utils_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el perfil' : 'Se ha desactivado el perfil' }); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: +estado === utils_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el perfil' : 'Error al desactivar del perfil' }); //!ERROR
            }
        });
    }
}
exports._PerfilController = _PerfilController;
