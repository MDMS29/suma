export const _obtener_requisicion_enc = `
    SELECT 
        tr.id_requisicion, tr.requisicion, tr.id_centro, tc.centro_costo, tr.comentarios, tr.id_estado, 
        te.nombre_estado, tr.fecha_requisicion
    FROM
        tbl_requisiciones tr
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tr.id_centro 
    INNER JOIN seguridad.tbl_estados te ON te.id_estado = tr.id_estado 
    WHERE
        tr.id_estado = $1 AND tr.id_empresa = $2
`

export const _buscar_detalle_requisicion = `
    SELECT 
        trd.id_detalle, trd.id_producto, tp.referencia, tp.descripcion as nombre_producto, tu.unidad,
        trd.cantidad, trd.justificacion
    FROM
        public.tbl_requisicion_detalle trd
    INNER JOIN public.tbl_productos tp  ON tp.id_producto   = trd.id_producto
    INNER JOIN public.tbl_unidad    tu  ON tu.id_unidad     = tp.id_unidad
    WHERE 
        trd.id_requisicion = $1
`

export const _obtener_consecutivo = `
    SELECT 
        tc.id_centro, tc.centro_costo, CONCAT(SUBSTRING(tc.centro_costo, 1,3)	, SUM(tc.consecutivo + 1)) as consecutivo_centro
    FROM 
        public.tbl_centros tc 
    WHERE 
        tc.id_centro = 8
    GROUP BY 
        id_centro, centro_costo
`