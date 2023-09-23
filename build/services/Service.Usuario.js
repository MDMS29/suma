"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._UsuarioService = void 0;
const QuerysUsuarios_1 = require("../querys/QuerysUsuarios");
class _UsuarioService {
    constructor() {
        this.ObtenerUsuarios = this.ObtenerUsuarios.bind(this);
        this.CrearUsuario = this.CrearUsuario.bind(this);
        this.ModificarUsuario = this.ModificarUsuario.bind(this);
        this.EliminarUsuario = this.EliminarUsuario.bind(this);
    }
    ObtenerUsuarios() {
        (0, QuerysUsuarios_1.connectAndQuery)();
        // return {origin: '*'};
    }
    CrearUsuario() {
    }
    ModificarUsuario() {
    }
    EliminarUsuario() {
    }
}
exports._UsuarioService = _UsuarioService;
