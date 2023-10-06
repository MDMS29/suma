import z from 'zod'


// const {nombre_completo, usuario, clave, correo} = req.body
export const UsusarioSchema = z.object({
    id_usuario : z.number().int().optional(),
    nombre_completo: z.string({
        invalid_type_error: 'Debe ingresar un nombre valido'
    }),
    usuario: z.string().max(50),
    clave: z.string().max(12),
    correo: z.string().email({
        message: 'Tipo de correo invalido'
    }),
    roles: z.object({ id_rol: z.number() }).array(),
    perfiles: z.object({ id_perfil: z.number() }).array(),
})