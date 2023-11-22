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
const constants_1 = require("../../helpers/constants");
const Empresa_service_1 = __importDefault(require("../../services/Configuracion/Empresa.service"));
class _EmpresaController {
    Obtener_Empresas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const empresa_service = new Empresa_service_1.default();
                const respuesta = yield empresa_service.Obtener_Empresas(+estado);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener las empresas del sistema' }); //!ERROR
            }
        });
    }
    Insertar_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            // const { id_modulo } = req.params
            const { nit, razon_social, telefono, direccion, correo } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!nit || nit === "") {
                return res.status(400).json({ error: true, message: 'Ingrese el nit de la empresa' }); //!ERROR
            }
            if (!razon_social || razon_social === "") {
                return res.status(400).json({ error: true, message: 'Ingrese la razón social de la empresa' }); //!ERROR
            }
            if (!telefono || telefono === "") {
                return res.status(400).json({ error: true, message: 'Ingrese el teléfono de la empresa' }); //!ERROR
            }
            if (!direccion || direccion === "") {
                return res.status(400).json({ error: true, message: 'Ingrese la dirección de la empresa' }); //!ERROR
            }
            if (!correo || correo === "") {
                return res.status(400).json({ error: true, message: 'Ingrese el correo de la empresa' }); //!ERROR
            }
            try {
                const empresa_service = new Empresa_service_1.default();
                const respuesta = yield empresa_service.Insertar_Empresa(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta);
                }
                return res.status(201).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el menu' }); //!ERROR
            }
        });
    }
    Buscar_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa } = req.params;
            const { usuario } = req;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            try {
                const empresa_service = new Empresa_service_1.default();
                const respuesta = yield empresa_service.Buscar_Empresa(+id_empresa);
                if (respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar la empresa' }); //!ERROR
            }
        });
    }
    Editar_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_empresa } = req.params;
            const { nit, razon_social, telefono, direccion, correo } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!nit || nit === "") {
                return res.status(400).json({ error: true, message: 'Ingrese el nit de la empresa' }); //!ERROR
            }
            if (!razon_social || razon_social === "") {
                return res.status(400).json({ error: true, message: 'Ingrese la razon social de la empresa' }); //!ERROR
            }
            if (!telefono || telefono === "") {
                return res.status(400).json({ error: true, message: 'Ingrese el telefono de la empresa' }); //!ERROR
            }
            if (!direccion || direccion === "") {
                return res.status(400).json({ error: true, message: 'Ingrese la direccion de la empresa' }); //!ERROR
            }
            if (!correo || correo === "") {
                return res.status(400).json({ error: true, message: 'Ingrese el correo de la empresa' }); //!ERROR
            }
            // const result = PerfilesSchema.safeParse(req.body)
            // if (!result.success) {
            //     return res.status(400).json({ error: true, message: result.error.issues }) //!ERROR
            // }
            try {
                const menu_service = new Empresa_service_1.default();
                const respuesta = yield menu_service.Editar_Empresa(id_empresa, req.body, usuario.usuario);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield menu_service.Buscar_Empresa(+id_empresa);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar la empresa' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar la empresa' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_empresa } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!estado) {
                return res.json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const empresa_service = new Empresa_service_1.default();
                const respuesta = yield empresa_service.Cambiar_Estado_Empresa(+id_empresa, +estado);
                if (respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado la empresa' : 'Se ha desactivado la empresa' }); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar la empresa' : 'Error al desactivar la empresa' }); //!ERROR
            }
        });
    }
}
exports.default = _EmpresaController;
