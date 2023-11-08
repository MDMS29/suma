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
