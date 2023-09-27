import z from 'zod'

// const {nombre_completo, usuario, clave, correo} = req.body

export const UsusarioSchema = z.object({
    nombre_completo: z.string(),
    usuario: z.string().max(10),
    clave: z.string().max(12),
    correo: z.string().email({
        message : 'Tipo de correo invalido'
    })
})