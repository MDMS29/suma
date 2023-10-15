export const _ObtenerModulos = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo, tm.icono, tm.id_estado
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.id_estado = $1
`
export const _BuscarModuloNombre = `
    SELECT 
        tm.id_modulo, tm.cod_modulo, tm.nombre_modulo, tm.icono, tm.id_estado
    FROM 
        seguridad.tbl_modulo tm
    WHERE
        tm.nombre_modulo = $1
`

export const _InsertarModulo = `
    INSERT INTO 
        seguridad.tbl_modulo
        (id_modulo, cod_modulo, nombre_modulo, fecha_creacion, usuario_creacion, icono, id_estado)
    VALUES
        (nextval('seguridad.tbl_modulo_id_modulo_seq'::regclass),$1, $2, now(), $3, $4, 1)
    RETURNING id_modulo;

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