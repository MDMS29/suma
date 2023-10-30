"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._CambiarEstadoMenu = exports._EditarMenu = exports._BuscarMenuNombre = exports._BuscarMenuID = exports._InsertarMenu = exports._ObtenerUltimoIDMenu = exports._Obtener_Menu = void 0;
exports._Obtener_Menu = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.id_estado = $1 AND tm.id_modulo = $2
    ORDER BY tm.id_menu DESC;
`;
exports._ObtenerUltimoIDMenu = `
    SELECT
        tm.id_menu
    FROM 
        seguridad.tbl_menus tm
    ORDER BY tm.id_menu DESC;
`;
exports._InsertarMenu = `
    INSERT INTO 
        seguridad.tbl_menus
        (id_menu, nombre_menu, link_menu, id_modulo, usuario_creacion, fecha_creacion, id_estado)
    VALUES
        ($1, $2, $3, $4, $5, now(), 1)
    RETURNING id_menu;
`;
exports._BuscarMenuID = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.id_menu = $1
    ORDER BY tm.id_menu DESC;  
`;
exports._BuscarMenuNombre = `
    SELECT 
        tm.id_menu, tm.nombre_menu, tm.link_menu
    FROM 
        seguridad.tbl_menus tm
    WHERE
        tm.nombre_menu = $1
    ORDER BY tm.id_menu DESC;  
`;
exports._EditarMenu = `
    UPDATE 
        seguridad.tbl_menus
    SET
        nombre_menu = $2, link_menu = $3, fecha_modificacion = now(), usuario_modificacion = $4
    WHERE
        id_menu = $1
`;
exports._CambiarEstadoMenu = `
    UPDATE 
        seguridad.tbl_menus
    SET
       id_estado = $2
    WHERE
        id_menu = $1
`;
