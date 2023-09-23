"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._UsuarioController = void 0;
const Service_Usuario_1 = require("../services/Service.Usuario");
class _UsuarioController {
    constructor() {
        this.ObtenerUsuarios = this.ObtenerUsuarios.bind(this);
        this.CrearUsuario = this.CrearUsuario.bind(this);
        this.ModificarUsuario = this.ModificarUsuario.bind(this);
        this.EliminarUsuario = this.EliminarUsuario.bind(this);
    }
    ObtenerUsuarios(_, res) {
        const ServiceUsuario = new Service_Usuario_1._UsuarioService();
        // UsuarioModel.ObtenerUsuarios
        res.send(ServiceUsuario.ObtenerUsuarios());
    }
    CrearUsuario(req, res) {
        res.json(req.body);
    }
    ModificarUsuario(req, res) {
        res.json(req.body);
    }
    EliminarUsuario(_, res) {
        res.send('Eliminar usuario');
    }
}
exports._UsuarioController = _UsuarioController;
