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
const Usuario_service_1 = __importDefault(require("../services/Usuario.service"));
const utils_1 = require("../validations/utils");
const UsuarioSchemas_1 = require("../validations/UsuarioSchemas");
const resend_1 = require("resend");
class UsuarioController {
    AutenticarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //TOMAR LA INFORMACIÓN DEL USUARIO ENVIADO
            const { usuario, clave, captcha } = req.body;
            //VERIFICACIÓN DEL CAPTCHA
            if (captcha === '') {
                return res.send({ error: true, message: 'Debe realizar el CAPTCHA' }); //!ERROR
            }
            try {
                //ORGANIZAR INFORMACIÓN CLAVE PARA LA AUTENTICACIÓN
                const UsuarioLogin = {
                    usuario: (0, utils_1._ParseCorreo)(usuario),
                    clave: (0, utils_1._ParseClave)(clave)
                };
                const _Usuario_Service = new Usuario_service_1.default();
                //SERVICIO PARA LA AUTENTICACIÓN
                const val = yield _Usuario_Service.AutenticarUsuario(UsuarioLogin);
                //VERFICICARIÓN DE DATOS RETORNADOS
                if (!val) {
                    //RESPUESTA AL CLIENTE
                    return res.json({ error: true, message: 'Usuario o contraseña invalido' }); //!ERROR
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
            const { usuario } = req; //TOMAR LA INFORMACION DEL MIDDLEWARE
            // const { estado } = req.body
            const { estado } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' });
            }
            try {
                const _Usuario_Service = new Usuario_service_1.default();
                //SERVICIO PARA OBTENER LOS USUARIOS
                const respuesta = yield _Usuario_Service.ObtenerUsuarios(estado);
                if (!respuesta) {
                    return res.json({ error: true, message: 'No se han encontrado usuarios activos' }); //!ERROR
                }
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
            const { usuario } = req; //TOMAR LA INFORMACION DEL MIDDLEWARE
            res.json(usuario); //ENVIAR LA INFORMACION DEL MIDDLEWARE
        });
    }
    BuscarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params; //OBTENER LA ID DEL USUARIO POR PARAMETROS
            try {
                const _Usuario_Service = new Usuario_service_1.default();
                if (id_usuario) { //VALIDAR ID
                    const respuesta = yield _Usuario_Service.BuscarUsuario(+id_usuario, 'param'); //INVOCAR LA FUNCION PARA BUSCAR EL USUARIO
                    if (!respuesta) { //VALIDAR SI NO HAY RESPUESTA
                        return res.json({ error: true, message: 'No se ha encontrado al usuario' }); //!ERROR
                    }
                    return res.json(respuesta); //RETORNAR AL USUARIO LA INFORMACION ENCONTRADA
                }
                return res.json({ error: true, message: 'Error al buscar el usuario' }); //!ERROR
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al buscar el usuario' }); //!ERROR
            }
        });
    }
    CrearUsuario(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id_usuario)) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
                return res.json({ error: true, message: "Debe inicar sesión para realizar esta acción" }); //!ERROR
            }
            const result = UsuarioSchemas_1.UsusarioSchema.safeParse(req.body); //VALIDACION DE LOS DATOS CON LA LIBRERIA ZOD
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.json({ error: true, message: result.error.issues }); //!ERROR
            }
            try {
                const _Usuario_Service = new Usuario_service_1.default();
                const respuesta = yield _Usuario_Service.InsertarUsuario(result.data, (_b = req.usuario) === null || _b === void 0 ? void 0 : _b.usuario); //INVOCAR FUNCION PARA INSERTAR EL USUARIO
                if (respuesta.error) { //SI LA RESPUESTA LLEGA CORRECTAMENTE
                    return res.json(respuesta); //!ERROR
                }
                //TOMAR LA INFORMACION PERSONALIZADA PARA ENVIARLA HACIA EL CLIENTE
                const { id_usuario, nombre_completo, usuario, id_estado, correo, estado_usuario } = respuesta;
                return res.json({
                    id_usuario,
                    nombre_completo,
                    usuario,
                    id_estado,
                    estado_usuario,
                    correo
                }); //ENVIAR LA INFORMACION DEL USUARIO CREADO
            }
            catch (error) {
                return res.json({ error: true, message: 'Error al crear el usuario' }); //!ERROR
            }
        });
    }
    EditarUsuario(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, perfiles, roles } = req.body; //OBTENER LA INFORMACION ENVIADA
            const { id_usuario } = req.params; //OBTENER EL ID DEL USUARIO POR PARAMETROS
            //VALIDACION DE DATOS
            if (!((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id_usuario)) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
                return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }); //!Error
            }
            if (!id_usuario) { //VALIDAR QUE SI SE HA ENVIADO UN ID
                return res.json({ error: true, message: "Usuario no definido" }); //!ERROR
            }
            if ((perfiles === null || perfiles === void 0 ? void 0 : perfiles.length) <= 0) { //VALIDAR QUE SI SE ESTEN AGREGANDO PERFILES
                return res.json({ error: true, message: "Debe asignarle al menos un perfil al usuario" }); //!ERROR
            }
            if ((roles === null || roles === void 0 ? void 0 : roles.length) <= 0) { //VALIDAR QUE SI SE ESTEN AGREGANDO ROLES
                return res.json({ error: true, message: "Debe asignarle permisos al usuario" }); //!ERROR
            }
            const result = UsuarioSchemas_1.UsusarioSchema.partial().safeParse(usuario); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.json({ error: true, message: result.error.issues }); //!ERROR
            }
            try {
                const _Usuario_Service = new Usuario_service_1.default();
                const respuesta = yield _Usuario_Service.EditarUsuario(result.data, (_b = req.usuario) === null || _b === void 0 ? void 0 : _b.usuario); //INVOCAR FUNCION PARA EDITAR EL USUARIO
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) { //VALIDAR SI HAY UN ERROR
                    return res.json(respuesta); //!ERROR
                }
                const perfilesEditados = yield _Usuario_Service.EditarPerfilesUsuario(perfiles, usuario.id_usuario); //INVOCAR FUNCION PARA EDITAR LOS PERFILES DEL USUARIO
                if (perfilesEditados === null || perfilesEditados === void 0 ? void 0 : perfilesEditados.error) { //VALIDAR SI HAY UN ERROR
                    return res.json(perfilesEditados); //!ERROR
                }
                const permisoEditado = yield _Usuario_Service.EditarPermisosUsuario(roles, usuario.id_usuario); //INVOCAR FUNCION PARA EDITAR LOS ROLES DEL USUARIO
                if (permisoEditado === null || permisoEditado === void 0 ? void 0 : permisoEditado.error) { //VALIDAR SI HAY UN ERROR
                    return res.json(permisoEditado); //!ERROR
                }
                const usuarioEditado = yield _Usuario_Service.BuscarUsuario(+id_usuario, 'param');
                if (!usuarioEditado) { //VALIDAR SI HAY UN ERROR
                    return res.json({ error: true, message: 'Usuario no encontrado' });
                }
                return res.json(usuarioEditado); //RETORNO DE USUARIO EDITADO
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al editar el usuario' }); //!ERROR
            }
        });
    }
    CambiarEstadoUsuario(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params; //OBTENER EL ID DEL USUARIO ENVIADO POR PARAMETROS
            let { estado } = req.query; //OBTENER EL ESTADO QUE TENDRA EL USUARIO
            if (!((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id_usuario)) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
                return res.json({ error: true, message: "Debe inicar sesión para realizar esta acción" }); //!ERROR
            }
            if (!id_usuario) { //VALIDAR SI SE ESTA ENVIANDO UN ID VALIDO
                return res.json({ error: true, message: "Usuario no definido" });
            }
            if (!estado) { //VALIDAR SI EL ESTADO EXISTE
                return res.json({ error: true, message: "Estado no definido" });
            }
            if (typeof estado === 'string') {
                //CONVERSION DEL ESTADO STRING A NUMBER PARA ENVIARLO AL SERVICE
                // estado = +estado
                // if (!estado) {
                //     return res.json({ error: true, message: "Estado no definido" }) //VALIDAR SI EL ESTADO ES UN VALOR VALIDO
                // }
            }
            try {
                const _Usuario_Service = new Usuario_service_1.default();
                const busqueda = yield _Usuario_Service.CambiarEstadoUsuario({ usuario: +id_usuario, estado: estado }); //INVOCAR FUNCION PARA CAMBIAR EL ESTADO DEL USUARIO
                if (busqueda === null || busqueda === void 0 ? void 0 : busqueda.error) { //VALIDAR SI HAY ALGUN ERROR
                    return res.json(busqueda); //!ERROR
                }
                //ENVIAR INFORMACION DEPENDIENDO DEL ESTADO
                return res.json({ error: false, message: +estado == utils_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el usuario' : 'Se ha desactivado el usuario' });
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: +estado === utils_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el usuario' : 'Error al desactivar el usuario' }); //!ERROR
            }
        });
    }
    CambiarClaveUsuario(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = req.params; //OBTENER EL ID DEL USUARIO ENVIADO POR PARAMETROS
            if (!((_a = req.usuario) === null || _a === void 0 ? void 0 : _a.id_usuario)) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
                return res.json({ error: true, message: "Debe inicar sesión para realizar esta acción" }); //!ERROR
            }
            if (!id_usuario) { //VALIDAR SI SE ESTA ENVIANDO UN ID VALIDO
                return res.json({ error: true, message: "Usuario no definido" }); //!ERROR
            }
            try {
                const _Usuario_Service = new Usuario_service_1.default();
                let clave = (0, utils_1.GenerarLlavesSecretas)();
                if (clave === '') {
                    return res.json({ error: true, message: 'Error al generar clave' }); //!ERROR
                }
                const Usuario_Change = yield _Usuario_Service.CambiarClaveUsuario(+id_usuario, clave);
                if (Usuario_Change.error) {
                    return res.json({ error: true, message: 'Error al cambiar la contraseña del usuario' }); //!ERROR
                }
                //ENVIAR CORREO AL USUARIO PARA RESTABLECER LA CONTRASEÑA DEL USUARIO
                const resend = new resend_1.Resend("re_SN4ZJ8Ww_LxWwx47G78CsTDKN8gXrygN5");
                const data = yield resend.emails.send({
                    from: "Acme <onboarding@resend.dev>",
                    to: [(_b = Usuario_Change.data_usuario) === null || _b === void 0 ? void 0 : _b.correo],
                    subject: "Restauración de contraseña",
                    html: `
                <div>
                    <p>Cordial saludo, ${(_c = Usuario_Change.data_usuario) === null || _c === void 0 ? void 0 : _c.nombre}!</p>
                    <br />
                    <p>Apreciado(a) usuario(a), Atentamente nos permitimos comunicarle que sus datos para el ingreso al Sistema Unificado de Mejora y Autogestión - <b>SUMA</b> son:</p>
                    <br />
                    <p>Usuario: <strong>${(_d = Usuario_Change.data_usuario) === null || _d === void 0 ? void 0 : _d.usuario}</strong></p>
                    <p>Nueva Clave: <strong>${(_e = Usuario_Change.data_usuario) === null || _e === void 0 ? void 0 : _e.clave}</strong></p>
                    <br />
                    <p>En caso de no haber solicitado este cambio, ponganse en contacto con nuestro equipo de soporte.</p>
                    <p>Cordialmente,</p>
                    <img src="https://devitech.com.co/wp-content/uploads/2019/07/logo_completo.png" alt="Logo Empresa" />
                </div>
                `,
                });
                if (data.id) {
                    console.log(data);
                    return res.json({ error: false, message: 'Se ha restablecido la clave del usuario' }); //*SUCCESS
                }
                return res.json({ error: true, message: 'Error al restablecer la clave del usuario' }); //!ERROR
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al cambiar la contraseña del usuario' }); //!ERROR
            }
        });
    }
}
exports.default = UsuarioController;
