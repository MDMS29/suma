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
    fecha_inicial: z.string({
        invalid_type_error: "Tipo de dato para la fecha inicial es invalido",
        required_error: "Seleccione un centro de costo"
    }),
    fecha_final: z.string({
        invalid_type_error: "Tipo de dato para la fecha final es invalido",
        required_error: "Seleccione un centro de costo"
    })
})

export const TercerosSchema = z.object({
    id_tercero: z.number().optional(),
    id_empresa: z.number({
        invalid_type_error: "Tipo de dato para la empresa es invalido",
        required_error: "Debe ingresar una empresa"
    }),
    id_tipo_tercero: z.number({
        invalid_type_error: "Tipo de dato para el tercero es invalido",
        required_error: "Seleccione un tipo de tercero"
    }),
    id_tipo_documento: z.number({
        invalid_type_error: "Tipo de dato para el tipo de documento es invalido",
        required_error: "Seleccione un tipo de documento"
    }),
    documento: z.string({
        invalid_type_error: "Tipo de dato para el documento es invalido",
        required_error: "Ingrese un numero documento"
    }),
    nombre: z.string({
        invalid_type_error: "Tipo de dato para el nombre es invalido",
        required_error: "Ingrese un nombre para el proveedor"
    }),
    direccion: z.string({
        invalid_type_error: "Tipo de dato para la dirección es invalido",
        required_error: "Ingrese la dirección del proveedor"
    }),
    telefono: z.string({
        invalid_type_error: "Tipo de dato para el telefono es invalido",
        required_error: "Ingrese el telefono del proveedor"
    }),
    correo: z.string({
        invalid_type_error: "Tipo de dato para el correo es invalido",
        required_error: "Ingrese el correo del proveedor"
    }).email({
        message: "El correo es invalido"
    }),
    contacto: z.string({
        invalid_type_error: "Tipo de dato para el contacto es invalido",
        required_error: "Ingrese el nombre del contacto"
    }),
    telefono_contacto: z.string({
        invalid_type_error: "Tipo de dato para el telefono del contacto es invalido",
        required_error: "Ingrese el telefono del contacto"
    }),
    id_estado: z.number({
        invalid_type_error: "Tipo de dato para el estado es invalido",
        required_error: "Debe ingresar un estado para el proveedor"
    }),
    suministros: z.array(z.object({
        id_suministro: z.number({
            invalid_type_error: "Tipo de dato para el suministro es invalido",
            required_error: "Ingrese un suministro para el proveedor"
        }).optional(),
        id_tipo_producto: z.number({
            invalid_type_error: "Tipo de dato para el servicio es invalido",
            required_error: "Ingrese un servicio para el proveedor"
        }),
        id_estado: z.number({
            invalid_type_error: "Tipo de dato para el estado del suministro es invalido",
            required_error: "Ingrese un estado para el suministro"
        })
    })).nonempty({
        message: "Ingrese suministros para el proveedor"
    }),
});

