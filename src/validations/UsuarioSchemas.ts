import z from 'zod'


// const {nombre_completo, usuario, clave, correo} = req.body
export const UsusarioSchema = z.object({
    id_usuario: z.number().int().optional(),
    nombre_completo: z.string({
        invalid_type_error: 'Debe ingresar un nombre valido'
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
        nombre_modulo: z.optional(z.string()),
        id_modulo: z.optional(z.number()),
        permiso: z.optional(z.string())
    }).array(),
    perfiles: z.object({
        id_perfil: z.number({
            invalid_type_error: 'Seleccione un perfil existente',
            required_error: 'El usuario debe tener minimo un permiso'
        }),
        nombre_perfil: z.optional(z.string()),
        estado_perfil: z.optional(z.number())
    }).array(),
})


export const PerfilesSchema = z.object({
    nombre_perfil: z.string().min(5).max(50),
    modulos: z.object({
        id_modulo: z.number()
    }).array()
})