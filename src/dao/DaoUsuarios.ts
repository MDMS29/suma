export const _SeleccionarTodosLosUsuarios = 'SELECT * FROM public.tbl_usuarios'

export const _LoginUsuario = `
    SELECT u.id_usuario, u.nombre_completo, u.usuario, u.fecha_creacion, u.correo, e.nombre_estado as estado
    FROM seguridad.tbl_usuario as u
    JOIN seguridad.tbl_estados as e ON e.id_estado = u.id_estado
    WHERE usuario=$1 AND clave=$2 AND u.id_estado != 2 GROUP BY u.id_usuario, e.nombre_estado;
`

export const _ModulosUsuario = `
    SELECT DISTINCT mo.nombre_modulo, mo.cod_modulo, mo.id_modulo
    FROM seguridad.tbl_usuario as u
    JOIN seguridad.tbl_usuario_roles as r ON r.id_usuario = u.id_usuario
    JOIN seguridad.tbl_rol_modulo as rm ON rm.id_rol_modulo = r.id_rol_modulo
    JOIN seguridad.tbl_modulo as mo ON mo.id_modulo = rm.id_modulo
    LEFT JOIN seguridad.tbl_menus as me ON me.id_modulo = mo.id_modulo
    WHERE u.id_usuario = $1 AND rm.id_estado != 2
`

export const _MenusModulos = `
    SELECT DISTINCT me.nombre_menu, me.link_menu
    FROM seguridad.tbl_usuario as u
    JOIN seguridad.tbl_usuario_roles as r ON r.id_usuario = u.id_usuario
    JOIN seguridad.tbl_rol_modulo as rm ON rm.id_rol_modulo = r.id_rol_modulo
    JOIN seguridad.tbl_modulo as mo ON mo.id_modulo = rm.id_modulo
    JOIN seguridad.tbl_menus as me ON me.id_modulo = mo.id_modulo
    WHERE mo.id_modulo = $1 AND rm.id_estado != 2
`

export const _BuscarUsuario = `
    SELECT u.id_usuario, u.nombre_completo, u.usuario, u.fecha_creacion, u.correo, e.nombre_estado as estado
    FROM seguridad.tbl_usuario as u
    JOIN seguridad.tbl_estados as e ON e.id_estado = u.id_estado
    WHERE id_usuario=$1 GROUP BY u.id_usuario, e.nombre_estado;
`

// {
//     id_usuario: 2,
//     id_estado: '1',
//     nombre_completo: 'Moises Mazo',
//     usuario: 'MDMS29',
//     clave: '$2b$10$7kwHDM.QBHDFjuavZG3CRuZDUXjrEsiuS8BJ/SKobXpIJlCGMLLmK',
//     fecha_creacion: 2023-09-27T16:40:43.980Z,
//     fecha_modificacion: null,
//     usuario_creacion: '4',
//     usuario_modificacion: null,
//     correo: 'correo@correo.com'
//   }

export const _InsertarUsuario = `
    INSERT INTO seguridad.tbl_usuario
    (id_estado, nombre_completo, usuario, clave, fecha_creacion, usuario_creacion, correo)
    VALUES(1, $1, $2, $3, now(), $4, $5) 
    RETURNING id_usuario;
`