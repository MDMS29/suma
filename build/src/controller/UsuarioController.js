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
exports._UsuarioController = void 0;
const Service_Usuario_1 = require("../services/Service.Usuario");
const utils_1 = require("../validations/utils");
class _UsuarioController {
    AutenticarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ServiceUsuario = new Service_Usuario_1._UsuarioService();
            const { correo, contrasena } = req.body;
            try {
                const UsuarioLogin = {
                    correo: (0, utils_1._ParseCorreo)(correo),
                    contrasena
                };
                const val = yield ServiceUsuario.AutenticarUsuario(UsuarioLogin);
                if (val === undefined) {
                    return res.status(400).json({ message: '¡Correo o Contraseña invalidos!' });
                }
                return res.status(200).json(val);
            }
            catch (error) {
                return res.status(400).send(error);
            }
        });
    }
    ObtenerUsuarios(req, res) {
        const { usuario } = req;
        res.json([{ perfil: usuario }, { recursos: [{ nombre: "Usuarios", url: "/usuarios" }] }]);
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
