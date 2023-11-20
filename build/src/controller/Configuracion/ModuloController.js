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
const Modulo_service_1 = __importDefault(require("../../services/Configuracion/Modulo.service"));
const constants_1 = require("../../helpers/constants");
const Configuracion_Zod_1 = require("../../validations/Configuracion.Zod");
class _ModuloController {
    Obtener_Modulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _ModuloService = new Modulo_service_1.default();
                const respuesta = yield _ModuloService.Obtener_Modulos(+estado);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los modulos' }); //!ERROR
            }
        });
    }
    Insertar_Modulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { cod_modulo, nombre_modulo, icono, roles } = req.body; //EXTRAER LA INFORMACION DEL MODULO A CREAR
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!nombre_modulo || nombre_modulo === "") {
                return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el modulo' }); //!ERROR
            }
            if (!cod_modulo || cod_modulo === "") {
                return res.status(400).json({ error: true, message: 'Debe ingresar un codigo para el modulo' }); //!ERROR
            }
            if (!icono || icono === "") {
                return res.status(400).json({ error: true, message: 'Debe ingresar un icono para el modulo' }); //!ERROR
            }
            if (roles.length <= 0) {
                return res.status(400).json({ error: true, message: 'El modulo debe tener por lo menos un rol' }); //!ERROR
            }
            const rol = roles.filter((rol) => rol.id_rol === 1);
            if ((rol === null || rol === void 0 ? void 0 : rol.length) <= 0) {
                return res.status(400).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }); //!ERROR
            }
            const result = Configuracion_Zod_1.ModulosSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const _ModuloService = new Modulo_service_1.default();
                const respuesta = yield _ModuloService.Insertar_Modulo(cod_modulo, nombre_modulo, icono, usuario === null || usuario === void 0 ? void 0 : usuario.usuario, roles);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los modulos' }); //!ERROR
            }
        });
    }
    Buscar_Modulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_modulo } = req.params; //EXTRAER LA INFORMACION DEL MODULO A CREAR
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_modulo || !+id_modulo) {
                return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }); //!ERROR
            }
            try {
                const _ModuloService = new Modulo_service_1.default();
                const modulo = yield _ModuloService.Buscar_Modulo(+id_modulo);
                if (modulo === null || modulo === void 0 ? void 0 : modulo.error) {
                    return res.status(400).json({ error: true, message: modulo.message }); //!ERROR
                }
                return res.status(200).json(modulo);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al encontrar el modulo' }); //!ERROR
            }
        });
    }
    Editar_Modulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_modulo } = req.params;
            const { cod_modulo, nombre_modulo, icono, roles } = req.body; //EXTRAER LA INFORMACION DEL MODULO A CREAR
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_modulo) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el modulo' }); //!ERROR
            }
            if (!cod_modulo || cod_modulo === "") {
                return res.status(400).json({ error: true, message: 'No se ha definido el codigo del modulo' }); //!ERROR
            }
            if (!nombre_modulo || nombre_modulo === "") {
                return res.status(400).json({ error: true, message: 'No se ha definido el nombre del modulo' }); //!ERROR
            }
            if (!icono || icono === "") {
                return res.status(400).json({ error: true, message: 'No se ha definido el icono del modulo' }); //!ERROR
            }
            if (roles.length <= 0) {
                return res.status(400).json({ error: true, message: 'El modulo debe tener por lo menos un rol' }); //!ERROR
            }
            const rol = roles.filter((rol) => rol.id_rol === 1);
            if ((rol === null || rol === void 0 ? void 0 : rol.length) <= 0) {
                return res.status(400).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }); //!ERROR
            }
            // VALIDACIONES CON LIBRERIA ZOD
            const result = Configuracion_Zod_1.ModulosSchema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const _ModuloService = new Modulo_service_1.default();
                const modulo = yield _ModuloService.Editar_Modulo(+id_modulo, req.body, usuario.usuario, roles);
                if (modulo === null || modulo === void 0 ? void 0 : modulo.error) {
                    return res.status(400).json({ error: true, message: modulo.message }); //!ERROR
                }
                const moduloEditado = yield _ModuloService.Buscar_Modulo(+id_modulo);
                if (moduloEditado.error) {
                    return res.status(400).json({ error: true, message: 'No se ha podido encontrar el modulo' }); //!ERROR             
                }
                return res.status(200).json(moduloEditado); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el modulo' }); //!ERROR             
            }
        });
    }
    Cambiar_Estado_Modulo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_modulo } = req.params;
            const { usuario } = req;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_modulo) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el modulo' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const _ModuloService = new Modulo_service_1.default();
                const respuesta = yield _ModuloService.Cambiar_Estado_Modulo(+id_modulo, +estado);
                if (respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el modulo' : 'Se ha desactivado el modulo' }); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el modulo' : 'Error al desactivar del modulo' }); //!ERROR
            }
        });
    }
}
exports.default = _ModuloController;
