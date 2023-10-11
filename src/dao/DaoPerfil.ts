export const _ObtenerPerfiles = `
    SELECT 
        id_perfil, nombre_perfil, id_estado 
    FROM 
        seguridad.tbl_perfiles tp 
    WHERE  
        tP.id_estado = $1
`

export const _ObtenerModulosPerfil = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo
    FROM 
        seguridad.tbl_modulo_perfiles tp
    
    INNER JOIN seguridad.tbl_modulo tm ON tm.id_modulo = tp.id_modulo
    WHERE 
        tp.id_perfil = $1 AND
        tp.id_estado != 2;
`

export const _InsertarPerfil = `
    INSERT INTO 
        seguridad.tbl_perfiles
        (id_perfil, nombre_perfil, id_estado, fecha_creacion, usuario_creacion)
    VALUES
        (nextval('seguridad.tbl_perfiles_id_perfil_seq'::regclass), $1, 1, now(), $2)
    RETURNING id_perfil;
`

export const _InsertarModuloPerfil = `
    INSERT INTO 
        seguridad.tbl_modulo_perfiles
        (id_perfil, id_modulo, id_estado)
    VALUES
        ($1, $2, 1);
`

export const _BuscarPerfilID = `
    SELECT 
        tp.id_perfil, tp.nombre_perfil, tp.id_estado 
    FROM 
        seguridad.tbl_perfiles tp 
    WHERE 
        tp.id_perfil = $1
`

export const _BuscarPerfilNombre = `
    SELECT 
        tp.id_perfil, tp.nombre_perfil, tp.id_estado 
    FROM 
        seguridad.tbl_perfiles tp 
    WHERE 
        tp.nombre_perfil = $1
`

export const _PermisosModulosPerfil = `
    SELECT 
        distinct trm.id_rol, tr.nombre, trm.id_rol_modulo
    FROM seguridad.tbl_rol_modulo trm
    INNER JOIN seguridad.tbl_modulo tm ON tm.id_modulo = trm.id_modulo
    INNER JOIN seguridad.tbl_roles tr ON tr.id_rol = trm.id_rol
    WHERE 
        trm.id_modulo = $1
`

export const _EditarPerfil = `
    UPDATE 
        seguridad.tbl_perfiles
    SET 
        nombre_perfil=$2, fecha_modificacion=now(), usuario_modificacion=$3
    WHERE 
        id_perfil=$1;
`

export const _BuscarModulosPerfil = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo
    FROM 
        seguridad.tbl_modulo_perfiles tp

    INNER JOIN seguridad.tbl_modulo tm ON tm.id_modulo = tp.id_modulo
    WHERE 
        tp.id_perfil = $1 AND
        tm.id_modulo = $2;
`

export const _EditarModuloPerfil = `
    UPDATE 
        seguridad.tbl_modulo_perfiles
    SET
        id_estado=$3
    WHERE  
        id_perfil=$1 AND 
        id_modulo=$2;
`

export const _CambiarEstadoPerfil = `
    UPDATE 
        seguridad.tbl_perfiles
    SET
        id_estado=$2
    WHERE  
        id_perfil=$1;
`