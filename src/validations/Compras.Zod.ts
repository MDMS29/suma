import z from 'zod'

export const RequisicionesSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: "Tipo de la empresa es invalida",
        required_error: "La empresa es requerida"
    }).int(),
    id_proceso: z.number({
        invalid_type_error: "Tipo del proceso es invalido",
        required_error: "Seleccione un proceso para la requisición"
    }).int(),
    id_centro: z.number({
        invalid_type_error: "Tipo del centro es invalido",
        required_error: "Seleccione un centro para la requisición"
    }).int(),
    id_tipo_producto: z.number({
        invalid_type_error: "Valor del tipo de producto es invalido",
        required_error: "Seleccione un tipo de producto para la requisición"
    }).int(),
    consecutivo: z.string({
        invalid_type_error: "Tipo del comentarios es invalido",
        required_error: "Seleccione un centro de costo"
    }),
    comentarios: z.optional(
        z.string({
            invalid_type_error: "Tipo del comentarios es invalido"
        })
    ),
    det_requisicion: z.object({
        id_producto: z.number({
            invalid_type_error: "El valor del producto es invalido",
            required_error: "Seleccione un producto valido"
        }),
        cantidad: z.number({
            invalid_type_error: "El tipo de valor la cantidad es invalida",
            required_error: "Ingrese una cantidad valida"
        }),
        justificacion: z.optional(
            z.string({
                invalid_type_error: "Tipo de la justificación es invalida"
            })
        ),
    }).array()
})

export const FiltroRequisicionesSchema = z.object({
    requisicion: z.string({
        invalid_type_error: "Tipo de dato para el numero de requisición es invalido",
        required_error: "Seleccione un centro de costo"
    }),
    proceso: z.number({
        invalid_type_error: "Tipo de dato del proceso es invalido",
        required_error: "Seleccione un tipo de producto para la requisición"
    }).int(),
    centro_costo: z.number({
        invalid_type_error: "Tipo de dato del centro es invalido",
        required_error: "Seleccione un centro para la requisición"
    }).int(),
    tipo_producto: z.number({
        invalid_type_error: "Tipo de dato del tipo de producto es invalido",
        required_error: "Seleccione un proceso para la requisición"
    }).int(),
    fecha_inicial:  z.string({
        invalid_type_error: "Tipo de dato para la fecha inicial es invalido",
        required_error: "Seleccione un centro de costo"
    }),
    fecha_final:  z.string({
        invalid_type_error: "Tipo de dato para la fecha final es invalido",
        required_error: "Seleccione un centro de costo"
    })
})