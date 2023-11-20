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
    equipo: any  //TODO: PREGUNTAR QUE ES  "EQUIPO"
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
    proceso: string,
    centro_costo: string,
    tipo_producto: string,
    estado: string
}