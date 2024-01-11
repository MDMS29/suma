export const _Obtener_Menu = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu, tm.n_orden
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.id_estado = $1 AND tm.id_modulo = $2
    ORDER BY tm.id_menu DESC;
`

export const _ObtenerUltimoIDMenu = `
    SELECT
        tm.id_menu
    FROM 
        seguridad.tbl_menus tm
    ORDER BY tm.id_menu DESC;
`

export const _InsertarMenu = `
    INSERT INTO 
        seguridad.tbl_menus
        (id_menu, nombre_menu, link_menu, id_modulo, usuario_creacion, fecha_creacion, id_estado, n_orden)
    VALUES
        ($1, $2, $3, $4, $5, now(), 1, $6)
    RETURNING id_menu;
`

export const _BuscarMenuID = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu, tm.n_orden, tm.id_modulo
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.id_menu = $1
    ORDER BY tm.id_menu DESC;  
` 

export const _BuscarMenuNombre = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu, tm.n_orden, tm.id_modulo
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.nombre_menu = $1 AND
        tm.id_estado = 1
    ORDER BY tm.id_menu DESC;  
` 

export const _BuscarMenuOrdenModulo = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu, tm.n_orden, tm.id_modulo
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.id_modulo = $1 AND
        tm.n_orden = $2 AND
        tm.id_estado = 1
    ORDER BY tm.id_menu DESC;  
` 

export const _BuscarMenuOrden = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu, tm.n_orden, tm.id_modulo
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.n_orden = $1 AND
        tm.id_estado = 1
    ORDER BY tm.id_menu DESC;  
` 

export const _EditarMenu = `
    UPDATE 
        seguridad.tbl_menus
    SET
        nombre_menu = $2, link_menu = $3, fecha_modificacion = now(), usuario_modificacion = $4, n_orden = $5
    WHERE
        id_menu = $1
`

export const _CambiarEstadoMenu = `
    UPDATE 
        seguridad.tbl_menus
    SET
       id_estado = $2
    WHERE
        id_menu = $1
`