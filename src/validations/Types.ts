export type UsuarioLogin = {
    usuario: string
    clave?: string
    captcha: string
}

export type PermisosModulos = {
    readonly id_modulo: string | number;
    nombre_modulo: string;
    id_rol: string | number;
    nombre: string;
}

export type MenusModulos = {
    link_menu: string
    nombre_menu: string
}

export type ModulosUsuario = {
    readonly id_modulo: number
    cod_modulo: string
    nombre_modulo: string
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
    // fecha_modificacion: null;
    // usuario_creacion: string;
    // usuario_modificacion: null;
}

export type MessageError = {
    error: boolean
    message: string
}