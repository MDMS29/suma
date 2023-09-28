export type UsuarioLogin = {
    perfil?: string
    usuario: string
    clave?: string
}

export type PermisosModulos = {
    id_modulo: string | number;
    nombre_modulo: string;
    id_rol: string | number;
    nombre: string;
}

export type MenusModulos = {
    link_menu: string
    nombre_menu: string
}

export type ModulosUsuario = {
    id_modulo: number
    cod_modulo: string
    nombre_modulo: string
    menus?: MenusModulos[]
}
export interface UsuarioLogeado extends UsuarioLogin {
    id_usuario: number;
    id_perfil: number
    nombre_completo: string;
    usuario: string;
    fecha_creacion: Date;
    correo: null | string;
    estado: string;
    token?: string;
    modulos?: ModulosUsuario[]
    permisos?: PermisosModulos[]
    // id_estado?: string;
    // fecha_modificacion: null;
    // usuario_creacion: string;
    // usuario_modificacion: null;
}
