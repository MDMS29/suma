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
exports._UsuarioService = void 0;
const QuerysUsuarios_1 = require("../querys/QuerysUsuarios");
const utils_1 = require("../validations/utils");
let bcrypt = require('bcrypt');
class _UsuarioService {
    AutenticarUsuario(object) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, clave } = object;
            //----OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO----
            const respuesta = yield (0, QuerysUsuarios_1._QueryAutenticarUsuario)({ usuario, clave });
            if (respuesta) {
                for (const res of respuesta) {
                    res.perfiles = {
                        id_perfil: res.id_perfil,
                        nombre_perfil: res.nombre_perfil,
                        estado_perfil: res.id_estado_perfil
                    };
                }
                //----CARGAR PERFILES DE USUARIO----
                let perfilLogin = []; //ARRAY DE LOS PERFILES DEL USUARIO
                respuesta.forEach((res) => perfilLogin.push(res === null || res === void 0 ? void 0 : res.perfiles));
                //----CARGAR MODULOS DEL USUARIO----
                const modulos = yield (0, QuerysUsuarios_1._QueryModulosUsuario)((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.id_usuario);
                if (modulos) {
                    respuesta.modulos = modulos;
                    for (const modulo of modulos) {
                        //CARGA DE MENUS DE LOS MODULOS
                        const response = yield (0, QuerysUsuarios_1._QueryMenuModulos)((_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.id_usuario, modulo.id_modulo);
                        modulo.menus = response;
                        //CARGAR PERMISOS DEL MODULO
                        const permisos = yield (0, QuerysUsuarios_1._QueryPermisosModulo)(modulo.id_modulo, (_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.id_usuario);
                        modulo.permisos = permisos;
                    }
                }
                //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado } = respuesta[0];
                respuesta.token = (0, utils_1.generarJWT)(respuesta[0].id_usuario); //GENERAR TOKEN DE AUTENTICACIÓN
                //RETORNO DE LA ESTRUCTURA DEL USUARIO Y MODULOS
                return {
                    usuario: {
                        id_usuario,
                        nombre_completo,
                        usuario,
                        fecha_creacion,
                        correo,
                        id_estado,
                        token: respuesta.token,
                        perfiles: perfilLogin
                    },
                    modulos: respuesta.modulos
                };
            }
            return undefined;
        });
    }
    ObtenerUsuarios(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            //VERIFICACIÓN DEL TIPO DE LA VARIABLE
            if (typeof estado === 'number') {
                throw new Error('Error al obtener el estado del usuario');
            }
            try {
                //RESPUESTA DE LA CONSULTA
                const respuesta = yield (0, QuerysUsuarios_1._QueryObtenerUsuarios)(estado);
                if (respuesta) {
                    return respuesta;
                }
            }
            catch (error) {
                console.log(error);
                return;
            }
            return;
        });
    }
    InsertarUsuario(RequestUsuario, UsuarioCreador) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, correo, clave } = RequestUsuario;
            //BUSCAR EL USUARIO POR SU USUARIO Y CORREO
            const respuesta = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioCorreo)(usuario, correo);
            if (respuesta) {
                //SI EL USUARIO YA ESTA REGISTRADO MOSTRAR ERROR
                return { error: true, message: 'Este usuario ya existe' };
            }
            if (clave) {
                //HASHEAR CLAVE DEL USUARIO
                const saltRounds = 10;
                const hash = yield bcrypt.hash(clave, saltRounds);
                RequestUsuario.clave = hash;
                //FUNCIOÓN PARA REGISTRAR LA INFORMACIÓN PRINCIPAL DEL USUARIO 
                const respuesta = yield (0, QuerysUsuarios_1._QueryInsertarUsuario)(RequestUsuario, UsuarioCreador);
                if (respuesta) {
                    for (let perfil of RequestUsuario.perfiles) {
                        const res = yield (0, QuerysUsuarios_1._QueryInsertarPerfilUsuario)(respuesta, perfil); // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el perfil');
                        }
                    }
                    for (let rol of RequestUsuario.roles) {
                        const res = yield (0, QuerysUsuarios_1._QueryInsertarRolModulo)(respuesta, rol); // GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el rol');
                        }
                    }
                    const data = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioID)(respuesta); //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                    return data;
                }
                //ERRORES DE INSERCIÓN A LA BASE DE DATOS
                throw new Error('Error al guardar el usuario');
            }
            else {
                //ERROR AL HASHEAR LA CLAVE DEL USUARIO
                throw new Error('Error al hashear clave de usuario');
            }
        });
    }
    BuscarUsuario(id = 0, p_user = '') {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (p_user === 'param' && id !== 0) {
                const respuesta = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioID)(id);
                if (respuesta) {
                    for (const res of respuesta) {
                        res.perfiles = {
                            id_perfil: res.id_perfil,
                            nombre_perfil: res.nombre_perfil,
                            estado_perfil: res.id_estado_perfil
                        };
                    }
                    //----CARGAR PERFILES DE USUARIO----
                    let perfilLogin = []; //ARRAY DE LOS PERFILES DEL USUARIO
                    respuesta.forEach((res) => perfilLogin.push(res === null || res === void 0 ? void 0 : res.perfiles));
                    //----CARGAR MODULOS DEL USUARIO----
                    const modulos = yield (0, QuerysUsuarios_1._QueryModulosUsuario)((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.id_usuario);
                    if (modulos) {
                        respuesta.modulos = modulos;
                        for (const modulo of modulos) {
                            //CARGA DE MENUS DE LOS MODULOS
                            const response = yield (0, QuerysUsuarios_1._QueryMenuModulos)((_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.id_usuario, modulo.id_modulo);
                            modulo.menus = response;
                        }
                    }
                    //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                    const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado } = respuesta[0];
                    respuesta.token = (0, utils_1.generarJWT)(respuesta[0].id_usuario); //GENERAR TOKEN DE AUTENTICACIÓN
                    return {
                        usuario: {
                            id_usuario,
                            nombre_completo,
                            usuario,
                            fecha_creacion,
                            correo,
                            id_estado,
                            token: respuesta.token,
                            perfiles: perfilLogin
                        },
                        modulos: respuesta.modulos
                    };
                }
            }
            if (id !== 0 && p_user == '') {
                const respuesta = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioID)(id);
                if (respuesta) {
                    for (const res of respuesta) {
                        res.perfiles = {
                            id_perfil: res.id_perfil,
                            nombre_perfil: res.nombre_perfil,
                            estado_perfil: res.id_estado_perfil
                        };
                    }
                    //----CARGAR PERFILES DE USUARIO----
                    let perfilLogin = []; //ARRAY DE LOS PERFILES DEL USUARIO
                    respuesta.forEach((res) => perfilLogin.push(res === null || res === void 0 ? void 0 : res.perfiles));
                    respuesta.perfiles = perfilLogin;
                }
                return respuesta;
            }
            return undefined;
        });
    }
    EditarUsuario(RequestUsuario, UsuarioModificador) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = RequestUsuario;
            //BUSCAR LA INFORMACIÓN DEL USUARIO
            const respuesta = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioID)(id_usuario);
            if (respuesta.length == 0) {
                return { error: true, message: "No se ha encontrado el usuario" };
            }
            const { usuario, nombre_completo, correo, clave } = respuesta[0];
            let usuarioEditado = RequestUsuario.usuario == usuario ? usuario : RequestUsuario.usuario;
            let nombreEditado = RequestUsuario.nombre_completo == nombre_completo ? nombre_completo : RequestUsuario.nombre_completo;
            let correoEditado = RequestUsuario.correo == correo ? correo : RequestUsuario.correo;
            let claveEditada;
            // VERIFICACION PARA EL USUARIO INGRESADO NO ESTE DUPLICADO
            if (usuarioEditado != usuario) {
                const usuarioDuplicado = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioCorreo)(usuarioEditado, '');
                return usuarioDuplicado[0] ? { error: true, message: "Usuario ya registrado" } : { error: false, message: "" };
            }
            // VERIFICACION PARA EL CORREO INGRESADO NO ESTE DUPLICADO
            if (correoEditado != correo) {
                const correoDuplicado = yield (0, QuerysUsuarios_1._QueryBuscarUsuarioCorreo)('', correoEditado);
                return correoDuplicado[0] ? { error: true, message: "Correo ya registrado" } : { error: false, message: "" };
            }
            let matchPass = yield bcrypt.compare(RequestUsuario.clave, clave);
            if (matchPass) {
                claveEditada = clave;
            }
            else {
                const saltRounds = 10;
                const hash = yield bcrypt.hash(RequestUsuario.clave, saltRounds);
                claveEditada = hash;
            }
            const result = yield (0, QuerysUsuarios_1._QueryEditarUsuario)({ id_usuario, usuarioEditado, nombreEditado, correoEditado, claveEditada }, UsuarioModificador);
            // console.log(result)
            return result;
        });
    }
    EditarPerfilesUsuario(perfiles, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let perfil of perfiles) {
                const perfilExistente = yield (0, QuerysUsuarios_1._QueryBuscarPerfilUsuario)(perfil, usuario);
                if (perfilExistente) {
                    //SI EL PERFIL EXISTE EDITARA SU ESTADO
                    const res = yield (0, QuerysUsuarios_1._QueryEditarPerfilUsuario)(perfil.id_perfil, perfil.id_estado, usuario);
                    if (!res) {
                        throw new Error('Error al editar el perfil');
                    }
                }
                else {
                    // SI EL ESTADO NO EXISTE LO AGREGARA
                    for (let perfil of perfiles) {
                        const res = yield (0, QuerysUsuarios_1._QueryInsertarPerfilUsuario)(usuario, perfil); // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el perfil');
                        }
                    }
                }
            }
        });
    }
}
exports._UsuarioService = _UsuarioService;
