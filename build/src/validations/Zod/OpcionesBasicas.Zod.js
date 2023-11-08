"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductosSchema = exports.CentroEmpresaSchema = exports.ProcesoEmpresaSchema = exports.FamiliaProductoSchema = exports.MarcaSchema = exports.TipoProductoSchema = exports.UnidadMedidaSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// VALIDACION PARA LOS VALORES DE LAS UNIDADES DE MEDIDA
exports.UnidadMedidaSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    unidad: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre de la unidad es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
});
// VALIDACION PARA LOS VALORES DE LOS TIPOS DE PRODUCTO
exports.TipoProductoSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    descripcion: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del tipo es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
});
// VALIDACION PARA LOS VALORES DE LAS MARCAS
exports.MarcaSchema = zod_1.default.object({
    marca: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre de la marca es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
});
// VALIDACION PARA LOS VALORES DE LAS FAMILIAS DE LOS PRODUCTOS
exports.FamiliaProductoSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    referencia: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La referencia de la familia es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    descripcion: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La descripcion de la familia es requerida'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
});
// VALIDACION PARA LOS VALORES DE LAS PROCESOS DE LA EMPRESA
exports.ProcesoEmpresaSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    codigo: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El codigo del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    proceso: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    })
});
// VALIDACION PARA LOS VALORES DE LOS CENTROS DE LOS PROCESOS DE LA EMPRESA
exports.CentroEmpresaSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'La empresa es requerida'
    }),
    id_proceso: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El proceso es requerido'
    }),
    codigo: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El codigo del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    consecutivo: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El numero consecutivo es requerido'
    }).positive().int(),
    centro_costo: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del proceso es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    correo_responsable: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido',
        required_error: 'El nombre del proceso es requerido'
    }).email({
        message: "Ingrese un correo valido"
    })
});
exports.ProductosSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido empresa',
        required_error: 'La empresa es requerida'
    }),
    id_familia: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido familia',
        required_error: 'Seleccione una familia para el producto'
    }),
    id_marca: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido marca',
        required_error: 'Seleccione una marca del producto'
    }),
    id_tipo_producto: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido tipo',
        required_error: 'Seleccione el tipo del producto'
    }),
    referencia: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido referencia',
        required_error: 'Ingrese la referencia del producto'
    }),
    id_unidad: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido unidad',
        required_error: 'La unidad de medida del producto es requerida'
    }),
    foto: zod_1.default.optional(zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido foto'
    })),
    descripcion: zod_1.default.string({
        invalid_type_error: 'El tipo de dato es invalido descripcion',
        required_error: 'El nombre del producto es requerido'
    }).regex(/^[a-zA-Z0-9\s]*$/, {
        message: 'No se permiten caracteres especiales'
    }),
    precio_costo: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido precio costo',
        required_error: 'Ingrese el precio de costo del producto'
    }),
    precio_venta: zod_1.default.number({
        invalid_type_error: 'El tipo de dato es invalido precio venta',
        required_error: 'Ingrese el precio de venta del producto'
    }),
    critico: zod_1.default.boolean({
        invalid_type_error: 'El tipo de dato es invalido critico',
        required_error: 'Seleccione si el producto es critico'
    }),
    inventariable: zod_1.default.boolean({
        invalid_type_error: 'El tipo de dato es invalido inventariable',
        required_error: 'Seleccione si el producto es inventariable'
    }),
    compuesto: zod_1.default.boolean({
        invalid_type_error: 'El tipo de dato es invalido compuesto',
        required_error: 'Seleccione si el producto es compuesto'
    }),
    ficha: zod_1.default.boolean({
        invalid_type_error: 'El tipo de dato es invalido ficha',
        required_error: 'Seleccione si el producto requiere una ficha tecnica'
    }),
    certificado: zod_1.default.boolean({
        invalid_type_error: 'El tipo de dato es invalido certificado',
        required_error: 'Seleccione si el producto requiere un certificado'
    })
});
