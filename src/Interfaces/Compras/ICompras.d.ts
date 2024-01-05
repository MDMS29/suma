import { Direccion } from "../IConstants"

export interface Requisicion_Det {
    id_detalle?: number
    id_producto: number
    id_estado?: number
    cantidad: number
    justificacion: string
}

export interface Requisicion_Enc {
    id_requisicion?: number
    id_empresa: number
    consecutivo: string
    id_proceso: number
    id_centro: number
    id_tipo_producto: number
    fecha_requisicion: Date
    hora_requisicion: string
    equipo: any
    comentarios: string
    det_requisicion: Requisicion_Det[]
}

export interface Coordenadas_Requisicion {
    Y?: number,
    LinesH?: number,
    lineHeight?: number,
    item?: number,
    limitePag?: number,
    HRectCabePie2?: number,
    LineasDivCuerpo?: number
    HRectCabePie?: number,
    JumLine?: number,
    LineasDivCabe?: number
}

export interface Filtro_Requisiciones {
    requisicion: string,
    proceso: string | number,
    centro_costo: string | number,
    tipo_producto: string | number,
    estado: string
    fecha_inicial: string
    fecha_final: string
}


/****************  INTERFACES PARA LOS PROVEEDORES  ****************/

export interface Tercero {
    id_tercero?: number
    id_empresa: number
    id_tipo_tercero: number
    id_tipo_documento: number
    documento: string
    nombre: string
    id_direccion?: number
    direccion: Direccion
    telefono: string
    correo: string
    contacto: string
    telefono_contacto: string
    id_estado: number
    suministros?: []
}

/****************  INTERFACES PARA LAS ORDENES  ****************/
interface Detalle_Orden {
    id_detalle?: number;
    id_orden?: number;
    id_requisicion: number;
    id_producto: number;
    cantidad: number;
    precio_compra: number;
    id_iva: number;
    cotizacion: number;
    descuento: number;
    id_estado: number;
}

interface Encabezado_Orden {
    id_orden: number;
    id_empresa: number;
    id_tipo_orden: number;
    tipo_orden: string;
    id_tercero: number;
    nombre_proveedor?: string
    razon_social?: string
    orden: string;
    razon_social: string;
    nombre_proveedor: string;
    forma_pago: string;
    nit_empresa: string;
    nit_proveedor: string;
    direccion_proveedor: string;
    fecha_orden: Date;
    id_forma_pago: number;
    forma_pago: string;
    id_direccion?: number
    lugar_entrega: Direccion
    observaciones?: string;
    cotizacion: string;
    fecha_entrega: Date;
    id_estado?: number;
    total_orden?: number;
    descuento_total?: number;
    iva_total?: number;
    anticipo: number
    telefono_proveedor: number
    detalles_orden: DetalleOrden[];
}

interface Filtro_Ordenes {
    proveedor: number;
    tipo_orden: number;
    fecha_inicial: string;
    fecha_final: string;
    forma_pago: number;
    numero_orden: string;
}