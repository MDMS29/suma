export const _FA_filtro_ordenes = 'public.fnc_obtener_ordenes_filtro'

export const _obtener_ordenes = `
    SELECT 
        tor.id_orden, tor.orden, tto.tipo_orden, tt.nombre as nombre_tercero, tfp.forma_pago, 
        tor.fecha_orden, tor.lugar_entrega, tor.observaciones, 
        tor.cotizacion, tor.fecha_entrega, tor.total_orden, tor.anticipo
    FROM
        public.tbl_ordenes tor
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_terceros tt ON tt.id_tercero = tor.id_tercero 
    WHERE
        tor.id_empresa = $1 AND
        tor.id_estado = $2
    ORDER BY tor.id_orden DESC
    LIMIT 20;
`

export const _buscar_numero_orden = `
    SELECT 
        tor.id_orden, tor.orden, tto.tipo_orden, tt.nombre as nombre_tercero, tfp.forma_pago, 
        tc.centro_costo, tor.fecha_orden, tor.lugar_entrega, tor.observaciones, 
        tor.cotizacion, tor.fecha_entrega, tor.total_orden, tor.anticipo
    FROM
        public.tbl_ordenes tor
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tor.id_centro_costo
    INNER JOIN public.tbl_terceros tt ON tt.id_tercero = tor.id_tercero 
    WHERE 
        tor.orden = $1 AND
        tor.id_empresa = $2 AND
        tor.id_tipo_orden = $3
    ORDER BY tor.id_orden DESC;
`

export const _insertar_orden = `
    INSERT INTO 
        public.tbl_ordenes
        (
            id_orden, 
            id_empresa, id_tipo_orden, id_tercero, orden, 
            fecha_orden, id_forma_pago, lugar_entrega, 
            observaciones, cotizacion, fecha_entrega, total_orden, 
            anticipo, id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_ordenes_id_orden_seq'::regclass), 
            $1, $2, $3, $4, 
            $5, $6, $7, 
            $8, $9, $10, $11, 
            $12, 3, now(), $13
        )
    RETURNING id_orden;
`

export const _insertar_orden_detalle = `
    INSERT INTO 
        public.tbl_orden_detalle
        (
            id_detalle, 
            id_orden, id_requisicion, id_producto, 
            cantidad, precio_compra, id_iva, 
            descuento, id_estado
        )
    VALUES
        ( 
            nextval('tbl_orden_detalle_id_detalle_seq'::regclass), 
            $1, $2, $3, 
            $4, $5, $6, 
            $7, $8
        )
    RETURNING id_detalle;
`

export const _buscar_orden_id = `
    SELECT 
        tor.id_orden, tor.id_tipo_orden, tor.id_forma_pago, tor.id_tercero, 
        tor.orden, tto.tipo_orden, tt.nombre as nombre_tercero, tfp.forma_pago,
        tor.fecha_orden, tor.lugar_entrega, tor.observaciones, 
        tor.cotizacion, tor.fecha_entrega, tor.total_orden, tor.anticipo
    FROM
        public.tbl_ordenes tor
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_terceros tt ON tt.id_tercero = tor.id_tercero 
    WHERE 
        tor.id_orden = $1 AND
        tor.id_empresa = $2
    ORDER BY tor.id_orden DESC;
`

export const _buscar_detalle_orden = `
    SELECT 
        tod.id_detalle, tod.id_orden, tod.id_requisicion, tod.id_producto, 
        tod.cantidad, tod.precio_compra, tod.id_iva, tod.descuento, tod.id_estado
    FROM 
        public.tbl_orden_detalle tod
    WHERE 
        tod.id_orden = $1 AND 
        tod.id_estado = 3;
`

export const _editar_encabezado_orden = `
    UPDATE 
        public.tbl_ordenes
    SET 
        id_tipo_orden=$2, id_tercero=$3, orden=$4, 
        fecha_orden=$5, id_forma_pago=$6,
        lugar_entrega=$7, observaciones=$8, cotizacion=$9, 
        fecha_entrega=$10, total_orden=$11, anticipo=$12
    WHERE 
        id_orden=$1;
`

export const _editar_detalle_orden = `
    UPDATE 
        public.tbl_orden_detalle
    SET 
        id_requisicion=$2, id_producto=$3, cantidad=$4, 
        precio_compra=$5, id_iva=$6, descuento=$7, id_estado=$8
    WHERE 
        id_detalle=$1;
`

export const _eliminar_restaurar_orden = `
    UPDATE 
        public.tbl_ordenes
    SET 
        id_estado=$2
    WHERE 
        id_orden=$1;
`
