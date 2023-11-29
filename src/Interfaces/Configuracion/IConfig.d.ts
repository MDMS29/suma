export type UsuarioLogin = {
    usuario: string
    clave?: string
    captcha: string
    ip?: string
    ubicacion?: string
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