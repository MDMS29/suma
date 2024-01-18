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
        required_error: 'La descripción de la familia es requerida'
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
        required_error: 'El código del proceso es requerido'
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
        required_error: 'El código del proceso es requerido'
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

// VALIDACION PARA LOS VALORES DE LOS PRODUCTOS DE LA EMPRESA
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

// VALIDACION PARA LOS IVAS DE LA EMPRESA
export const IvaSchema = z.object({
    id_iva: z.number().int().optional(),
    descripcion: z.string({
        invalid_type_error: 'El tipo de dato para el nombre es invalido',
        required_error: 'El nombre del iva es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }).min(5, {
        message: "El nombre del iva debe tener al menos 5 caracteres"
    }),
    porcentaje: z.number({
        invalid_type_error: 'El tipo de dato para el porcentaje es invalida',
        required_error: 'El porcentaje del iva es requerido'
    }),
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
})

// VALIDACION PARA LOS TIPO DE ORDENES DE LA EMPRESA
export const TipoOrdenSchema = z.object({
    id_tipo_orden: z.number().int().optional(),
    tipo_orden: z.string({
        invalid_type_error: 'El tipo de dato para el nombre de tipo orden es invalido',
        required_error: 'El nombre del tipo de orden es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }).min(5, {
        message: "El nombre del tipo de orden debe tener al menos 5 caracteres"
    }),
    consecutivo: z.number({
        invalid_type_error: 'El tipo de dato para el consecutivo es invalido',
        required_error: 'El porcentaje del iva es requerido'
    }),
    id_empresa: z.number({
        invalid_type_error: 'El tipo de dato de la empresa es invalido',
        required_error: 'La empresa es requerida'
    }),
    tipos_productos: z.object({
        id_tipo_producto_orden: z.number().optional(),
        id_tipo_orden: z.number({
            invalid_type_error: 'El tipo de dato para el tipo de orden es invalido',
            required_error: 'El tipo de orden es requerida'
        }).optional(),
        id_tipo_producto: z.number({
            invalid_type_error: 'El tipo de dato para el tipo de producto es invalido',
            required_error: 'El tipo de producto es requerida'
        }),
        id_estado: z.number({
            invalid_type_error: 'El tipo de dato del estado tipo producto es invalido',
            required_error: 'El estado del tipo de producto es requerido'
        }),
    }).array().min(1, {
        message: "Debe agregar al menos un tipo de producto"
    })
})

// VALIDACION PARA LOS TIPOS DE DATOS DE LOS TIPOS DE MOVIMIENTOS
export const TiposMoviemientosSchema = z.object({
    id_tipo_mov: z.number().optional(),
    id_empresa: z.number({
        invalid_type_error: "Tipo de dato de la empresa es invalido",
        required_error: "Debe ingresar una empresa"
    }),
    descripcion: z.string({
        invalid_type_error: "El tipo de datos de la descripcion es invalida",
        required_error: "La descripcion del tipo de movimiento es requerido"
    }),
    tipo_mov: z.number().min(1, {
        message: "Tipo de movimiento invalido"
    }).max(2, {
        message: "Tipo de movimiento invalido"
    }),
});

export const MovBodegaSchema = z.object({
    id_mov_bodega: z.number().optional(),
    id_bodega: z.number({
        invalid_type_error: "El tipo de dato de la bodega es invalido",
        required_error: "La bodega es requerida"
    }).optional(),
    id_tipo_mov: z.number({
        invalid_type_error: "El tipo de dato para tipo de movimiento es invalido",
        required_error: "El tipo de movimiento es requerido"
    }),
    id_estado: z.number({
        invalid_type_error: "El tipo de dato para el estado es invalido",
        required_error: "El estado es requerido"
    }),
});

export const BodegaSchema = z.object({
    id_bodega: z.number().optional(),
    id_empresa: z.number({
        invalid_type_error: "Tipo de dato de la empresa es invalido",
        required_error: "Debe ingresar una empresa"
    }),
    nombre: z.string({
        invalid_type_error: "El tipo de dato del nombre es invalido",
        required_error: "El nombre de la bodega es requerido"
    }),
    con_entradas: z.number({
        invalid_type_error: "El tipo de dato del numero de entradas es invalido",
        required_error: "El numero de entradas es requerido"
    }),
    con_salidas: z.number({
        invalid_type_error: "El tipo de dato del numero de salidas es invalido",
        required_error: "El numero de salidas es requerido"
    }),
    id_estado: z.number({
        invalid_type_error: "El tipo de dato para el estado es invalido",
        required_error: "El estado es requerido"
    }).optional(),
    mov_bodega: z.array(MovBodegaSchema),
});