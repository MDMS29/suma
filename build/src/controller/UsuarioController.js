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
exports._UsuarioController = void 0;
const Service_Usuario_1 = require("../services/Service.Usuario");
const utils_1 = require("../validations/utils");
const UsuarioSchemas_1 = require("../validations/UsuarioSchemas");
class _UsuarioController {
    //FUNCIÓN PARA AUTENTICAR EL USUARIO POR SU USUARIO Y CLAVE INGRESADA
    AutenticarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //TOMAR LA INFORMACIÓN DEL USUARIO ENVIADO
            const { usuario, clave, captcha } = req.body;
            //VERIFICACIÓN DEL CAPTCHA
            if (captcha === '') {
                return res.send({ error: true, message: 'Debe realizar el CAPTCHA' });
            }
            try {
                //INICIALIZAR SERVICIO
                const ServiceUsuario = new Service_Usuario_1._UsuarioService();
                //ORGANIZAR INFORMACIÓN CLAVE PARA LA AUTENTICACIÓN
                const UsuarioLogin = {
                    usuario: (0, utils_1._ParseCorreo)(usuario),
                    clave: (0, utils_1._ParseClave)(clave)
                };
                //SERVICIO PARA LA AUTENTICACIÓN
                const val = yield ServiceUsuario.AutenticarUsuario(UsuarioLogin);
                //VERFICICARIÓN DE DATOS RETORNADOS
                if (!val) {
                    //RESPUESTA AL CLIENTE
                    return res.json({ error: true, message: 'Usuario o contraseña invalido' });
                }
                //RESPUESTA AL CLIENTE
                return res.status(200).json(val);
            }
            catch (error) {
                //RESPUESTA AL CLIENTE EN CASO DE ERROR AL REALIZAR LA CONSULTA
                return res.status(400).send(error);
            }
        });
    }
    ObtenerUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) {
                return res.json({ error: true, message: 'Inicie sesion para continuar' });
            }
            try {
                //INICIALIZAR SERVICIO
                const ServiceUsuario = new Service_Usuario_1._UsuarioService();
                //SERVICIO PARA OBTENER LOS USUARIOS
                const respuesta = yield ServiceUsuario.ObtenerUsuarios(estado);
                //RETORNAR LAS RESPUESTAS DEL SERVICIO
                return res.json(respuesta);
            }
            catch (error) {
                return res.json({ error: true, message: 'Error al obtener los usuarios' });
            }
        });
    }
    PerfilUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            res.json(usuario);
        });
    }
    BuscarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ServiceUsuario = new Service_Usuario_1._UsuarioService();
            const { id_usuario } = req.params;
            if (id_usuario) {
                const respuesta = yield ServiceUsuario.BuscarUsuario(+id_usuario, 'param');
                if (!respuesta) {
                    return res.json({ error: true, message: 'Usuario no encontrado' });
                }
                res.statusCode = 200;
                return res.status(200).json(respuesta);
            }
            return res.status(404).json({ message: '' });
        });
    }
    CrearUsuario(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const ServiceUsuario = new Service_Usuario_1._UsuarioService();
            if (!((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id_usuario)) {
                return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" });
            }
            const result = UsuarioSchemas_1.UsusarioSchema.safeParse(req.body); //Validación de datos con librería zod
            if (!result.success) {
                const error = result.error.issues;
                return res.status(400).json(error);
            }
            const respuesta = yield ServiceUsuario.InsertarUsuario(result.data, (_b = req.usuario) === null || _b === void 0 ? void 0 : _b.usuario);
            if (!respuesta.error) {
                return res.status(201).json(respuesta);
            }
            else {
                return res.status(400).json(respuesta);
            }
        });
    }
    EditarUsuario(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, perfiles, permisos } = req.body;
            const { id_usuario } = req.params;
            // console.log(perfiles.length <= 0)
            //VALIDACION DE DATOS
            if (!id_usuario) {
                return res.json({ error: true, message: "Usuario no definido" });
            }
            if ((perfiles === null || perfiles === void 0 ? void 0 : perfiles.length) <= 0) {
                return res.json({ error: true, message: "Debe asignarle al menos un perfil al usuario" });
            }
            if ((permisos === null || permisos === void 0 ? void 0 : permisos.length) <= 0) {
                return res.json({ error: true, message: "Debe asignarle permisos al usuario" });
            }
            const result = UsuarioSchemas_1.UsusarioSchema.partial().safeParse(usuario);
            if (!result.success) {
                const error = result.error.issues;
                return res.status(400).json(error);
            }
            //INICIALIZAR SERVICIO
            const ServiceUsuario = new Service_Usuario_1._UsuarioService();
            //SERVICIO PARA EDITAR EL USUARIO
            const respuesta = yield ServiceUsuario.EditarUsuario(result.data, (_a = req.usuario) === null || _a === void 0 ? void 0 : _a.usuario);
            if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                return res.json(respuesta);
            }
            const perfil = yield ServiceUsuario.EditarPerfilesUsuario(perfiles, usuario.id_usuario);
            console.log(perfil);
            return res.json(result.data);
        });
    }
}
exports._UsuarioController = _UsuarioController;
