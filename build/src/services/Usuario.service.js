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
const QuerysUsuario_1 = __importDefault(require("../querys/QuerysUsuario"));
const utils_1 = require("../validations/utils");
let bcrypt = require('bcrypt');
class UsuarioService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Usuario = new QuerysUsuario_1.default();
    }
    AutenticarUsuario(object) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, clave } = object;
            //----OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO----
            // Promise<UsuarioLogeado | undefined>
            const respuesta = yield this._Query_Usuario.AutenticarUsuario({ usuario, clave });
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
                const modulos = yield this._Query_Usuario.ModulosUsuario((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.id_usuario);
                if (modulos) {
                    respuesta.modulos = modulos;
                    for (const modulo of modulos) {
                        //CARGA DE MENUS DE LOS MODULOS
                        const response = yield this._Query_Usuario.MenuModulos((_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.id_usuario, modulo.id_modulo);
                        modulo.menus = response;
                        //CARGAR PERMISOS DEL MODULO
                        const permisos = yield this._Query_Usuario.PermisosModulo(modulo.id_modulo, (_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.id_usuario);
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
                throw new Error('Error al obtener el estado del usuario'); //!ERROR
            }
            try {
                const respuesta = yield this._Query_Usuario.ObtenerUsuarios(estado); //INVOCAR FUNCION PARA OBTENER LOS USUARIOS
                if (respuesta) { //VALIDACION SI HAY ALGUNA RESPUESTA
                    return respuesta; //RETORNAR LA RESPUESTA
                }
                return;
            }
            catch (error) {
                console.log(error); //!ERROR
                return;
            }
        });
    }
    InsertarUsuario(RequestUsuario, UsuarioCreador) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, correo, clave } = RequestUsuario;
            //BUSCAR EL USUARIO POR SU USUARIO Y CORREO
            const respuesta = yield this._Query_Usuario.BuscarUsuarioCorreo(usuario, correo);
            if (respuesta.length > 0) {
                //SI EL USUARIO YA ESTA REGISTRADO MOSTRAR ERROR
                return { error: true, message: 'Este usuario ya existe' };
            }
            if (clave) {
                //HASHEAR CLAVE DEL USUARIO
                const saltRounds = 10;
                const hash = yield bcrypt.hash(clave, saltRounds);
                RequestUsuario.clave = hash;
                //FUNCIOÓN PARA REGISTRAR LA INFORMACIÓN PRINCIPAL DEL USUARIO 
                const respuesta = yield this._Query_Usuario.InsertarUsuario(RequestUsuario, UsuarioCreador);
                if (respuesta) {
                    for (let perfil of RequestUsuario.perfiles) {
                        const res = yield this._Query_Usuario.InsertarPerfilUsuario(respuesta, perfil); // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el perfil'); //!ERROR
                        }
                    }
                    for (let rol of RequestUsuario.roles) {
                        const res = yield this._Query_Usuario.InsertarRolModulo(respuesta, rol); // GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el rol'); //!ERROR
                        }
                    }
                    const data = yield this._Query_Usuario.BuscarUsuarioID(respuesta); //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                    return data[0];
                }
                //!ERRORES DE INSERCIÓN A LA BASE DE DATOS
                throw new Error('Error al guardar el usuario'); //!ERROR
            }
            else {
                //!ERROR AL HASHEAR LA CLAVE DEL USUARIO
                throw new Error('Error al hashear clave de usuario'); //!ERROR
            }
        });
    }
    BuscarUsuario(id = 0, p_user = '') {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (p_user === 'param' && id !== 0) { //CONDICION SI EL USUARIO VIENE POR PARAMETROS
                const respuesta = yield this._Query_Usuario.BuscarUsuarioID(id); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
                if (respuesta.length <= 0) {
                    return { error: true, message: "No se ha encontado el usuario" }; //!ERROR
                }
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
                    const modulos = yield this._Query_Usuario.ModulosUsuario((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.id_usuario);
                    if (modulos) {
                        respuesta.modulos = modulos;
                        for (const modulo of modulos) {
                            //CARGA DE MENUS DE LOS MODULOS
                            const response = yield this._Query_Usuario.MenuModulos((_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.id_usuario, modulo.id_modulo);
                            modulo.menus = response;
                            //CARGAR PERMISOS DEL MODULO
                            const permisos = yield this._Query_Usuario.PermisosModulo(modulo.id_modulo, (_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.id_usuario);
                            modulo.permisos = permisos;
                        }
                    }
                    //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                    const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado } = respuesta[0];
                    // respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
                    return {
                        usuario: {
                            id_usuario,
                            nombre_completo,
                            usuario,
                            fecha_creacion,
                            correo,
                            id_estado,
                            perfiles: perfilLogin
                        },
                        modulos: respuesta.modulos
                    };
                }
            }
            if (id !== 0 && p_user == '') { //CONDICION SI EL USUARIO NO VIENE POR PARAMETROS
                const respuesta = yield this._Query_Usuario.BuscarUsuarioID(id); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
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
            const respuesta = yield this._Query_Usuario.BuscarUsuarioID(id_usuario); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
            if (respuesta.length == 0) { //SI LA RESPUESTA ES VACIA ENVIAR ERROR
                return { error: true, message: "No se ha encontrado el usuario" }; //!ERROR
            }
            const { usuario, nombre_completo, correo, clave } = respuesta[0]; //DESTRUCTURING PARA OBTENER LA INFORMACION PERSONALIZADA
            let Usuario_Editado = RequestUsuario.usuario == usuario ? usuario : RequestUsuario.usuario; //NUEVO USUARIO
            let Nombre_Editado = RequestUsuario.nombre_completo == nombre_completo ? nombre_completo : RequestUsuario.nombre_completo; //NUEVO NOMBRE COMPLETO
            let Correo_Editado = RequestUsuario.correo == correo ? correo : RequestUsuario.correo; //NUEVO CORREO
            let Clave_Editada; //VARIABLE PARA LA CLAVE
            try {
                // VERIFICACION PARA EL USUARIO INGRESADO NO ESTE DUPLICADO
                if (Usuario_Editado != usuario) {
                    const usuarioDuplicado = yield this._Query_Usuario.BuscarUsuarioCorreo(Usuario_Editado, ''); //INVOCAR FUNCION PARA BUSCAR EL USUARIO 
                    if (usuarioDuplicado.legnth == 0) { //VERIFICAR SI HAY INFORMACION IGUAL 
                        return { error: true, message: "Usuario ya registrado" }; //!ERROR
                    }
                }
                // VERIFICACION PARA EL CORREO INGRESADO NO ESTE DUPLICADO
                if (Correo_Editado != correo) {
                    const correoDuplicado = yield this._Query_Usuario.BuscarUsuarioCorreo('', Correo_Editado); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR EL CORREO
                    if (correoDuplicado.legnth == 0) { //VERIFICAR SI HAY INFORMACION IGUAL
                        return { error: true, message: "Correo ya registrado" }; //!ERROR
                    }
                }
                let matchPass = yield bcrypt.compare(RequestUsuario.clave, clave); //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS
                if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                    Clave_Editada = clave;
                }
                else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                    const saltRounds = 10;
                    const hash = yield bcrypt.hash(RequestUsuario.clave, saltRounds);
                    Clave_Editada = hash;
                }
                //INVOCAR FUNCION PARA EDITAR EL USUARIO
                const result = yield this._Query_Usuario.EditarUsuario({ id_usuario, Usuario_Editado, Nombre_Editado, Correo_Editado, Clave_Editada }, UsuarioModificador);
                return result; //RETORNAR EL USUARIO EDITADO
            }
            catch (error) {
                console.log(error);
                return { error: true, message: "Error al editar el usuario" }; //!ERROR
            }
        });
    }
    EditarPerfilesUsuario(perfiles, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let perfil of perfiles) {
                    const perfilExistente = yield this._Query_Usuario.BuscarPerfilUsuario(perfil, usuario); //INVOCAR FUNCION PARA BUSCAR EL PERFIL DEL USUARIO
                    if (perfilExistente.length == 0) {
                        // SI EL PERFIL NO EXISTE LO AGREGARA
                        const res = yield this._Query_Usuario.InsertarPerfilUsuario(usuario, perfil); //INVOCAR FUNCION PARA GUARDAR EL PERFIL DEL USUARIO
                        if (!res) {
                            return { error: true, message: 'No se pudo guardar el nuevo perfil' }; //!ERROR
                        }
                    }
                    else {
                        const res = yield this._Query_Usuario.EditarPerfilUsuario(perfil.id_perfil, perfil.id_estado, usuario); //INVOCAR FUNCION PARA EDITAR EL PERFIL DEL USUARIO
                        if (!res) {
                            return { error: true, message: 'No se pudo editar el nuevo perfil' }; //!ERROR
                        }
                    }
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar los perfiles del usuario' }; //!ERROR
            }
        });
    }
    EditarPermisosUsuario(permisos, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let permiso of permisos) {
                    const permisoExistente = yield this._Query_Usuario.BuscarRolUsuario(permiso, usuario); //INVOCAR FUNCION PARA BUSCAR EL ROL DEL USUARIO
                    if (permisoExistente.length == 0) { //VERIFICAR SI EL USUARIO TIENE UN ROL
                        // SI EL ESTADO NO EXISTE LO AGREGARA
                        const res = yield this._Query_Usuario.InsertarRolModulo(usuario, permiso); //INVOCAR FUNCION PARA GUARDAR EL ROL DEL USUARIO
                        if (!res) {
                            return { error: true, message: 'No se pudo guardar el nuevo permiso' }; //!ERROR
                        }
                    }
                    else { //SI EL PERMISO EXISTE EDITARA SU ESTADO 
                        const res = yield this._Query_Usuario.EditarRolUsuario(permiso.id_rol, permiso.id_estado, usuario); //INVOCAR FUNCION PARA EDITAR EL ROL DEL USUARIO
                        if (!res) {
                            return { error: true, message: 'No se pudo editar el permiso' }; //!ERROR
                        }
                    }
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar los permisos del usuario' }; //!ERROR
            }
        });
    }
    CambiarEstadoUsuario({ usuario, estado }) {
        return __awaiter(this, void 0, void 0, function* () {
            const busqueda = yield this._Query_Usuario.BuscarUsuarioID(usuario);
            if (busqueda.length <= 0) {
                return { error: true, message: 'No se ha encontrado el usuario' };
            }
            try {
                const res = yield this._Query_Usuario.CambiarEstadoUsuario(usuario, estado);
                if (!res) {
                    return { error: true, message: 'No se pudo cambiar el estado del usuario' };
                }
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar el estado del usuario' };
            }
            return;
        });
    }
    CambiarClaveUsuario(id_usuario, clave) {
        return __awaiter(this, void 0, void 0, function* () {
            let _Nueva_Clave;
            try {
                const usuario = yield this.BuscarUsuario(id_usuario, '');
                let matchPass = yield bcrypt.compare(clave, usuario[0].clave); //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS
                if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                    return { error: true, message: 'Las clave no puede ser igual a la ya existente' };
                }
                else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                    const saltRounds = 10;
                    const hash = yield bcrypt.hash(clave, saltRounds);
                    _Nueva_Clave = hash;
                }
                const res = yield this._Query_Usuario.CambiarClaveUsuario(id_usuario, _Nueva_Clave);
                if (!(res === null || res === void 0 ? void 0 : res.rowCount)) {
                    return { error: true, message: 'Error al cambiar la clave del usuario' };
                }
                //RETORNAR LA INFORMACION PARA EL ENVIO DEL CORREO
                return {
                    error: false,
                    data_usuario: {
                        id_usuario,
                        clave,
                        nombre: usuario[0].nombre_completo,
                        usuario: usuario[0].usuario,
                        correo: usuario[0].correo
                    },
                    message: 'Clave cambiada con exito'
                };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar la clave del usuario' };
            }
        });
    }
}
exports.default = UsuarioService;