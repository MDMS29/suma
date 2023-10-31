import z from 'zod'


// VALIDACION PARA LOS VALORES DEL USUARIO
export const UsusarioSchema = z.object({
    id_usuario: z.number().int().optional(),
    id_empresa: z.number().int().optional(),
    nombre_completo: z.string({
        invalid_type_error: 'Debe ingresar un nombre valido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    usuario: z.string().min(5, {
        message: 'El usuario debe tener minimo 5 caracteres'
    }).max(50, {
        message: 'El usuario debe tener maximo 50 caracteres'
    }),
    correo: z.string().email({
        message: 'Tipo de correo invalido'
    }),
    clave: z.string({
        invalid_type_error: 'La clave debe ser alfa numerica',
        required_error: 'Debe ingresar una clave'
    }),
    roles: z.object({
        id_rol: z.number({
            invalid_type_error: 'Seleccione un permiso existente',
            required_error: 'El usuario debe tener minimo un permiso'
        }),
        id_estado: z.number()
    }).array(),
    perfiles: z.object({
        id_perfil: z.number({
            invalid_type_error: 'Seleccione un perfil existente',
            required_error: 'El usuario debe tener minimo un permiso'
        }),
        nombre_perfil: z.optional(z.string()),
        estado_perfil: z.number()
    }).array(),
})

// VALIDACION PARA LOS VALORES DEL PERFIL
export const PerfilesSchema = z.object({
    nombre_perfil: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del perfil es requerido'
    }).min(5, {
        message: 'El nombre de perfil debe contener al menos 5 caracteres'
    }).max(50, {
        message: 'El nombre de perfil excede de los 50 caracteres'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    modulos: z.object({
        id_modulo: z.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El modulo es requerido'
        }),
        id_estado: z.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El estado del modulo es requerido'
        })
    }).array()
})

// VALIDACION PARA LOS VALORES DEL MODULO
export const ModulosSchema = z.object({
    cod_modulo: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El codigo del modulo es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    nombre_modulo: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del modulo es requerido'
    }).min(5, {
        message: 'El nombre de modulo debe contener al menos 5 caracteres'
    }).max(50, {
        message: 'El nombre de modulo excede de los 50 caracteres'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    icono: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El icono del modulo es requerido'
    }),
    roles: z.object({
        id_rol: z.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El rol es requerido'
        }),
        id_estado: z.number({
            invalid_type_error: 'El tipo de dato es invalido',
            required_error: 'El estado del rol es requerido'
        })
    }).array()
})

// VALIDACION PARA LOS VALORES DEL MODULO
export const RolesSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del rol es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    descripcion: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La descripcion del rol es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
})