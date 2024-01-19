export const _obtener_movimientos = `
    SELECT 
        tm.id_movimiento, tm.id_bodega, tb.nombre as nombre_bodega, 
        tm.id_tipo_mov, ttm.descripcion as tipo_movimiento,
        tm.id_orden, tor.orden, 
        tm.observaciones
    FROM 
        public.tbl_movimientos tm
    INNER JOIN public.tbl_bodegas       tb  ON  tb.id_bodega    = tm.id_bodega
    INNER JOIN public.tbl_tipos_movs    ttm ON  ttm.id_tipo_mov = tm.id_tipo_mov
    INNER JOIN public.tbl_ordenes       tor ON  tor.id_orden   = tm.id_orden
    WHERE tm.id_empresa = $1 AND tm.id_estado = $2;
`

export const _insertar_movimiento = `
    INSERT INTO 
    public.tbl_movimientos
    (
        id_movimiento, 
        id_bodega, id_tipo_mov, id_orden, observaciones, usuario_regis, fecha_regis, id_estado, id_empresa
    )
    VALUES
    (
        nextval('tbl_movimientos_id_movimiento_seq'::regclass), 
        $2, $3, $4, $5, $6, now(), 1, $1
    )
    RETURNING id_movimiento;
`

export const _insertar_detalle_movimiento = `
    INSERT INTO 
    public.tbl_detalle_mov
    (
        id_detalle, 
        id_movimiento, id_producto, cantidad, precio
    )
    VALUES
    (
        nextval('tbl_detalle_mov_id_detalle_seq'::regclass), 
        $1, $2, $3, $4
    )
    RETURNING id_detalle;
`

export const _buscar_movimiento_id = `
    SELECT 
        tm.id_movimiento, tm.id_bodega, tb.nombre as nombre_bodega, 
        tm.id_tipo_mov, ttm.descripcion as tipo_movimiento,
        tm.id_orden, tor.orden, 
        tm.observaciones
    FROM 
        public.tbl_movimientos tm
    INNER JOIN public.tbl_bodegas       tb  ON  tb.id_bodega    = tm.id_bodega
    INNER JOIN public.tbl_tipos_movs    ttm ON  ttm.id_tipo_mov = tm.id_tipo_mov
    INNER JOIN public.tbl_ordenes       tor ON  tor.id_orden   = tm.id_orden
    WHERE 
        tm.id_estado = 1 AND tm.id_movimiento = $1;
`

export const _buscar_detalle_movimiento = `
    SELECT 
        tdm.id_detalle, tdm.id_movimiento, 
        tdm.id_producto, tp.descripcion as nombre_producto, 
        tdm.cantidad, tdm.precio
    FROM 
        public.tbl_detalle_mov tdm
    INNER JOIN public.tbl_productos tp ON tp.id_producto = tdm.id_producto
    WHERE tdm.id_movimiento = $1;
`

export const _editar_enc_movimiento = `
    UPDATE 
        public.tbl_movimientos
    SET 
        id_bodega=$2, id_tipo_mov=$3, id_orden=$4, observaciones=$5, id_empresa=$6
    WHERE 
        id_movimiento=$1;
`

export const _editar_detalle_movimiento = `
    UPDATE 
        public.tbl_detalle_mov
    SET 
        id_movimiento=$2, id_producto=$3, cantidad=$4, precio=$5
    WHERE 
        id_detalle=$1;
`