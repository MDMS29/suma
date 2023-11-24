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
const db_1 = require("../../config/db");
const DaoUsuario_1 = require("../../dao/Configuracion/DaoUsuario");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class QueryUsuario {
    Autenticar_Usuario({ usuario, clave }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FUNCIÓN ALMACENADA PARA BUSCAR LA INFORMACIÓN DEL USUARIO DEPENDIENDO DEL CAMPO DE "USUARIO"
                const result = yield db_1._DB.func(DaoUsuario_1._FALoginUsuario, [usuario]);
                if (result.length !== 0) {
                    //COMPARACIÓN DE LAS CLAVES HASHEADAS
                    const matches = yield bcryptjs_1.default.compare(clave, result[0].clave);
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
    }
    Modulos_Usuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FUNCTIÓN ALMACENADA PARA BUSCAR LOS MODULOS DEL USUARIO POR EL ID DEL USUARIO
                const result = yield db_1._DB.func(DaoUsuario_1._FAModulosUsuario, [id_usuario, 1]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Menu_Modulos(id_usuario, id_modulo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FUNCIÓN ALMACENADA PARA TOMAR LOS MENUS DE CADA UNO DE LOS MODULOS DEL USUARIO
                const result = yield db_1._DB.func(DaoUsuario_1._FAMenusModulos, [id_usuario, id_modulo]);
                return result;
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    }
    Permisos_Modulo(id_modulo, id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FUNCIÓN ALMACENADA PARA TOMAR LOS ACCIONES PERMITIDAS PARA CADA UNO DE LOS MODULOS DEL USUARIO
                const result = yield db_1._DB.func(DaoUsuario_1._FAAccionesModulos, [id_modulo, id_usuario]);
                return result;
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    }
    Obtener_Usuarios(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FUNCIÓN ALMACENADA PARA TOMAR LOS USUARIOS SEGUN UN ESTADO
                const result = yield db_1._DB.func(DaoUsuario_1._FAObtenerUsuario, [estado, empresa]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Usuario_ID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU ID
                let result = yield db_1._DB.func(DaoUsuario_1._FABuscarUsuarioID, [id]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Buscar_Usuario_Correo(usuario = '', correo = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                if (usuario !== '' && correo !== '') {
                    //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU USUARIO Y CORREO
                    let result = yield db_1._DB.func(DaoUsuario_1._FABuscarUsuarioCorreo, [usuario, correo]);
                    return result;
                }
                if (usuario !== '') {
                    let result = yield client.query('SELECT tu.usuario, tu.nombre_completo FROM seguridad.tbl_usuario tu WHERE tu.usuario = $1', [usuario]);
                    return result.rows;
                }
                if (correo !== '') {
                    let result = yield client.query('SELECT tu.correo FROM seguridad.tbl_usuario tu WHERE tu.correo = $1', [correo]);
                    return result.rows;
                }
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Insertar_Usuario(RequestUsuario, UsuarioCreador) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombre_completo, usuario, clave, correo } = RequestUsuario;
            try {
                //FUNCTIÓN ALMACENADA PARA INSERTAR LA INFORMACIÓN DEL USUARIO Y RETORNAR EL NUEVO ID
                const result = yield db_1._DB.func(DaoUsuario_1._FAInsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
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
    }
    Insertar_Perfil_Usuario(id_usuario, perfil) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //PROCESO ALMACENADO PARA INSERTAR LOS PERFILES DEL USUARIO 
                yield db_1._DB.proc(DaoUsuario_1._PAInsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
                return true;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Rol_Modulo(id_usuario, rol) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
                yield db_1._DB.proc(DaoUsuario_1._PAInsertarRolModuloUsuario, [id_usuario, rol.id_rol]);
                return true;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Insertar_Empresa_Usuario(id_usuario, id_empresa, UsuarioCreador) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect();
            try {
                //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
                const result = yield client.query(DaoUsuario_1._Insertar_Empresa_Usuario, [id_empresa, id_usuario, UsuarioCreador]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Editar_Usuario({ id_usuario, Usuario_Editado, Nombre_Editado, Correo_Editado, Clave_Editada }, UsuarioModificador) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._EditarUsuario, [id_usuario, Nombre_Editado, Usuario_Editado, Clave_Editada, UsuarioModificador, Correo_Editado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Editar_Empresa_Usuario(id_empresa, id_usuario, UsuarioModificador) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._Editar_Empresa_Usuario, [id_usuario, id_empresa, UsuarioModificador]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Buscar_Perfil_Usuario(id_perfil, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._BuscarPerfilUsuario, [usuario, id_perfil]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Editar_Perfil_Usuario(id_perfil, id_estado, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._EditarPerfilUsuario, [usuario, id_perfil, id_estado]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Buscar_Rol_Usuario(id_rol, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._BuscarRolUsuario, [usuario, id_rol]);
                return result.rows;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Editar_Rol_Usuario(id_rol, id_estado, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._EditarRolUsuario, [usuario, id_rol, id_estado]);
                return result.rowCount;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Cambiar_Estado_Usuario(usuario, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._CambiarEstadoUsuario, [usuario, estado]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
    Cambiar_Clave_Usuario(id_usuario, clave, cm_clave) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.pool.connect(); // Obtiene una conexión de la piscina
            try {
                const result = yield client.query(DaoUsuario_1._CambiarClaveUsuario, [id_usuario, clave, cm_clave]);
                return result;
            }
            catch (error) {
                console.log(error);
                return;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.default = QueryUsuario;
