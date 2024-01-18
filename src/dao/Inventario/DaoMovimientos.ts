export const _obtener_movimientos = `
    SELECT 
        tm.id_movimiento, tm.id_bodega, tb.nombre as nombre_bodega, 
        tm.id_tipo_mov, tm.id_orden, tm.observaciones
    FROM 
        public.tbl_movimientos tm
    INNER JOIN public.tbl_bodegas tb ON tb.id_bodega = tm.id_bodega
    WHERE tm.id_empresa = $1 AND tm.id_estado = $2;
`