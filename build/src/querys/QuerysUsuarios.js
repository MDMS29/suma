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
exports._QueryEditarPerfilUsuario = exports._QueryBuscarPerfilUsuario = exports._QueryEditarUsuario = exports._QueryInsertarRolModulo = exports._QueryInsertarPerfilUsuario = exports._QueryInsertarUsuario = exports._QueryBuscarUsuarioCorreo = exports._QueryBuscarUsuarioID = exports._QueryObtenerUsuarios = exports._QueryPermisosModulo = exports._QueryMenuModulos = exports._QueryModulosUsuario = exports._QueryAutenticarUsuario = void 0;
const db_1 = require("../../config/db");
const DaoUsuarios_1 = require("../dao/DaoUsuarios");
let bcrypt = require('bcrypt');
const _QueryAutenticarUsuario = ({ usuario, clave }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //FUNCIÓN ALMACENADA PARA BUSCAR LA INFORMACIÓN DEL USUARIO DEPENDIENDO DEL CAMPO DE "USUARIO"
        const result = yield db_1._DB.func(DaoUsuarios_1._FALoginUsuario, [usuario]);
        if (result.length !== 0) {
            //COMPARACIÓN DE LAS CLAVES HASHEADAS
            const matches = yield bcrypt.compare(clave, result[0].clave);
            if (matches) {
                return result;
            }
            return;
        }
        return;
    }
    catch (error) {
        console.log(error);
    }
});
exports._QueryAutenticarUsuario = _QueryAutenticarUsuario;
const _QueryModulosUsuario = (id_usuario) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //FUNCTIÓN ALMACENADA PARA BUSCAR LOS MODULOS DEL USUARIO POR EL ID DEL USUARIO
        const result = yield db_1._DB.func(DaoUsuarios_1._FAModulosUsuario, [id_usuario, 1]);
        return result;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryModulosUsuario = _QueryModulosUsuario;
const _QueryMenuModulos = (id_usuario, id_modulo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //FUNCIÓN ALMACENADA PARA TOMAR LOS MENUS DE CADA UNO DE LOS MODULOS DEL USUARIO
        const result = yield db_1._DB.func(DaoUsuarios_1._FAMenusModulos, [id_usuario, id_modulo]);
        return result;
    }
    catch (error) {
        console.log(error);
        return [];
    }
});
exports._QueryMenuModulos = _QueryMenuModulos;
const _QueryPermisosModulo = (id_modulo, id_usuario) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //FUNCIÓN ALMACENADA PARA TOMAR LOS ACCIONES PERMITIDAS PARA CADA UNO DE LOS MODULOS DEL USUARIO
        const result = yield db_1._DB.func(DaoUsuarios_1._FAAccionesModulos, [id_modulo, id_usuario]);
        return result;
    }
    catch (error) {
        console.log(error);
        return [];
    }
});
exports._QueryPermisosModulo = _QueryPermisosModulo;
const _QueryObtenerUsuarios = (estado) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //FUNCIÓN ALMACENADA PARA TOMAR LOS USUARIOS SEGUN UN ESTADO
        const result = yield db_1._DB.func(DaoUsuarios_1._FAObtenerUsuario, [+estado]);
        return result;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryObtenerUsuarios = _QueryObtenerUsuarios;
const _QueryBuscarUsuarioID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU ID
        let result = yield db_1._DB.func(DaoUsuarios_1._FABuscarUsuarioID, [id]);
        return result;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryBuscarUsuarioID = _QueryBuscarUsuarioID;
const _QueryBuscarUsuarioCorreo = (usuario = '', correo = '') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (usuario !== '' && correo !== '') {
            //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU USUARIO Y CORREO
            let result = yield db_1._DB.func(DaoUsuarios_1._FABuscarUsuarioCorreo, [usuario, correo]);
            return result;
        }
        if (usuario !== '') {
            let result = yield db_1.client.query('SELECT tu.usuario FROM seguridad.tbl_usuario tu WHERE tu.usuario = $1', [usuario]);
            return result.rows;
        }
        if (correo !== '') {
            let result = yield db_1.client.query('SELECT tu.correo FROM seguridad.tbl_usuario tu WHERE tu.correo = $1', [correo]);
            return result.rows;
        }
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryBuscarUsuarioCorreo = _QueryBuscarUsuarioCorreo;
const _QueryInsertarUsuario = (RequestUsuario, UsuarioCreador) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_completo, usuario, clave, correo } = RequestUsuario;
    try {
        //FUNCTIÓN ALMACENADA PARA INSERTAR LA INFORMACIÓN DEL USUARIO Y RETORNAR EL NUEVO ID
        const result = yield db_1._DB.func(DaoUsuarios_1._FAInsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
        if (result) {
            return result[0].insertar_usuario;
        }
        return;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryInsertarUsuario = _QueryInsertarUsuario;
const _QueryInsertarPerfilUsuario = (id_usuario, perfil) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //PROCESO ALMACENADO PARA INSERTAR LOS PERFILES DEL USUARIO 
        yield db_1._DB.proc(DaoUsuarios_1._PAInsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
        return true;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryInsertarPerfilUsuario = _QueryInsertarPerfilUsuario;
const _QueryInsertarRolModulo = (id_usuario, rol) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
        yield db_1._DB.proc(DaoUsuarios_1._PAInsertarRolModuloUsuario, [id_usuario, rol.id_rol]);
        return true;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryInsertarRolModulo = _QueryInsertarRolModulo;
const _QueryEditarUsuario = ({ id_usuario, usuarioEditado, nombreEditado, correoEditado, claveEditada }, UsuarioModificador) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.client.query(DaoUsuarios_1._EditarUsuario, [id_usuario, nombreEditado, usuarioEditado, claveEditada, UsuarioModificador, correoEditado]);
        return result;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryEditarUsuario = _QueryEditarUsuario;
const _QueryBuscarPerfilUsuario = ({ id_perfil }, usuario) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.client.query(DaoUsuarios_1._BuscarPerfilUsuario, [usuario, id_perfil]);
        return result.rows;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryBuscarPerfilUsuario = _QueryBuscarPerfilUsuario;
const _QueryEditarPerfilUsuario = (id_perfil, id_estado, usuario) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.client.query(DaoUsuarios_1._EditarPerfilUsuario, [usuario, id_perfil, id_estado]);
        return result.rows;
    }
    catch (error) {
        console.log(error);
        return;
    }
});
exports._QueryEditarPerfilUsuario = _QueryEditarPerfilUsuario;
