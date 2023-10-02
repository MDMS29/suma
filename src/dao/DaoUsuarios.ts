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

export const _MenusUsuario = `
    select 
        tu.id_usuario, tm.nombre_modulo, tme.nombre_menu, tme.link_menu
    from 
        seguridad.tbl_usuario as tu
    inner join seguridad.tbl_perfil_usuario as tpu on tu.id_usuario = tpu.id_usuario
    inner join seguridad.tbl_perfiles as tp on tpu.id_perfil = tp.id_perfil 
    inner join seguridad.tbl_modulo_perfiles as tmp on tmp.id_perfil = tp.id_perfil
    inner join seguridad.tbl_modulo as tm on tm.id_modulo = tmp.id_modulo
    inner join seguridad.tbl_menus as tme on tme.id_modulo = tm.id_modulo 
    where tu.id_usuario= $1 and tpu.id_perfil = $2
    group by tu.id_usuario, tm.nombre_modulo, tme.nombre_menu, tme.link_menu;
`


