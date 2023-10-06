export const _FALoginUsuario = 'seguridad.login_usuario'

export const _FAModulosUsuario = 'seguridad.modulos_usuario'

export const _FAMenusModulos = 'seguridad.menus_modulo'

export const _FAAccionesModulos = 'seguridad.acciones_modulo'

export const _FAObtenerUsuario = 'seguridad.obtener_usuarios_estado'

export const _FAInsertarUsuario = 'seguridad.insertar_usuario'

export const _FABuscarUsuarioID = 'seguridad.buscar_usuario_id'

export const _FABuscarUsuarioCorreo = 'seguridad.buscar_usuario_correo'

export const _PAInsertarRolModuloUsuario = 'seguridad.insertar_modulo_usuario'

export const _PAInsertarPerfilUsuario = 'seguridad.insertar_perfil_usuario'

export const _EditarUsuario = `
    UPDATE 
        seguridad.tbl_usuario
    SET 
        nombre_completo=$2, usuario=$3, 
        clave=$4, fecha_modificacion=now(), 
        usuario_modificacion=$5, correo=$6
    WHERE 
        id_usuario=$1;
`

export const _BuscarPerfilUsuario = `
    SELECT 
        *
    FROM
        seguridad.tbl_perfil_usuario tpu
    WHERE 
        tpu.id_usuario = $1 AND tpu.id_perfil = $2;
        
`