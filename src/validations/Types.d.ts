export type UsuarioLogin = {
    usuario: string
    clave?: string
    captcha: string
}

export type PermisosModulos = {
    readonly id_modulo: string | number;
    nombre_modulo: string;
    id_rol_modulo: string | number;
    nombre: string;
    id_estado: string | number;
}

export type MenusModulos = {
    link_menu: string
    nombre_menu: string
}

export type ModulosUsuario = {
    readonly id_modulo: number
    cod_modulo: string
    nombre_modulo: string
    icono?: string
    menus: MenusModulos[]
    permisos: PermisosModulos[]
}

export type PerfilUsuario = {
    readonly id_perfil: number,
    nombre_perfil: string,
    estado_perfil: number
    modulos: ModulosUsuario[]
}

export interface UsuarioLogueado extends UsuarioLogin {
    id_usuario: number
    nombre_completo: string
    usuario: string
    correo: string
    fecha_creacion?: Date
    id_estado?: string
    token?: string


    id_perfil?: number
    nombre_perfil: string
    perfiles?: PerfilUsuario
    modulos?: ModulosUsuario[]
}

export type MessageError = {
    error: boolean
    message: string
}

export interface Empresa {
    id_empresa?: number
    nit: string
    razon_social: string
    direccion: string
    telefono: string
    correo: string
}

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
    centro_costo: string
    correo_responsable: string
    consecutivo: number
    id_estado: number
    fecha_creacion?: Date
    usuario_creacion?: string
}