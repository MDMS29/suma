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
const QuerysPerfil_1 = __importDefault(require("../../querys/Configuracion/QuerysPerfil"));
const constants_1 = require("../../helpers/constants");
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
    Obtener_Perfiles(estado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!estado) {
                return { error: true, message: 'Estado no definido' }; //!ERROR
            }
            try {
                const respuesta = yield this._Query_Perfil.Obtener_Perfiles(estado);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.length) <= 0) {
                    return { error: true, message: 'No se han encontrado perfiles' }; //!ERROR
                }
                for (let res of respuesta) {
                    const modulos = yield this._Query_Perfil.Modulos_Perfil(res.id_perfil);
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
    Obtener_Modulos_Perfil(perfiles) {
        return __awaiter(this, void 0, void 0, function* () {
            let Modulos = [];
            try {
                for (let perfil of perfiles) {
                    //INVOCAR LA FUNCION PARA OBTENER LOS MODULOS DE LOS PERFILES
                    const respuesta = yield this._Query_Perfil.Modulos_Perfil(perfil.id_perfil);
                    Modulos.push(respuesta);
                }
                const result = Modulos.reduce(this.ReduceModulos, []);
                if (result.length <= 0) {
                    return { error: true, message: 'No se han podido cargar los modulos del perfil' }; //!ERROR
                }
                //OBTENER LOS PERMISOS DE LOS MODULOS
                for (let modulo of result) {
                    const permisos = yield this._Query_Perfil.Permisos_Modulos_Perfil(modulo.id_modulo);
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
    Insertar_Perfil(nombre_perfil, usuario_creacion, modulos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const Query_Perfil = new QueryPerfil()
                //VALIDAR SI EL PERFIL EXISTE
                const Bperfil = yield this._Query_Perfil.Buscar_Perfil_Nombre(nombre_perfil);
                if ((Bperfil === null || Bperfil === void 0 ? void 0 : Bperfil.length) > 0) {
                    return { error: true, message: 'Ya existe este perfil' }; //!ERROR
                }
                //INVOCAR FUNCION PARA INSERTAR PERFIL
                const respuesta = yield this._Query_Perfil.Insertar_Perfil({ nombre_perfil, usuario_creacion });
                if (!respuesta) {
                    return { error: true, message: 'No se ha podido crear el perfil' }; //!ERROR
                }
                //COMPROBAR SI LOS MODULOS VIENEN TIPO ARRAY
                const modulosArray = Array.isArray(modulos) ? modulos : [modulos];
                for (let modulo of modulosArray) {
                    //INVOCAR FUNCION PARA INSERTAR LOS MODULOS DEL PERFIL
                    const modulos = yield this._Query_Perfil.Insertar_Modulo_Perfil(respuesta[0].id_perfil, modulo.id_modulo);
                    if (!modulos) {
                        return { error: true, message: 'Error al insetar los modulos del perfil' }; //!ERROR
                    }
                }
                //INVOCAR FUNCION PARA BUSCAR EL PERFIL POR ID
                const perfil = yield this._Query_Perfil.Buscar_Perfil_ID(respuesta[0].id_perfil);
                if (!perfil) {
                    return { error: true, message: 'No se ha encontrado el perfil' }; //!ERROR
                }
                //INVOCAR FUNCION PARA BUSCAR LOS MODULOS DEL PERFIL POR ID
                const Modulos_Perfil = yield this._Query_Perfil.Modulos_Perfil(respuesta[0].id_perfil);
                perfil.modulos = Modulos_Perfil;
                return perfil;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al crear el perfil' }; //!ERROR
            }
        });
    }
    Editar_Perfil(id_perfil, nombre_perfil, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            let nombre_editado;
            try {
                const perfil_filtrado = yield this._Query_Perfil.Buscar_Perfil_ID(id_perfil);
                const perfil_filtrado_nombre = yield this._Query_Perfil.Buscar_Perfil_Nombre(nombre_perfil);
                if ((perfil_filtrado_nombre === null || perfil_filtrado_nombre === void 0 ? void 0 : perfil_filtrado_nombre.length) > 0 && perfil_filtrado_nombre[0].nombre_perfil !== perfil_filtrado.nombre_perfil) {
                    return { error: true, message: 'Ya existe este perfil' }; //!ERROR
                }
                const respuesta = yield this._Query_Perfil.Buscar_Perfil_ID(id_perfil);
                if ((respuesta === null || respuesta === void 0 ? void 0 : respuesta.nombre_perfil) === nombre_perfil) {
                    nombre_editado = respuesta.nombre_perfil;
                }
                else {
                    nombre_editado = nombre_perfil;
                }
                const res = yield this._Query_Perfil.Editar_Perfil({ id_perfil, nombre_editado, usuario_creacion });
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
    Editar_Modulos_Perfil(id_perfil, modulos) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let modulo of modulos) {
                const B_Modulo = yield this._Query_Perfil.Buscar_Modulo_Perfil(id_perfil, modulo.id_modulo);
                if (!B_Modulo || (B_Modulo === null || B_Modulo === void 0 ? void 0 : B_Modulo.length) <= 0) {
                    ///INSERTAR
                    const Modulos_Insertar = yield this._Query_Perfil.Insertar_Modulo_Perfil(id_perfil, modulo.id_modulo);
                    if (!Modulos_Insertar) {
                        return { error: true, message: 'Error al insertar el nuevo modulo ' }; //!ERROR
                    }
                }
                else {
                    //EDITAR MODULOS
                    const Modulos_Editar = yield this._Query_Perfil.Editar_Modulo_Perfil(id_perfil, modulo);
                    if (!Modulos_Editar) {
                        return { error: true, message: 'Error al editar el modulo' }; //!ERROR
                    }
                    // PREVENIR QUE EL PERFIL QUEDE SIN MODULOS
                    //TODO: SOLUCIONAR.
                    // const modulos = await this._Query_Perfil.Modulos_Perfil(id_perfil)
                    // if (modulos.length == 0) {
                    //     modulo.id_estado = 1
                    //     const Modulos_Editar = await this._Query_Perfil.Editar_Modulo_Perfil(id_perfil, modulo)
                    //     if (!Modulos_Editar) {
                    //         return { error: true, message: 'Error al editar el modulo' } //!ERROR
                    //     }
                    // }
                }
            }
            return { error: false, message: 'Modulos del perfil editados con exito' }; //!ERROR
        });
    }
    Cambiar_Estado_Perfil(id_perfil, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const perfil_editado = yield this._Query_Perfil.Cambiar_Estado_Perfil(id_perfil, estado);
                if (!(perfil_editado === null || perfil_editado === void 0 ? void 0 : perfil_editado.rowCount)) {
                    return { error: true, message: 'Error al editar el perfil' }; //!ERROR
                }
                return { error: false, message: 'Se ha cambiado el estado del perfil' };
            }
            catch (error) {
                console.log(error);
                return { error: true, message: +estado === constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el perfil' : 'Error al desactivar del perfil' }; //!ERROR
            }
        });
    }
    Buscar_Perfil(id_perfil) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const perfil = yield this._Query_Perfil.Buscar_Perfil_ID(id_perfil);
                if (!(perfil === null || perfil === void 0 ? void 0 : perfil.id_perfil)) {
                    return { error: true, message: 'No se ha encontrado este perfil' }; //!ERROR
                }
                // CARGAR LOS MODULOS DEL PERFIL
                const modulos = yield this._Query_Perfil.Modulos_Perfil(id_perfil);
                if (!modulos) {
                    return { error: true, message: 'No se han podido cargar los modulos del perfil' }; //!ERROR
                }
                perfil.modulos = modulos;
                return perfil;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar el perfil' };
            }
        });
    }
}
exports.PerfilService = PerfilService;
