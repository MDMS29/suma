export interface Direccion {
    id_lugar_entrega?: number;
    id_direccion?: number;
    tipo_via: string;
    numero_u: number;
    letra_u: string;
    numero_d: number;
    complemento_u: string;
    numero_t: number;
    letra_d: string;
    complemento_d: string;
    numero_c: number;
    complemento_f: string;
    departamento: string;
    municipio: string;
}

export interface Logs_Info {
    usuario: string
    ip: string
    ubicacion: string
}