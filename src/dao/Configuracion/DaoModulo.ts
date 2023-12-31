export const _ObtenerModulos = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo, tm.icono, tm.id_estado
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.id_estado = $1
    ORDER BY tm.id_modulo DESC
`
export const _BuscarModuloNombre = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo, tm.icono, tm.id_estado
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.nombre_modulo = $1
`

export const _ObtenerRolesModulo = `
    SELECT 
        trm.id_rol , tr.nombre, trm.id_estado
    FROM 
        seguridad.tbl_rol_modulo trm 
    INNER JOIN seguridad.tbl_roles tr on tr.id_rol = trm.id_rol 
    WHERE 
        trm.id_modulo = $1 AND trm.id_estado = 1 ORDER BY trm.id_rol ASC ;
`

export const _InsertarModulo = `
    INSERT INTO 
        seguridad.tbl_modulo
        (id_modulo, cod_modulo, nombre_modulo, fecha_creacion, usuario_creacion, icono, id_estado)
    VALUES
        (nextval('seguridad.tbl_modulo_id_modulo_seq'::regclass),$1, $2, now(), $4, $3, 1)
    RETURNING id_modulo;

`

export const _InsertarRolModulo = `
    INSERT INTO 
        seguridad.tbl_rol_modulo
        (id_rol_modulo, id_modulo, id_estado, fecha_creacion, id_rol, usuario_creacion)
    VALUES
        ($1, $2, 1, now(), $3, $4)
    RETURNING id_rol_modulo;

`

export const _BuscarCodigoModulo = `
    SELECT 
        cod_modulo
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.cod_modulo = $1
`

export const _BuscarModuloID = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo, tm.icono, tm.id_estado
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.id_modulo = $1
`

export const _EditarModulo = `
    UPDATE 
        seguridad.tbl_modulo
    SET 
        cod_modulo=$2, nombre_modulo=$3, icono=$4, fecha_modificacion=now(), usuario_modificacion=$5 
    WHERE 
        id_modulo=$1;
`

export const _BuscarIconoModulo = `
    SELECT 
        icono
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.icono = $1
`

export const _CambiarEstadoModulo = `
    UPDATE 
        seguridad.tbl_modulo
    SET 
        id_estado=$2
    WHERE 
        id_modulo=$1;
`

export const _ObtenerUltimoID = `
    SELECT 
        trm.id_rol_modulo 
    FROM 
        seguridad.tbl_rol_modulo trm 
    ORDER BY
        trm.id_rol_modulo 
        DESC LIMIT 1;
`

export const _BuscarRolModulo = `
    SELECT 
        trm.id_rol_modulo 
    FROM 
        seguridad.tbl_rol_modulo trm 
    WHERE trm.id_modulo = $1 
        AND trm.id_rol = $2;
`

export const _EditarRolModulo = `
    UPDATE 
        seguridad.tbl_rol_modulo trm
    SET 
        id_estado=$2
    WHERE 
        trm.id_rol_modulo = $1;
`