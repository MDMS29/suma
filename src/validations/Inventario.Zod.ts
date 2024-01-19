import * as z from "zod";


const DetalleMoviSchema = z.object({
    id_detalle: z.number().optional(),
    id_producto: z.number({
        invalid_type_error: "El tipo de dato para producto es invalido",
        required_error: "Debe ingresar el producto"
    }),
    cantidad: z.number({
        invalid_type_error: "El tipo de dato de la cantidad es invalida",
        required_error: "La cantidad del producto es invalido",
    }),
    precio: z.number({
        invalid_type_error: "El tipo de dato para el precio es invalido",
        required_error: "El precio es requerido"
    }),
});

export const MovimientosSchema = z.object({
    id_movimiento: z.number().optional(),
    id_bodega: z.number({
        invalid_type_error: "El tipo de dato para la bodega es invalida",
        required_error: "Seleccione una bodega"
    }),
    id_tipo_mov: z.number({
        invalid_type_error: "El tipo de dato para el tipo de movimiento es invalido",
        required_error: "Debe seleccionar un tipo de movimiento"
    }),
    id_orden: z.number({
        invalid_type_error: "El tipo de dato para la orden es invalida",
        required_error: "Seleccione una orden"
    }),
    observaciones: z.string({
        invalid_type_error: "El tipo de dato para la observacion es invalida",
        required_error: "El estado es requerido"
    }).optional(),
    detalle_movi: z.array(DetalleMoviSchema).nonempty({
        message: "Debe ingresar detalles para el movimiento"
    }),
});