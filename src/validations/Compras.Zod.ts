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
    id_direccion: z.number().optional(),
    direccion: z.object({ //TODO: COMPONER ESTA WEA
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
    }).partial(),
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

export const OrdenesSchema = z.object({
    id_orden: z.number().optional(),
    id_empresa: z.number({
        invalid_type_error: "Tipo de dato para la empresa es invalido",
        required_error: "Debe ingresar una empresa"
    }),
    id_tipo_orden: z.number({
        invalid_type_error: "Tipo de dato para el tipo de la orden es invalido",
        required_error: "Seleccione el tipo de orden"
    }),
    id_tercero: z.number({
        invalid_type_error: "Tipo de dato para el tercero es invalido",
        required_error: "No se ha encontrado tercero"
    }),
    orden: z.string({
        invalid_type_error: "Tipo de dato para el numero de orden es invalido",
        required_error: "El numero de la orden es requerido"
    }),
    fecha_orden: z.coerce.date({
        invalid_type_error: "Tipo de dato para la fecha de la orden es invalida",
        required_error: "La fecha de la orden es requerida"
    }),
    id_forma_pago: z.number({
        invalid_type_error: "Tipo de dato para la forma de pago es invalida",
        required_error: "Seleccione una forma de pago"
    }),
    lugar_entrega: z.object({ //TODO: COMPONER ESTA WEA
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
    }).partial(),
    observaciones: z.string({
        invalid_type_error: "Tipo de dato para la observacion es invalido"
    }).optional(),
    cotizacion: z.string({
        invalid_type_error: "Tipo de dato para la cotización es invalido",
        required_error: "Ingrese el lugar de la entrega"
    }),
    fecha_entrega: z.coerce.date({
        invalid_type_error: "Tipo de dato para la fecha de entrega es invalida",
        required_error: "La fecha de entrega es requerida"
    }),
    anticipo: z.number({
        invalid_type_error: "Tipo de dato para el anticipo es invalido",
        required_error: "Ingrese un valor valido para el anticipo"
    }),
    id_estado: z.number({
        invalid_type_error: "Tipo de dato para el estado es invalido",
        required_error: "Debe ingresar un estado para el proveedor"
    }).optional(),
    detalles_orden: z.array(
        z.object({
            id_detalle: z.number({
                invalid_type_error: "Tipo de dato para el id del detalle es invalida"
            }).optional().or(z.string().optional()),
            id_orden: z.number({
                invalid_type_error: "Tipo de dato para el id de la orden es invalida",
                required_error: "Asigne una orden al detalle"
            }).optional(),
            id_requisicion: z.number({
                invalid_type_error: "Tipo de dato para el id de la requisicion es invalida",
                required_error: "Asigne una requisicion al detalle"
            }),
            id_producto: z.number({
                invalid_type_error: "Tipo de dato para el id del producto es invalido",
                required_error: "Ingrese un producto al detalle"
            }),
            cantidad: z.number({
                invalid_type_error: "Tipo de dato para la cantidad es invalido",
                required_error: "Ingrese una cantidad para el detalle"
            }).min(1, {
                message: "Ingrese una cantidad mayor a 0"
            }),
            precio_compra: z.number({
                invalid_type_error: "Tipo de dato para la cantidad es invalido",
                required_error: "Ingrese una cantidad para el detalle"
            }).min(100, {
                message: "Ingrese un precio mayor a 100"
            }),
            id_iva: z.number({
                invalid_type_error: "Tipo de dato para el id del iva es invalido",
                required_error: "Seleccione un valor para el iva"
            }),
            descuento: z.number({
                invalid_type_error: "Tipo de dato para el descuento es invalido",
                required_error: "Se requiero un valor para el descuento"
            }).min(1, {
                message: "Ingrese precio mayor a 100"
            }),
            id_estado: z.number({
                invalid_type_error: "Tipo de dato para el estado es invalido",
                required_error: "Debe ingresar un estado para el proveedor"
            }),
        })
    ).nonempty({
        message: "Ingrese los detalles de la orden"
    }),
});