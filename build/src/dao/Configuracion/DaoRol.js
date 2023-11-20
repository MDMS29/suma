"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._CambiarEstadoRol = exports._EditarRol = exports._ObtenerUltimoID = exports._BuscarRolID = exports._InsertarRol = exports._BuscarRolNombre = exports._ObtenerRoles = void 0;
exports._ObtenerRoles = `
    SELECT 
        tr.id_rol, tr.nombre, tr.descripcion, tr.id_estado
    FROM 
        seguridad.tbl_roles tr
    WHERE
        tr.id_estado = $1
    ORDER BY tr.id_rol DESC
`;
exports._BuscarRolNombre = `
    SELECT 
        * 
    FROM 
        seguridad.tbl_roles tr
    WHERE 
        tr.nombre = $1
`;
exports._InsertarRol = `
    INSERT INTO 
        seguridad.tbl_roles
        (id_rol, nombre, descripcion, fecha_creacion, usuario_creacion)
    VALUES
        ( $1, $2,  $3, now(), $4)
    RETURNING id_rol;
`;
exports._BuscarRolID = `
    SELECT 
        tr.id_rol, tr.nombre, tr.descripcion, tr.id_estado
    FROM 
        seguridad.tbl_roles tr
    WHERE 
        tr.id_rol = $1
`;
exports._ObtenerUltimoID = `
    SELECT 
        tr.id_rol
    FROM 
        seguridad.tbl_roles tr
    ORDER BY 
    tr.id_rol DESC
`;
exports._EditarRol = `
    UPDATE 
        seguridad.tbl_roles
    SET 
        nombre=$2, descripcion=$3, fecha_modificacion=now(), usuario_modificacion=$4
    WHERE 
        id_rol=$1;
`;
exports._CambiarEstadoRol = `
    UPDATE 
        seguridad.tbl_roles
    SET 
        id_estado=$2
    WHERE 
        id_rol=$1;
`;
