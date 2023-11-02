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

// VALIDACION PARA LOS VALORES DE LOS MENUS
export const MenuSchema = z.object({
    nombre_menu: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del menu es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    link_menu: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El link del menu es requerido'
    })
})

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
    }).positive().int(),
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
    id_empresa: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    id_familia: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione una familia para el producto'
    }),
    id_marca: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione una marca del producto'
    }),
    id_tipo_producto: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione el tipo del producto'
    }),
    referencia: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Ingrese la referencia del producto'
    }),
    id_unidad: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La unidad de medida del producto es requerida'
    }),
    foto: z.string({
        invalid_type_error: 'El tipo de dato es invalido'
    }),

    descripcion: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del producto es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    precio_costo: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Ingrese el precio de costo del producto'
    }),
    precio_venta: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Ingrese el precio de venta del producto'
    }),
    critico: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione si el producto es critico'
    }),
    inventariable: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione si el producto es inventariable'
    }),
    compuesto: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione si el producto es compuesto'
    }),
    ficha: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione si el producto requiere una ficha tecnica'
    }),
    certificado: z.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'Seleccione si el producto requiere un certificado'
    })
})