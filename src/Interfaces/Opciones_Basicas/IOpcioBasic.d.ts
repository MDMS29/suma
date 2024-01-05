export interface Unidad_Medida {
    id_unidad?: number
    id_empresa: number
    unidad: string
}

export interface Tipo_Producto {
    id_tipo_producto?: number
    id_empresa: number
    descripcion: string
}

export interface Marca_Producto {
    id_marca?: number
    marca: string
}
export interface Familia_Producto {
    id_familia?: number
    id_empresa: number
    referencia: string
    descripcion: string
    id_estado: number
}

export interface Procesos_Empresa {
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
    consecutivo: number
    centro_costo: string
    correo_responsable: string
    consecutivo: number
    id_estado: number
    fecha_creacion?: Date
    usuario_creacion?: string

    ip?: string | undefined
    ubicacion?: string | undefined
}

export interface Producto_Empresa {
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
};


export interface Iva {
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

export interface Tipo_Orden {
    id_tipo_orden?: number;
    id_empresa: number;
    tipo_orden: string;
    consecutivo: number | string;
    tipos_productos: Tipo_Producto_Orden[]
}