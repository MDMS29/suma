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
        tm.id_estado = $1
`