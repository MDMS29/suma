"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequisicionesSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.RequisicionesSchema = zod_1.default.object({
    id_empresa: zod_1.default.number({
        invalid_type_error: "Tipo de la empresa es invalida",
        required_error: "La empresa es requerida"
    }).int(),
    id_proceso: zod_1.default.number({
        invalid_type_error: "Tipo del proceso es invalido",
        required_error: "Seleccione un proceso para la requisicion"
    }).int(),
    id_centro: zod_1.default.number({
        invalid_type_error: "Tipo del centro es invalido",
        required_error: "Seleccione un centro para la requisicion"
    }).int(),
    id_tipo_producto: zod_1.default.number({
        invalid_type_error: "Valor del tipo de producto es invalido",
        required_error: "Seleccione un tipo de producto para la requisicion"
    }).int(),
    consecutivo: zod_1.default.string({
        invalid_type_error: "Tipo del comentarios es invalido",
        required_error: "Seleccione un centro de costo"
    }),
    comentarios: zod_1.default.optional(zod_1.default.string({
        invalid_type_error: "Tipo del comentarios es invalido"
    })),
    det_requisicion: zod_1.default.object({
        id_producto: zod_1.default.number({
            invalid_type_error: "El valor del producto es invalido",
            required_error: "Seleccione un producto valido"
        }),
        cantidad: zod_1.default.number({
            invalid_type_error: "El tipo de valor la cantidad es invalida",
            required_error: "Ingrese una cantidad valida"
        }),
        justificacion: zod_1.default.optional(zod_1.default.string({
            invalid_type_error: "Tipo de la justificacion es invalida"
        })),
    }).array()
});
