export const _SeleccionarTodosLosUsuarios = 'SELECT * FROM public.tbl_usuarios'

export const _LoginUsuario = `
    SELECT 
        u.id_usuario, u.nombre_completo, u.usuario, u.fecha_creacion, 
        u.correo, e.nombre_estado as estado, u.clave, p.id_perfil, p.nombre_perfil
    FROM 
        seguridad.tbl_usuario as u
    JOIN seguridad.tbl_estados as e ON e.id_estado = u.id_estado
    INNER JOIN seguridad.tbl_perfil_usuario as pu ON pu.id_usuario = u.id_usuario
    INNER JOIN seguridad.tbl_perfiles as p ON p.id_perfil = pu.id_perfil
    WHERE pu.id_perfil = $1 AND u.usuario=$2 AND u.id_estado != 2;
`

export const _ModulosUsuario = `
    SELECT
        m.id_modulo, m.cod_modulo, m.nombre_modulo
    FROM 
        seguridad.tbl_modulo_perfiles as mp
    INNER JOIN seguridad.tbl_modulo as m ON m.id_modulo = mp.id_modulo
    WHERE mp.id_perfil = $1
`

export const _AccionModulos = `
    SELECT 
        trm.id_modulo, tm.nombre_modulo, trm.id_rol, tr.nombre 
    FROM 
        seguridad.tbl_usuario as tu 
    INNER JOIN seguridad.tbl_usuario_roles as tur ON tur.id_usuario = tu.id_usuario
    INNER JOIN seguridad.tbl_rol_modulo as trm ON trm.id_rol_modulo = tur.id_rol_modulo
    INNER JOIN seguridad.tbl_roles as tr ON tr.id_rol = trm.id_rol
    INNER JOIN seguridad.tbl_modulo as tm ON tm.id_modulo = trm.id_modulo 
    INNER JOIN seguridad.tbl_modulo_perfiles as tmp ON tmp.id_modulo = tm.id_modulo 
    WHERE tu.id_usuario = $1 AND tmp.id_perfil = $2
`

export const _MenusModulos = `
    SELECT 
        DISTINCT me.nombre_menu, me.link_menu
    FROM 
        seguridad.tbl_modulo as m
    RIGHT JOIN seguridad.tbl_menus as me ON me.id_modulo = m.id_modulo
    WHERE m.id_modulo = $1
`

export const _BuscarUsuario = `
    SELECT 
        u.id_usuario, u.nombre_completo, u.usuario, u.fecha_creacion, u.correo, e.nombre_estado as estado
    FROM 
        seguridad.tbl_usuario as u
    JOIN seguridad.tbl_estados as e ON e.id_estado = u.id_estado
    WHERE id_usuario=$1 GROUP BY u.id_usuario, e.nombre_estado;
`

export const _InsertarUsuario = `
    INSERT INTO 
        seguridad.tbl_usuario
        (id_estado, nombre_completo, usuario, clave, fecha_creacion, usuario_creacion, correo)
    VALUES
        (1, $1, $2, $3, now(), $4, $5) 
    RETURNING id_usuario;
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