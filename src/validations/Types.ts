export interface UsuarioLogin {
    correo: string
    contrasena: string
}

export interface UsuarioLogeado extends UsuarioLogin {
    id_usuario: number
    token: string
}
