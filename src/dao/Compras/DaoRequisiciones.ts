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

export const _buscar_requisicion_consecutivo = `
    SELECT 
        tr.id_requisicion, tr.requisicion, tr.id_centro, tc.centro_costo, tr.comentarios, tr.id_estado, 
        te.nombre_estado, tr.fecha_requisicion
    FROM
        tbl_requisiciones tr
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tr.id_centro 
    INNER JOIN seguridad.tbl_estados te ON te.id_estado = tr.id_estado 
    WHERE
        tr.requisicion = $1
`

export const _insertar_requisicion_enc = `
    INSERT INTO 
        public.tbl_requisiciones
        (
            id_requisicion, 
            id_empresa, id_proceso, id_centro,
            id_tipo_producto, requisicion, fecha_requisicion,
            hora_requisicion, comentarios, equipo, 
            id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_requisiciones_id_requisicion_seq'::regclass), 
            $1, $2, $3, 
            $4, $5, $6, 
            $7, $8, $9, 
            3, now(), $10
        )
    RETURNING id_requisicion;
`

export const _insertar_requisicion_det = `
    INSERT INTO 
        public.tbl_requisicion_detalle
        (
            id_detalle, 
            id_requisicion, 
            id_producto, cantidad, justificacion, 
            id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_requisicion_detalle_id_detalle_seq'::regclass), 
            $1,
            $2, $3, $4, 
            1, now(), $5
        )
    RETURNING id_detalle;
`

export const _buscar_requisicion_id = ` 
    SELECT 
        tr.id_requisicion, tr.requisicion, tr.id_centro, tc.centro_costo, tr.comentarios, tr.id_estado, 
        te.nombre_estado, tr.fecha_requisicion
    FROM
        tbl_requisiciones tr
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tr.id_centro 
    INNER JOIN seguridad.tbl_estados te ON te.id_estado = tr.id_estado 
    WHERE
        tr.id_requisicion = $1
`