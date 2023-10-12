"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._CambiarEstadoPerfil = exports._EditarModuloPerfil = exports._BuscarModulosPerfil = exports._EditarPerfil = exports._PermisosModulosPerfil = exports._BuscarPerfilNombre = exports._BuscarPerfilID = exports._InsertarModuloPerfil = exports._InsertarPerfil = exports._ObtenerModulosPerfil = exports._ObtenerPerfiles = void 0;
exports._ObtenerPerfiles = `
    SELECT 
        id_perfil, nombre_perfil, id_estado 
    FROM 
        seguridad.tbl_perfiles tp 
    WHERE  
        tP.id_estado = $1
`;
exports._ObtenerModulosPerfil = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo
    FROM 
        seguridad.tbl_modulo_perfiles tp
    
    INNER JOIN seguridad.tbl_modulo tm ON tm.id_modulo = tp.id_modulo
    WHERE 
        tp.id_perfil = $1 AND
        tp.id_estado != 2;
`;
exports._InsertarPerfil = `
    INSERT INTO 
        seguridad.tbl_perfiles
        (id_perfil, nombre_perfil, id_estado, fecha_creacion, usuario_creacion)
    VALUES
        (nextval('seguridad.tbl_perfiles_id_perfil_seq'::regclass), $1, 1, now(), $2)
    RETURNING id_perfil;
`;
exports._InsertarModuloPerfil = `
    INSERT INTO 
        seguridad.tbl_modulo_perfiles
        (id_perfil, id_modulo, id_estado)
    VALUES
        ($1, $2, 1);
`;
exports._BuscarPerfilID = `
    SELECT 
        tp.id_perfil, tp.nombre_perfil, tp.id_estado 
    FROM 
        seguridad.tbl_perfiles tp 
    WHERE 
        tp.id_perfil = $1
`;
exports._BuscarPerfilNombre = `
    SELECT 
        tp.id_perfil, tp.nombre_perfil, tp.id_estado 
    FROM 
        seguridad.tbl_perfiles tp 
    WHERE 
        tp.nombre_perfil = $1
`;
exports._PermisosModulosPerfil = `
    SELECT 
        distinct trm.id_rol, tr.nombre, trm.id_rol_modulo
    FROM seguridad.tbl_rol_modulo trm
    INNER JOIN seguridad.tbl_modulo tm ON tm.id_modulo = trm.id_modulo
    INNER JOIN seguridad.tbl_roles tr ON tr.id_rol = trm.id_rol
    WHERE 
        trm.id_modulo = $1
`;
exports._EditarPerfil = `
    UPDATE 
        seguridad.tbl_perfiles
    SET 
        nombre_perfil=$2, fecha_modificacion=now(), usuario_modificacion=$3
    WHERE 
        id_perfil=$1;
`;
exports._BuscarModulosPerfil = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo
    FROM 
        seguridad.tbl_modulo_perfiles tp

    INNER JOIN seguridad.tbl_modulo tm ON tm.id_modulo = tp.id_modulo
    WHERE 
        tp.id_perfil = $1 AND
        tm.id_modulo = $2;
`;
exports._EditarModuloPerfil = `
    UPDATE 
        seguridad.tbl_modulo_perfiles
    SET
        id_estado=$3
    WHERE  
        id_perfil=$1 AND 
        id_modulo=$2;
`;
exports._CambiarEstadoPerfil = `
    UPDATE 
        seguridad.tbl_perfiles
    SET
        id_estado=$2
    WHERE  
        id_perfil=$1;
`;
