import z from 'zod'


// VALIDACION PARA LOS VALORES DE LAS UNIDADES DE MEDIDA
export const UnidadMedidaSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    unidad: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre de la unidad es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
})

// VALIDACION PARA LOS VALORES DE LOS TIPOS DE PRODUCTO
export const TipoProductoSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    descripcion: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del tipo es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
})

// VALIDACION PARA LOS VALORES DE LAS MARCAS
export const MarcaSchema = z.object({
    marca: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre de la marca es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
})

// VALIDACION PARA LOS VALORES DE LAS FAMILIAS DE LOS PRODUCTOS
export const FamiliaProductoSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    referencia: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La referencia de la familia es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    descripcion: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La descripcion de la familia es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
})

// VALIDACION PARA LOS VALORES DE LAS PROCESOS DE LA EMPRESA
export const ProcesoEmpresaSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    codigo: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El codigo del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    proceso: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
})

// VALIDACION PARA LOS VALORES DE LOS CENTROS DE LOS PROCESOS DE LA EMPRESA
export const CentroEmpresaSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    id_proceso: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El proceso es requerido'
    }),
    codigo: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El codigo del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    consecutivo: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El numero consecutivo es requerido'
    }),
    centro_costo: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    correo_responsable: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del proceso es requerido'
    }).email({
        message: "Ingrese un correo valido"
    })
})

export const ProductosSchema = z.object({
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido empresa',
        required_error: 'La empresa es requerida'
    }),
    id_familia: z.number({
        invalid_type_error: 'El tipo de dato es invalido familia',
        required_error: 'Seleccione una familia para el producto'
    }),
    id_marca: z.number({
        invalid_type_error: 'El tipo de dato es invalido marca',
        required_error: 'Seleccione una marca del producto'
    }),
    id_tipo_producto: z.number({
        invalid_type_error: 'El tipo de dato es invalido tipo',
        required_error: 'Seleccione el tipo del producto'
    }),
    referencia: z.string({
        invalid_type_error: 'El tipo de dato es invalido referencia',
        required_error: 'Ingrese la referencia del producto'
    }),
    id_unidad: z.number({
        invalid_type_error: 'El tipo de dato es invalido unidad',
        required_error: 'La unidad de medida del producto es requerida'
    }),
    foto: z.optional(z.string({
        invalid_type_error: 'El tipo de dato es invalido foto'
    })),
    descripcion: z.string({
        invalid_type_error: 'El tipo de dato es invalido descripcion',
        required_error: 'El nombre del producto es requerido'
    }),
    precio_costo: z.number({
        invalid_type_error: 'El tipo de dato es invalido precio costo',
        required_error: 'Ingrese el precio de costo del producto'
    }),
    precio_venta: z.number({
        invalid_type_error: 'El tipo de dato es invalido precio venta',
        required_error: 'Ingrese el precio de venta del producto'
    }),
    critico: z.boolean({
        invalid_type_error: 'El tipo de dato es invalido critico',
        required_error: 'Seleccione si el producto es critico'
    }),
    inventariable: z.boolean({
        invalid_type_error: 'El tipo de dato es invalido inventariable',
        required_error: 'Seleccione si el producto es inventariable'
    }),
    compuesto: z.boolean({
        invalid_type_error: 'El tipo de dato es invalido compuesto',
        required_error: 'Seleccione si el producto es compuesto'
    }),
    ficha: z.boolean({
        invalid_type_error: 'El tipo de dato es invalido ficha',
        required_error: 'Seleccione si el producto requiere una ficha tecnica'
    }),
    certificado: z.boolean({
        invalid_type_error: 'El tipo de dato es invalido certificado',
        required_error: 'Seleccione si el producto requiere un certificado'
    })
})