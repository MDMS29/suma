"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsusarioSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// const {nombre_completo, usuario, clave, correo} = req.body
exports.UsusarioSchema = zod_1.default.object({
    id_usuario: zod_1.default.number().int().optional(),
    nombre_completo: zod_1.default.string({
        invalid_type_error: 'Debe ingresar un nombre valido'
    }),
    usuario: zod_1.default.string().max(50),
    clave: zod_1.default.string().max(12),
    correo: zod_1.default.string().email({
        message: 'Tipo de correo invalido'
    }),
    roles: zod_1.default.object({ id_rol: zod_1.default.number() }).array(),
    perfiles: zod_1.default.object({ id_perfil: zod_1.default.number() }).array(),
});
