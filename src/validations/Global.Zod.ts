import z from 'zod'

export const DireccionSchema = z.object({
    id_lugar_entrega: z.number().optional(),
    tipo_via: z.string(),
    numero_u: z.string(),
    letra_u: z.string().optional().nullable(),
    numero_d: z.string().optional().nullable(),
    complemento_u: z.string().optional().nullable(),
    numero_t: z.string(),
    letra_d: z.string().optional().nullable(),
    complemento_d: z.string().optional().nullable(),
    numero_c: z.string(),
    complemento_f: z.string().optional().nullable(),
    departamento: z.string(),
    municipio: z.string(),
}).partial()