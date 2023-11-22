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
const QuerysUsuario_1 = __importDefault(require("../../querys/Configuracion/QuerysUsuario"));
const utils_1 = require("../../helpers/utils");
let bcrypt = require('bcrypt');
class UsuarioService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Usuario = new QuerysUsuario_1.default();
    }
    Autenticar_Usuario(object) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, clave } = object;
            //----OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO----
            // Promise<UsuarioLogeado | undefined>
            const respuesta = yield this._Query_Usuario.Autenticar_Usuario({ usuario, clave });
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
                const modulos = yield this._Query_Usuario.Modulos_Usuario((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.id_usuario);
                if (modulos) {
                    respuesta.modulos = modulos;
                    for (const modulo of modulos) {
                        //CARGA DE MENUS DE LOS MODULOS
                        const response = yield this._Query_Usuario.Menu_Modulos((_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.id_usuario, modulo.id_modulo);
                        modulo.menus = response;
                        //CARGAR PERMISOS DEL MODULO
                        const permisos = yield this._Query_Usuario.Permisos_Modulo(modulo.id_modulo, (_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.id_usuario);
                        modulo.permisos = permisos;
                    }
                }
                //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave, id_empresa, nombre_empresa } = respuesta[0];
                respuesta.token = (0, utils_1.Generar_JWT)(respuesta[0].id_usuario); //GENERAR TOKEN DE AUTENTICACIÓN
                //RETORNO DE LA ESTRUCTURA DEL USUARIO Y MODULOS
                return {
                    usuario: {
                        id_usuario,
                        nombre_completo,
                        usuario,
                        fecha_creacion,
                        correo,
                        id_estado,
                        cm_clave,
                        id_empresa,
                        nombre_empresa,
                        token: respuesta.token,
                        perfiles: perfilLogin
                    },
                    modulos: respuesta.modulos
                };
            }
            return undefined;
        });
    }
    Obtener_Usuarios(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            //VERIFICACIÓN DEL TIPO DE LA VARIABLE
            if (typeof estado === 'number') {
                throw new Error('Error al obtener el estado del usuario'); //!ERROR
            }
            try {
                const respuesta = yield this._Query_Usuario.Obtener_Usuarios(estado, empresa); //INVOCAR FUNCION PARA OBTENER LOS USUARIOS
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
    Insertar_Usuario(RequestUsuario, UsuarioCreador) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, correo, clave } = RequestUsuario;
            //BUSCAR EL USUARIO POR SU USUARIO Y CORREO
            const respuesta = yield this._Query_Usuario.Buscar_Usuario_Correo(usuario, correo);
            if (respuesta.length > 0) {
                //SI EL USUARIO YA ESTA REGISTRADO MOSTRAR ERROR
                return { error: true, message: 'El usuario o correo ya existe' };
            }
            if (clave) {
                //HASHEAR CLAVE DEL USUARIO
                const saltRounds = 10;
                const hash = yield bcrypt.hash(clave, saltRounds);
                RequestUsuario.clave = hash;
                //FUNCIOÓN PARA REGISTRAR LA INFORMACIÓN PRINCIPAL DEL USUARIO 
                const respuesta = yield this._Query_Usuario.Insertar_Usuario(RequestUsuario, UsuarioCreador);
                if (respuesta) {
                    for (let perfil of RequestUsuario.perfiles) {
                        const res = yield this._Query_Usuario.Insertar_Perfil_Usuario(respuesta, perfil); // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el perfil'); //!ERROR
                        }
                    }
                    for (let rol of RequestUsuario.roles) {
                        const res = yield this._Query_Usuario.Insertar_Rol_Modulo(respuesta, rol); // GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                        if (!res) {
                            throw new Error('Error al insertar el rol'); //!ERROR
                        }
                    }
                    const empresa_usuario = yield this._Query_Usuario.Insertar_Empresa_Usuario(respuesta, RequestUsuario.id_empresa, UsuarioCreador);
                    if ((empresa_usuario === null || empresa_usuario === void 0 ? void 0 : empresa_usuario.rowCount) !== 1) {
                        return { error: true, message: "Error al guardar la empresa del usuario" }; //!ERROR
                    }
                    const data = yield this._Query_Usuario.Buscar_Usuario_ID(respuesta); //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                    return data[0];
                }
                //!ERRORES DE INSERCIÓN A LA BASE DE DATOS
                throw new Error('Error al guardar el usuario'); //!ERROR
            }
            else {
                //!ERROR AL HASHEAR LA CLAVE DEL USUARIO
                throw new Error('Error al guardar clave de usuario'); //!ERROR
            }
        });
    }
    Buscar_Usuario(id = 0, p_user = '') {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (p_user === 'param' && id !== 0) { //CONDICION SI EL USUARIO VIENE POR PARAMETROS
                const respuesta = yield this._Query_Usuario.Buscar_Usuario_ID(id); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
                if (respuesta.length <= 0) {
                    return { error: true, message: "No se ha encontado el usuario" }; //!ERROR
                }
                if (respuesta) {
                    for (const res of respuesta) {
                        res.perfiles = {
                            id_perfil: res.id_perfil,
                            nombre_perfil: res.nombre_perfil,
                            estado_perfil: +res.id_estado_perfil
                        };
                    }
                    //----CARGAR PERFILES DE USUARIO----
                    let perfilLogin = []; //ARRAY DE LOS PERFILES DEL USUARIO
                    respuesta.forEach((res) => perfilLogin.push(res === null || res === void 0 ? void 0 : res.perfiles));
                    //----CARGAR MODULOS DEL USUARIO----
                    const modulos = yield this._Query_Usuario.Modulos_Usuario((_a = respuesta[0]) === null || _a === void 0 ? void 0 : _a.id_usuario);
                    if (modulos) {
                        respuesta.modulos = modulos;
                        for (const modulo of modulos) {
                            //CARGA DE MENUS DE LOS MODULOS
                            const response = yield this._Query_Usuario.Menu_Modulos((_b = respuesta[0]) === null || _b === void 0 ? void 0 : _b.id_usuario, modulo.id_modulo);
                            modulo.menus = response;
                            //CARGAR PERMISOS DEL MODULO
                            const permisos = yield this._Query_Usuario.Permisos_Modulo(modulo.id_modulo, (_c = respuesta[0]) === null || _c === void 0 ? void 0 : _c.id_usuario);
                            modulo.permisos = permisos;
                        }
                    }
                    //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                    const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave, estado_usuario, id_empresa, nombre_empresa } = respuesta[0];
                    // respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
                    return {
                        usuario: {
                            id_usuario,
                            nombre_completo,
                            usuario,
                            fecha_creacion,
                            correo,
                            id_estado,
                            cm_clave,
                            estado_usuario,
                            id_empresa,
                            nombre_empresa,
                            perfiles: perfilLogin
                        },
                        modulos: respuesta.modulos
                    };
                }
            }
            if (id !== 0 && p_user == '') { //CONDICION SI EL USUARIO NO VIENE POR PARAMETROS
                const respuesta = yield this._Query_Usuario.Buscar_Usuario_ID(id); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
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
                    const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave, id_empresa, nombre_empresa } = respuesta[0];
                    // respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
                    return {
                        id_usuario,
                        nombre_completo,
                        usuario,
                        fecha_creacion,
                        correo,
                        id_estado,
                        cm_clave,
                        id_empresa,
                        nombre_empresa,
                        perfiles: perfilLogin
                    };
                }
            }
            return undefined;
        });
    }
    Editar_Usuario(RequestUsuario, UsuarioModificador) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_usuario } = RequestUsuario;
            //BUSCAR LA INFORMACIÓN DEL USUARIO        
            const respuesta = yield this._Query_Usuario.Buscar_Usuario_ID(id_usuario); //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
            if (respuesta.length == 0) { //SI LA RESPUESTA ES VACIA ENVIAR ERROR
                return { error: true, message: "No se ha encontrado el usuario" }; //!ERROR
            }
            const usuario_filtrado_correo = yield this._Query_Usuario.Buscar_Usuario_Correo('', RequestUsuario.correo);
            if ((usuario_filtrado_correo === null || usuario_filtrado_correo === void 0 ? void 0 : usuario_filtrado_correo.length) > 0 && usuario_filtrado_correo[0].correo !== respuesta[0].correo) {
                return { error: true, message: 'Ya existe este correo de usuario' }; //!ERROR
            }
            const usuario_filtrado = yield this._Query_Usuario.Buscar_Usuario_Correo(RequestUsuario.usuario, '');
            if ((usuario_filtrado === null || usuario_filtrado === void 0 ? void 0 : usuario_filtrado.length) > 0 && usuario_filtrado[0].usuario !== respuesta[0].usuario) {
                return { error: true, message: 'Ya existe este usuario' }; //!ERROR
            }
            const { usuario, nombre_completo, correo, clave } = respuesta[0]; //DESTRUCTURING PARA OBTENER LA INFORMACION PERSONALIZADA
            let Usuario_Editado = RequestUsuario.usuario == usuario ? usuario : RequestUsuario.usuario; //NUEVO USUARIO
            let Nombre_Editado = RequestUsuario.nombre_completo == nombre_completo ? nombre_completo : RequestUsuario.nombre_completo; //NUEVO NOMBRE COMPLETO
            let Correo_Editado = RequestUsuario.correo == correo ? correo : RequestUsuario.correo; //NUEVO CORREO
            let Clave_Editada; //VARIABLE PARA LA CLAVE
            try {
                if (RequestUsuario.clave === '') {
                    Clave_Editada = clave;
                }
                else {
                    let matchPass = yield bcrypt.compare(RequestUsuario.clave, clave); //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS
                    if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                        Clave_Editada = clave;
                    }
                    else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                        const saltRounds = 10;
                        const hash = yield bcrypt.hash(RequestUsuario.clave, saltRounds);
                        Clave_Editada = hash;
                    }
                }
                //INVOCAR FUNCION PARA EDITAR EL USUARIO
                const result = yield this._Query_Usuario.Editar_Usuario({ id_usuario, Usuario_Editado, Nombre_Editado, Correo_Editado, Clave_Editada }, UsuarioModificador);
                yield this._Query_Usuario.Editar_Empresa_Usuario(RequestUsuario.id_empresa, id_usuario, UsuarioModificador);
                return result; //RETORNAR EL USUARIO EDITADO
            }
            catch (error) {
                console.log(error);
                return { error: true, message: "Error al editar el usuario" }; //!ERROR
            }
        });
    }
    Editar_Perfiles_Usuario(perfiles, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let perfil of perfiles) {
                    const perfilExistente = yield this._Query_Usuario.Buscar_Perfil_Usuario(perfil.id_perfil, usuario); //INVOCAR FUNCION PARA BUSCAR EL PERFIL DEL USUARIO
                    if (perfilExistente.length == 0) {
                        // SI EL PERFIL NO EXISTE LO AGREGARA
                        const res = yield this._Query_Usuario.Insertar_Perfil_Usuario(usuario, perfil); //INVOCAR FUNCION PARA GUARDAR EL PERFIL DEL USUARIO
                        if (!res) {
                            return { error: true, message: 'No se pudo guardar el nuevo perfil' }; //!ERROR
                        }
                    }
                    else {
                        const res = yield this._Query_Usuario.Editar_Perfil_Usuario(perfil.id_perfil, perfil.estado_perfil, usuario); //INVOCAR FUNCION PARA EDITAR EL PERFIL DEL USUARIO
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
    Editar_Permisos_Usuario(permisos, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (let permiso of permisos) {
                    const permisoExistente = yield this._Query_Usuario.Buscar_Rol_Usuario(permiso.id_rol, usuario); //INVOCAR FUNCION PARA BUSCAR EL ROL DEL USUARIO
                    if (permisoExistente.length == 0) { //VERIFICAR SI EL USUARIO TIENE UN ROL
                        // SI EL ESTADO NO EXISTE LO AGREGARA
                        const res = yield this._Query_Usuario.Insertar_Rol_Modulo(usuario, permiso); //INVOCAR FUNCION PARA GUARDAR EL ROL DEL USUARIO
                        if (!res) {
                            return { error: true, message: 'No se pudo guardar el nuevo permiso' }; //!ERROR
                        }
                    }
                    else { //SI EL PERMISO EXISTE EDITARA SU ESTADO
                        const res = yield this._Query_Usuario.Editar_Rol_Usuario(permiso.id_rol, `${permiso.id_estado}`, usuario); //INVOCAR FUNCION PARA EDITAR EL ROL DEL USUARIO
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
    Cambiar_Estado_Usuario({ usuario, estado }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const busqueda = yield this._Query_Usuario.Buscar_Usuario_ID(usuario);
                if (busqueda.length <= 0) {
                    return { error: true, message: 'No se ha encontrado el usuario' };
                }
                const res = yield this._Query_Usuario.Cambiar_Estado_Usuario(usuario, estado);
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
    Cambiar_Clave_Usuario(id_usuario, clave, cm_clave) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let _Nueva_Clave;
            try {
                const usuario = yield this._Query_Usuario.Buscar_Usuario_ID(id_usuario);
                //SI SE VA A ENVIAR LA CLAVE DEL USUARIO POR CORREO
                if (cm_clave) {
                    let matchPass = yield bcrypt.compare(clave, (_a = usuario[0]) === null || _a === void 0 ? void 0 : _a.clave); //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS
                    if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                        return { error: true, message: 'Las clave no puede ser igual a la ya existente' }; //!ERROR
                    }
                    else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                        const saltRounds = 10;
                        const hash = yield bcrypt.hash(clave, saltRounds);
                        _Nueva_Clave = hash;
                    }
                    const res = yield this._Query_Usuario.Cambiar_Clave_Usuario(id_usuario, _Nueva_Clave, cm_clave);
                    if (!(res === null || res === void 0 ? void 0 : res.rowCount)) {
                        return { error: true, message: 'Error al cambiar la clave del usuario' }; //!ERROR
                    }
                    //RETORNAR LA INFORMACION PARA EL ENVIO DEL CORREO
                    return {
                        error: false,
                        data_usuario: {
                            id_usuario,
                            clave,
                            nombre: (_b = usuario[0]) === null || _b === void 0 ? void 0 : _b.nombre_completo,
                            usuario: (_c = usuario[0]) === null || _c === void 0 ? void 0 : _c.usuario,
                            correo: (_d = usuario[0]) === null || _d === void 0 ? void 0 : _d.correo
                        },
                        message: 'Clave cambiada con éxito'
                    };
                }
                //SI SE RESTABLECE LA CLAVE DEL USUARIO
                const saltRounds = 10;
                const hash = yield bcrypt.hash(clave, saltRounds);
                if (!hash) {
                    console.error(hash); //!ERROR
                }
                const res = yield this._Query_Usuario.Cambiar_Clave_Usuario(id_usuario, hash, cm_clave);
                if (!(res === null || res === void 0 ? void 0 : res.rowCount)) {
                    return { error: true, message: 'Error al restablecer la clave del usuario' }; //!ERROR
                }
                return { error: false, message: 'Se ha restablecido la clave del usuario' }; //*SUCCESS
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al restablecer la clave del usuario' }; //!ERROR
            }
        });
    }
}
exports.default = UsuarioService;
