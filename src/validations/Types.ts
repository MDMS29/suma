export type UsuarioLogin = {
    correo: string
    contrasena: string
}

export interface UsuarioLogeado extends UsuarioLogin {
    readonly id_usuario: number
    token: string
}
