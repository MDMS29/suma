"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilesSchema = exports.UsusarioSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// const {nombre_completo, usuario, clave, correo} = req.body
exports.UsusarioSchema = zod_1.default.object({
    id_usuario: zod_1.default.number().int().optional(),
    nombre_completo: zod_1.default.string({
        invalid_type_error: 'Debe ingresar un nombre valido'
    }),
    usuario: zod_1.default.string().min(5, {
        message: 'El usuario debe tener minimo 5 caracteres'
    }).max(50, {
        message: 'El usuario debe tener maximo 50 caracteres'
    }),
    correo: zod_1.default.string().email({
        message: 'Tipo de correo invalido'
    }),
    clave: zod_1.default.string({
        invalid_type_error: 'La clave debe ser alfa numerica',
        required_error: 'Debe ingresar una clave'
    }),
    roles: zod_1.default.object({
        id_rol: zod_1.default.number({
            invalid_type_error: 'Seleccione un permiso existente',
            required_error: 'El usuario debe tener minimo un permiso'
        })
    }).array(),
    perfiles: zod_1.default.object({
        id_perfil: zod_1.default.number({
            invalid_type_error: 'Seleccione un perfil existente',
            required_error: 'El usuario debe tener minimo un permiso'
        })
    }).array(),
});
exports.PerfilesSchema = zod_1.default.object({
    nombre_perfil: zod_1.default.string().min(5).max(50),
    modulos: zod_1.default.object({
        id_modulo: zod_1.default.number()
    }).array()
});