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
exports.PerfilService = void 0;
const QuerysPerfil_1 = __importDefault(require("../querys/QuerysPerfil"));
class PerfilService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Perfil = new QuerysPerfil_1.default();
    }
    ReduceModulos(result, modulos) {
        modulos.forEach((modulo) => {
            const esModulo = result.find((existe) => existe.nombre_modulo === modulo.nombre_modulo);
            if (!esModulo) {
                result.push(modulo);
            }
        });
        return result;
    }
    ObtenerPerfiles(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!estado) {
                return { error: true, message: 'Estado no definido' }; //!ERROR
            }
            try {
                const respuesta = yield this._Query_Perfil.ObtenerPerfiles(estado);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: true, message: 'No se han encontrado perfiles' }; //!ERROR
                }
                for (let res of respuesta) {
                    const modulos = yield this._Query_Perfil.ModulosPerfil(res.id_perfil);
                    if (!modulos) {
                        return res.json({ error: true, message: 'No se han podido cargar los modulos del perfil' }); //!ERROR
                    }
                    res.modulos = modulos;
                }
                return respuesta;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar los modulos del perfil' }; //!ERROR
            }
        });
    }
    ObtenerModulosPerfil(perfiles) {
        return __awaiter(this, void 0, void 0, function* () {
            let Modulos = [];
            try {
                for (let perfil of perfiles) {
                    //INVOCAR LA FUNCION PARA OBTENER LOS MODULOS DE LOS PERFILES
                    const respuesta = yield this._Query_Perfil.ModulosPerfil(perfil.id_perfil);
                    Modulos.push(respuesta);
                }
                const result = Modulos.reduce(this.ReduceModulos, []);
                if (result.length <= 0) {
                    return { error: true, message: 'No se han podido cargar los modulos del perfil' }; //!ERROR
                }
                //OBTENER LOS PERMISOS DE LOS MODULOS
                for (let modulo of result) {
                    const permisos = yield this._Query_Perfil.PermisosModulosPerfil(modulo.id_modulo);
                    modulo.permisos = permisos;
                }
                return result;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'No se han podido cargar los modulos del perfil' }; //!ERROR
            }
        });
    }
    InsertarPerfil(nombre_perfil, usuario_creacion, modulos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const Query_Perfil = new QueryPerfil()
                //VALIDAR SI EL PERFIL EXISTE
                const Bperfil = yield this._Query_Perfil.BuscarPerfilNombre(nombre_perfil);
                if ((Bperfil === null || Bperfil === void 0 ? void 0 : Bperfil.length) > 0) {
                    return { error: true, message: 'Ya existe este perfil' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR PERFIL
                const respuesta = yield this._Query_Perfil.InsertarPerfil({ nombre_perfil, usuario_creacion });
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el perfil' }; //!ERROR
                }
                //COMPROBAR SI LOS MODULOS VIENEN TIPO ARRAY
                const modulosArray = Array.isArray(modulos) ? modulos : [modulos];
                for (let modulo of modulosArray) {
                    //INVOCAR FUNCION PARA INSERTAR LOS MODULOS DEL PERFIL
                    const modulos = yield this._Query_Perfil.InsertarModuloPerfil(respuesta[0].id_perfil, modulo.id_modulo);
                    if (!modulos) {
                        return { error: true, message: 'Error al insetar los modulos del perfil' }; //!ERROR
                    }
                }
                //INVOCAR FUNCION PARA BUSCAR EL PERFIL POR ID
                const perfil = yield this._Query_Perfil.BuscarPerfilID(respuesta[0].id_perfil);
                if (!perfil) {
                    return { error: true, message: 'No se ha encontrado el perfil' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR LOS MODULOS DEL PERFIL POR ID
                const modulosPerfil = yield this._Query_Perfil.ModulosPerfil(respuesta[0].id_perfil);
                perfil.modulos = modulosPerfil;
                return perfil;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el perfil' }; //!ERROR
            }
        });
    }
    EditarPerfil(id_perfil, nombre_perfil, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            let nombre_editado;
            try {
                const respuesta = yield this._Query_Perfil.BuscarPerfilID(id_perfil);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.nombre_perfil) === nombre_perfil) {
                    nombre_editado = respuesta.nombre_perfil;
                }
                else {
                    nombre_editado = nombre_perfil;
                }
                const res = yield this._Query_Perfil.EditarPerfil({ id_perfil, nombre_editado, usuario_creacion });
                if ((res === null || res === void 0 ? void 0 : res.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar el perfil' }; //!ERROR
                }
                return { error: false, message: '' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar perfil' }; //!ERROR
            }
        });
    }
    EditarModulosPerfil(id_perfil, modulos) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let modulo of modulos) {
                const B_Modulo = yield this._Query_Perfil.BuscarModuloPerfil(id_perfil, modulo.id_modulo);
                if (!B_Modulo || (B_Modulo === null || B_Modulo === void 0 ? void 0 : B_Modulo.length) <= 0) {
                    ///INSERTAR
                    const Modulos_Insertar = yield this._Query_Perfil.InsertarModuloPerfil(id_perfil, modulo.id_modulo);
                    if (!Modulos_Insertar) {
                        return { error: true, message: 'Error al insertar el nuevo modulo ' }; //!ERROR
                    }
                }
                //EDITAR
                const Modulos_Editar = yield this._Query_Perfil.EditarModuloPerfil(id_perfil, modulo);
                if (!Modulos_Editar) {
                    return { error: true, message: 'Error al editar el modulo' }; //!ERROR
                }
                const AllModulos = yield this._Query_Perfil.ModulosPerfil(id_perfil);
                if (AllModulos.length <= 0) {
                    modulo.id_estado = 11; //CAMBIAR EL ESTADO DEL MODULO A "ACTIVO" PARA NO DEJAR EL PERFIL CON UN SOLO MODULO
                    const Modulos_Editar = yield this._Query_Perfil.EditarModuloPerfil(id_perfil, modulo);
                    if (!Modulos_Editar) {
                        return { error: true, message: 'Error al editar el modulo' }; //!ERROR
                    }
                    return { error: true, message: 'El perfil debe tener al menos un perfil' }; //!ERROR
                }
            }
            return { error: false, message: 'Modulos del perfil editados con exito' }; //!ERROR
        });
    }
    CambiarEstadoPerfil(id_perfil, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const perfil_editado = yield this._Query_Perfil.CambiarEstadoPerfil(id_perfil, estado);
                if (!(perfil_editado === null || perfil_editado === void 0 ? void 0 : perfil_editado.rowCount)) {
                    return { error: true, message: 'Error al editar el perfil' }; //!ERROR
                }
                return { error: false, message: 'Se ha cambiado el estado del perfil' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el perfil' }; //!ERROR
            }
        });
    }
}
exports.PerfilService = PerfilService;
