import { Logs_Info } from "../IConstants";

export interface Movimientos extends Logs_Info {
    id_movimiento: number;
    id_empresa: number;
    id_bodega: number;
    id_tipo_mov: number;
    id_orden: number;
    observaciones: string;
    detalle_movi: DetalleMovi[];
}

export interface DetalleMovi {
    id_detalle: number;
    id_movimiento: number;
    id_producto: number;
    cantidad: number;
    precio: number;
}