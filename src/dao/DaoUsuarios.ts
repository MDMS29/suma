export const _SeleccionarTodosLosUsuarios = 'SELECT * FROM public.tbl_usuarios'

export const _LoginUsuario = "SELECT id_usuario, correo, contrasena FROM public.tbl_usuarios WHERE correo= $1 AND contrasena=$2"

export const _BuscarUsuario = "SELECT id_usuario, correo, contrasena FROM public.tbl_usuarios WHERE id_usuario = $1"