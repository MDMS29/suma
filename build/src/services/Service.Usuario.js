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
class _UsuarioService {
    AutenticarUsuario(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correo, contrasena } = object;
            const respuesta = yield (0, QuerysUsuarios_1._QueryAutenticarUsuario)({ correo, contrasena });
            if (respuesta !== undefined) {
                respuesta.token = (0, utils_1.generarJWT)(respuesta.id_usuario);
            }
            return respuesta;
        });
    }
    BuscarUsuario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const respuesta = yield (0, QuerysUsuarios_1._QueryBuscarUsuario)(id);
            return respuesta;
        });
    }
    ObtenerUsuarios() {
    }
    CrearUsuario() {
    }
    ModificarUsuario() {
    }
    EliminarUsuario() {
    }
}
exports._UsuarioService = _UsuarioService;
