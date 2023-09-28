export const _SeleccionarTodosLosUsuarios = 'SELECT * FROM public.tbl_usuarios'


export const _FALoginUsuario = 'seguridad.login_usuario'

export const _FAModulosUsuario = 'seguridad.modulos_usuario'

export const _FAMenusModulos = 'seguridad.menus_modulo'

export const _FAAccionesModulos = 'seguridad.acciones_modulo'

export const _FAInsertarUsuario = 'seguridad.insertar_usuario'

export const _FNBuscarUsuario = (id_usuario: number, usuario: string, correo: string) => {
    const whereConditions = [];
    if (id_usuario !== 0) {
        whereConditions.push(`u.id_usuario = ${id_usuario}`);
    }
    if (usuario !== '') {
        whereConditions.push(`u.usuario = '${usuario}'`);
    }
    if (correo !== '') {
        whereConditions.push(`u.correo = '${correo}'`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const cadena = `
    SELECT 
        u.id_usuario, u.nombre_completo, u.usuario, u.fecha_creacion, u.correo, e.nombre_estado as estado
    FROM 
        seguridad.tbl_usuario as u
    JOIN seguridad.tbl_estados as e ON e.id_estado = u.id_estado
    ${whereClause}
    GROUP BY u.id_usuario, e.nombre_estado;
    `;

    return cadena;
}

export const _BuscarUsuario = `
    SELECT 
        u.id_usuario, u.nombre_completo, u.usuario, u.fecha_creacion, u.correo, e.nombre_estado as estado
    FROM 
        seguridad.tbl_usuario as u
    JOIN seguridad.tbl_estados as e ON e.id_estado = u.id_estado
    WHERE id_usuario=$1 GROUP BY u.id_usuario, e.nombre_estado;
`

export const _InsertarRolModuloUser = `
    INSERT INTO seguridad.tbl_usuario_roles
    (id_usuario, id_rol_modulo, id_estado)
    VALUES($1, $2, 1);
`

export const _InsertarPerfilUsuario = `
    INSERT INTO seguridad.tbl_perfil_usuario
    (id_usuario, id_perfil, id_estado)
    VALUES($1, $2, 1);
`