export const _obtener_ordenes = `
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
        tor.id_tipo_orden = $1 AND
        tor.id_empresa = $2 AND
        tor.id_estado = $3
    ORDER BY tor.id_orden DESC;
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
            fecha_orden, id_forma_pago, id_centro_costo, lugar_entrega, 
            observaciones, cotizacion, fecha_entrega, total_orden, 
            anticipo, id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_ordenes_id_orden_seq'::regclass), 
            $1, $2, $3, $4, 
            $5, $6, $7, $8, 
            $9, $10, $11, $12, 
            $13, 1, now(), $14
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
            descuento, descuento_porcentaje, id_estado
        )
    VALUES
        ( 
            nextval('tbl_orden_detalle_id_detalle_seq'::regclass), 
            $1, $2, $3, 
            $4, $5, $6, 
            $7, $8, $9
        )
    RETURNING id_detalle;
`

export const _buscar_orden_id = `
    SELECT 
        tor.id_orden, tor.id_tipo_orden, tor.id_forma_pago, tor.id_centro_costo, tor.id_tercero, 
        tor.orden, tto.tipo_orden, tt.nombre as nombre_tercero, tfp.forma_pago, 
        tc.centro_costo, tor.fecha_orden, tor.lugar_entrega, tor.observaciones, 
        tor.cotizacion, tor.fecha_entrega, tor.total_orden, tor.anticipo
    FROM
        public.tbl_ordenes tor
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tor.id_centro_costo
    INNER JOIN public.tbl_terceros tt ON tt.id_tercero = tor.id_tercero 
    WHERE 
        tor.id_orden = $1 AND
        tor.id_empresa = $2
    ORDER BY tor.id_orden DESC;
`

export const _buscar_detalle_orden = `
    SELECT 
        tod.id_detalle, tod.id_orden, tod.id_requisicion, tod.id_producto, 
        tod.cantidad, tod.precio_compra, tod.id_iva, tod.descuento, 
        tod.descuento_porcentaje, tod.id_estado

    FROM 
        public.tbl_orden_detalle tod
    WHERE 
        tod.id_estado = $1 AND 
        tod.id_orden != 2;
`

export const _editar_encabezado_orden = `
    UPDATE 
        public.tbl_ordenes
    SET 
        id_tipo_orden=$2, id_tercero=$3, orden=$4, 
        fecha_orden=$5, id_forma_pago=$6, id_centro_costo=$7, 
        lugar_entrega=$8, observaciones=$9, cotizacion=$10, 
        fecha_entrega=$11, total_orden=$12, anticipo=$13
    WHERE 
        id_orden=$1;
`

export const _editar_detalle_orden = `
    UPDATE 
        public.tbl_orden_detalle
    SET 
        id_requisicion=$2, id_producto=$3, cantidad=$4, 
        precio_compra=$5, id_iva=$6, descuento=$7, 
        descuento_porcentaje=$8, id_estado=$9
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