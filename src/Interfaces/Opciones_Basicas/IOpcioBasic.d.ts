import { Logs_Info } from "../IConstants"

export interface Unidad_Medida extends Logs_Info {
    id_unidad?: number
    id_empresa: number
    unidad: string
}

export interface Tipo_Producto extends Logs_Info  {
    id_tipo_producto?: number
    id_empresa: number
    descripcion: string
}

export interface Marca_Producto extends Logs_Info {
    id_marca?: number
    marca: string
}
export interface Familia_Producto extends Logs_Info {
    id_familia?: number
    id_empresa: number
    referencia: string
    descripcion: string
    id_estado: number
}

export interface Procesos_Empresa extends Logs_Info {
    id_proceso?: number
    id_empresa: number
    codigo: string
    proceso: string
    fecha_creacion?: Date
    usuario_creacion?: string
}

export interface Centro_Costo {
    id_centro?: number
    id_empresa?: number
    id_proceso: number
    codigo: string
    centro_costo: string
    correo_responsable: string
    consecutivo: number
    id_estado: number
    fecha_creacion?: Date
    usuario_creacion?: string

    ip?: string | undefined
    ubicacion?: string | undefined
}

export interface Producto_Empresa extends Logs_Info {
    id_producto?: number;
    id_empresa: number;
    id_familia: number;
    id_marca: number;
    id_tipo_producto: number;
    referencia: string;
    id_unidad: number;
    descripcion: string;
    foto?: string;
    precio_costo: number;
    precio_venta: number;
    critico: boolean;
    inventariable: boolean;
    compuesto: boolean;
    ficha: boolean;
    certificado: boolean;
}


export interface Iva extends Logs_Info {
    id_iva?: number;
    descripcion: string;
    porcentaje: number;
    id_empresa: number;
}

export interface Tipo_Producto_Orden {
    id_tipo_producto_orden: number;
    id_tipo_orden?: number;
    id_tipo_producto: number;
    id_estado: number;
}

export interface Tipo_Orden extends Logs_Info {
    id_tipo_orden?: number;
    id_empresa: number;
    tipo_orden: string;
    consecutivo: number | string;
    tipos_productos: Tipo_Producto_Orden[]
}

export interface Tipos_Movimientos extends Logs_Info{
    id_tipo_mov?: number;
    id_empresa:  number;
    descripcion: string;
    tipo_mov:    number;
}

export interface Bodega extends Logs_Info {
    id_bodega:    number;
    id_empresa:   number;
    nombre:       string;
    con_entradas: number;
    con_salidas:  number;
    id_estado:    number;
    mov_bodega:   MOVBodega[];
}

export interface MOVBodega {
    id_mov_bodega: number;
    id_bodega:     number;
    id_tipo_mov:   number;
    id_estado:     number;
}
