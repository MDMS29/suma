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
const Perfil_service_1 = require("../../services/Configuracion/Perfil.service");
const Configuracion_Zod_1 = require("../../validations/Configuracion.Zod");
const constants_1 = require("../../helpers/constants");
class _PerfilController {
    Obtener_Perfiles(req, res) {
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
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.Obtener_Perfiles(+estado);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(404).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los perfiles' }); //!ERROR
            }
        });
    }
    Obtener_Modulos_Perfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { perfiles } = req.body
            const { usuario } = req;
            // const { perfiles } = req.body
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!req.body || req.body.length <= 0) {
                return res.status(404).json({ error: true, message: 'Debe asignar perfiles' }); //!ERROR
            }
            try {
                const Perfil_Service = new Perfil_service_1.PerfilService();
                //OBTENER LOS MODULOS DE LOS PERFILES
                const respuesta = yield Perfil_Service.Obtener_Modulos_Perfil(req.body);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(404).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al cargar los modulos del perfil' }); //!ERROR
            }
        });
    }
    Insertar_Perfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { nombre_perfil, modulos } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!nombre_perfil || nombre_perfil === "") {
                return res.status(404).json({ error: true, message: 'Debe ingresar un nombre al perfil' }); //!ERROR
            }
            if (modulos.length <= 0) {
                return res.status(404).json({ error: true, message: 'El perfil debe tener al menos un modulo' }); //!ERROR
            }
            const zod_validacion = Configuracion_Zod_1.PerfilesSchema.safeParse(req.body);
            if (!zod_validacion.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: zod_validacion.error.issues[0].message }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.Insertar_Perfil(nombre_perfil, usuario.usuario, modulos);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(404).json(respuesta);
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el perfil' }); //!ERROR
            }
        });
    }
    Editar_Perfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_perfil } = req.params;
            const { nombre_perfil, modulos } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_perfil) {
                return res.status(404).json({ error: true, message: 'No se ha encontrado el perfil' }); //!ERROR
            }
            if (!nombre_perfil || nombre_perfil === "") {
                return res.status(404).json({ error: true, message: 'Debe ingresar un nombre al perfil' }); //!ERROR
            }
            if (modulos.length <= 0) {
                return res.status(404).json({ error: true, message: 'El perfil debe tener al menos un modulo' }); //!ERROR
            }
            const result = Configuracion_Zod_1.PerfilesSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(404).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.Editar_Perfil(+id_perfil, nombre_perfil, usuario.usuario);
                if (respuesta.error) {
                    return res.status(404).json({ error: respuesta.error, message: respuesta.message });
                }
                const modulosEditado = yield _PerfilService.Editar_Modulos_Perfil(+id_perfil, modulos);
                if (modulosEditado.error) {
                    return res.status(404).json({ error: modulosEditado.error, message: modulosEditado.message });
                }
                const perfil = yield _PerfilService.Buscar_Perfil(+id_perfil);
                return res.status(200).json(perfil); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el perfil' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Perfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_perfil } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_perfil) {
                return res.json({ error: true, message: 'No se ha encontrado el perfil' }); //!ERROR
            }
            if (!estado) {
                return res.json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.Cambiar_Estado_Perfil(+id_perfil, +estado);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json({ error: false, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el perfil' : 'Se ha desactivado el perfil' }); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el perfil' : 'Error al desactivar del perfil' }); //!ERROR
            }
        });
    }
    Buscar_Perfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_perfil } = req.params;
            const { usuario } = req;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_perfil) {
                return res.json({ error: true, message: 'No se ha encontrado el perfil' }); //!ERROR
            }
            try {
                const _PerfilService = new Perfil_service_1.PerfilService();
                const respuesta = yield _PerfilService.Buscar_Perfil(+id_perfil);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar el perfil' }); //!ERROR
            }
        });
    }
}
exports._PerfilController = _PerfilController;
