export const _SeleccionarTodosLosUsuarios = 'SELECT * FROM public.tbl_usuarios'


export const _FALoginUsuario = 'seguridad.login_usuario'

export const _FAModulosUsuario = 'seguridad.modulos_usuario'

export const _FAMenusModulos = 'seguridad.menus_modulo'

export const _FAAccionesModulos = 'seguridad.acciones_modulo'

export const _FAInsertarUsuario = 'seguridad.insertar_usuario'

export const _FABuscarUsuarioID = 'seguridad.buscar_usuario_id'

export const _FABuscarUsuarioCorreo = 'seguridad.buscar_usuario_correo'

export const _PAInsertarRolModuloUsuario = 'seguridad.insertar_modulo_usuario'

export const _PAInsertarPerfilUsuario = 'seguridad.insertar_perfil_usuario'

// export const _InsertarRolModuloUser = `
//     INSERT INTO seguridad.tbl_usuario_roles
//     (id_usuario, id_rol_modulo, id_estado)
//     VALUES($1, $2, 1);
// `

// export const _InsertarPerfilUsuario = `
//     INSERT INTO seguridad.tbl_perfil_usuario
//     (id_usuario, id_perfil, id_estado)
//     VALUES($1, $2, 1);
// `