"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuSchema = exports.RolesSchema = exports.ModulosSchema = exports.PerfilesSchema = exports.UsuarioSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// VALIDACION PARA LOS VALORES DEL USUARIO
exports.UsuarioSchema = zod_1.default.object({
    id_usuario: zod_1.default.number().int().optional(),
    id_empresa: zod_1.default.number({
        invalid_type_error: 'Valor de la empresa invalida',
        required_error: 'Seleccione una empresa para el usuario'
    }).int().optional(),
    nombre_completo: zod_1.default.string({
        invalid_type_error: 'Debe ingresar un nombre valido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    usuario: zod_1.default.string().min(5, {
        message: 'El usuario debe tener mínimo 5 caracteres'
    }).max(50, {
        message: 'El usuario debe tener máximo 50 caracteres'
    }),
    correo: zod_1.default.string().email({
        message: 'Tipo de correo invalido'
    }),
    clave: zod_1.default.string({
        invalid_type_error: 'La clave debe ser alfa numérica',
        required_error: 'Debe ingresar una clave'
    }),
    roles: zod_1.default.object({
        id_rol: zod_1.default.number({
            invalid_type_error: 'Seleccione un permiso existente',
            required_error: 'El usuario debe tener mínimo un permiso'
        }),
        id_estado: zod_1.default.number()
    }).array(),
    perfiles: zod_1.default.object({
        id_perfil: zod_1.default.number({
            invalid_type_error: 'Seleccione un perfil existente',
            required_error: 'El usuario debe tener mínimo un permiso'
        }),
        nombre_perfil: zod_1.default.optional(zod_1.default.string()),
        estado_perfil: zod_1.default.number()
    }).array(),
});
// VALIDACION PARA LOS VALORES DEL PERFIL
exports.PerfilesSchema = zod_1.default.object({
    nombre_perfil: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del perfil es requerido'
    }).min(5, {
        message: 'El nombre de perfil debe contener al menos 5 caracteres'
    }).max(50, {
        message: 'El nombre de perfil excede de los 50 caracteres'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    modulos: zod_1.default.object({
        id_modulo: zod_1.default.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El modulo es requerido'
        }),
        id_estado: zod_1.default.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El estado del modulo es requerido'
        })
    }).array()
});
// VALIDACION PARA LOS VALORES DEL MODULO
exports.ModulosSchema = zod_1.default.object({
    cod_modulo: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El código del modulo es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    nombre_modulo: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del modulo es requerido'
    }).min(5, {
        message: 'El nombre de modulo debe contener al menos 5 caracteres'
    }).max(50, {
        message: 'El nombre de modulo excede de los 50 caracteres'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    icono: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El icono del modulo es requerido'
    }),
    roles: zod_1.default.object({
        id_rol: zod_1.default.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El rol es requerido'
        }),
        id_estado: zod_1.default.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El estado del rol es requerido'
        })
    }).array()
});
// VALIDACION PARA LOS VALORES DEL MODULO
exports.RolesSchema = zod_1.default.object({
    nombre: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del rol es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    descripcion: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La descripción del rol es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
});
// VALIDACION PARA LOS VALORES DE LOS MENUS
exports.MenuSchema = zod_1.default.object({
    nombre_menu: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del menu es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    link_menu: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El link del menu es requerido'
    })
});
