export const _ObtenerRoles = `
    SELECT 
        tr.id_rol, tr.nombre, tr.descripcion, tr.id_estado
    FROM 
        seguridad.tbl_roles tr
    WHERE
        tr.id_estado = $1
`

export const _BuscarRolNombre = `
    SELECT 
        * 
    FROM 
        seguridad.tbl_roles tr
    WHERE 
        tr.nombre = $1
`

export const _InsertarRol = `
    INSERT INTO 
        seguridad.tbl_roles
        (id_rol, nombre, descripcion, fecha_creacion, usuario_creacion)
    VALUES
        ( $1, $2,  $3, now(), $4)
    RETURNING id_rol;
`

export const _BuscarRolID = `
    SELECT 
        tr.id_rol, tr.nombre, tr.descripcion, tr.id_estado
    FROM 
        seguridad.tbl_roles tr
    WHERE 
        tr.id_rol = $1
`

export const _ObtenerUltimoID = `
    SELECT 
        tr.id_rol
    FROM 
        seguridad.tbl_roles tr
    ORDER BY 
    tr.id_rol DESC
`
