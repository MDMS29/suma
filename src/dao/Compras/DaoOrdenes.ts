export const _FA_obtener_ordenes = 'public.fnc_obtener_ordenes_filtro'

export const _FA_filtrar_ordenes = 'public.fnc_filtrar_ordenes'

export const _obtener_ordenes = `
    SELECT 
        tor.id_orden, tor.orden, tto.tipo_orden, tt.nombre as nombre_tercero, tfp.forma_pago, 
        SUBSTRING(CAST(tor.fecha_orden AS VARCHAR) FROM 1 FOR 10) AS fecha_orden, tor.id_lugar_entrega, tor.observaciones, 
        tor.cotizacion, SUBSTRING(CAST(tor.fecha_entrega AS VARCHAR) FROM 1 FOR 10) AS fecha_entrega, tor.total_orden, tor.anticipo,
        tu.nombre_completo as usuario_aprobacion, SUBSTRING(CAST(tor.fecha_aprobacion AS VARCHAR) FROM 1 FOR 10) AS fecha_aprobacion
    FROM
        public.tbl_ordenes tor
    LEFT JOIN tbl_direcciones tdir ON tdir.id_direccion = tor.id_lugar_entrega
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_terceros tt ON tt.id_tercero = tor.id_tercero 
    LEFT JOIN seguridad.tbl_usuario tu ON tu.id_usuario = tor.usuario_aprobacion
    WHERE
        tor.id_empresa = $1 AND
        tor.id_estado = $2
    ORDER BY tor.id_orden DESC
    LIMIT 20;
`

export const _buscar_numero_orden = `
    SELECT 
        tor.id_orden, tor.orden, tto.tipo_orden, tt.nombre as nombre_tercero, tfp.forma_pago, 
        SUBSTRING(CAST(tor.fecha_orden AS VARCHAR) FROM 1 FOR 10) AS fecha_orden, tor.id_lugar_entrega, tor.observaciones, 
        tor.cotizacion, SUBSTRING(CAST(tor.fecha_entrega AS VARCHAR) FROM 1 FOR 10) AS fecha_entrega, tor.total_orden, tor.anticipo
    FROM
        public.tbl_ordenes tor
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
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
            fecha_orden, id_forma_pago, id_lugar_entrega, 
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
        SUBSTRING(CAST(tor.fecha_orden AS VARCHAR) FROM 1 FOR 10) AS fecha_orden, tor.observaciones, 
        tor.cotizacion, SUBSTRING(CAST(tor.fecha_entrega AS VARCHAR) FROM 1 FOR 10) AS fecha_entrega, tor.total_orden, tor.anticipo, tor.total_orden,
        to_jsonb(
            json_build_object(
                'id_lugar_entrega', tdir.id_direccion,
                'tipo_via', tdir.tipo_via,
                'numero_u', tdir.numero_u,
                'letra_u', CASE WHEN tdir.letra_u IS NOT NULL THEN tdir.letra_u ELSE '' END,
                'numero_d', CASE WHEN tdir.numero_d IS NOT NULL THEN tdir.numero_d ELSE '' END,
                'complemento_u', CASE WHEN tdir.complemento_u IS NOT NULL THEN tdir.complemento_u ELSE '' END,
                'numero_t', tdir.numero_t,
                'letra_d', CASE WHEN tdir.letra_d IS NOT NULL THEN tdir.letra_d ELSE '' END,
                'complemento_d', CASE WHEN tdir.complemento_d IS NOT NULL THEN tdir.complemento_d ELSE '' END,
                'numero_c', tdir.numero_c,
                'complemento_f',  CASE WHEN tdir.complemento_f IS NOT NULL THEN tdir.complemento_f ELSE '' END,
                'departamento', tdir.departamento,
                'municipio', tdir.municipio
            )
        ) AS lugar_entrega
    FROM
        public.tbl_ordenes tor
    LEFT JOIN tbl_direcciones tdir ON tdir.id_direccion = tor.id_lugar_entrega
    INNER JOIN public.tbl_tipo_orden tto ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_terceros tt ON tt.id_tercero = tor.id_tercero 
    WHERE 
        tor.id_orden = $1 AND
        tor.id_empresa = $2
    ORDER BY tor.id_orden DESC;
`

export const _buscar_detalle_orden_pendiente = `
    SELECT 
        tod.id_detalle, tod.id_orden, tod.id_requisicion, tr.requisicion, tod.id_producto, 
        tod.cantidad, tod.precio_compra, tod.descuento, tod.id_estado,
        tp.descripcion as producto,  tod.id_iva, ti.descripcion as iva, ti.porcentaje
    FROM 
        public.tbl_orden_detalle tod
    INNER JOIN public.tbl_requisiciones tr ON tr.id_requisicion = tod.id_requisicion
    INNER JOIN public.tbl_iva ti ON ti.id_iva = tod.id_iva
    INNER JOIN public.tbl_productos tp ON tp.id_producto = tod.id_producto
    WHERE 
        tod.id_orden = $1 AND 
        tod.id_estado = 3;
`

export const _buscar_detalle_orden = `
    SELECT 
        tod.id_detalle, tod.id_orden, tod.id_requisicion, tr.requisicion, tod.id_producto, 
        tod.cantidad, tod.precio_compra, tod.descuento, tod.id_estado,
        tp.descripcion as producto,  tod.id_iva, ti.descripcion as iva, ti.porcentaje
    FROM 
        public.tbl_orden_detalle tod
    INNER JOIN public.tbl_requisiciones tr ON tr.id_requisicion = tod.id_requisicion
    INNER JOIN public.tbl_iva ti ON ti.id_iva = tod.id_iva
    INNER JOIN public.tbl_productos tp ON tp.id_producto = tod.id_producto
    WHERE  
        tod.id_orden = $1 AND 
        tod.id_estado != 2;
`

export const _editar_encabezado_orden = `
    UPDATE 
        public.tbl_ordenes
    SET 
        id_tipo_orden=$2, id_tercero=$3, orden=$4, 
        fecha_orden=$5, id_forma_pago=$6,
        id_lugar_entrega=$7, observaciones=$8, cotizacion=$9, 
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

export const _aprobar_encabezado_orden = `
    UPDATE 
        public.tbl_ordenes
    SET 
        id_estado=$2, usuario_aprobacion=$3, fecha_aprobacion=now()
    WHERE 
        id_orden=$1;
`

export const _aprobar_detalle_orden = `
    UPDATE 
        public.tbl_orden_detalle
    SET 
        id_estado=$2
    WHERE 
        id_detalle=$1;
`

export const _buscar_orden_encabezado_pdf = `
    SELECT 
        tor.id_orden, tor.id_tipo_orden, tor.id_forma_pago, tor.id_tercero, 
        te.razon_social, te.nit AS nit_empresa,
        tto.tipo_orden, tor.orden,
        tt.nombre AS nombre_proveedor, tt.documento AS nit_proveedor, 
        tfp.forma_pago,
        CONCAT(
            tdir.tipo_via, ' ', tdir.numero_u, 
            CASE WHEN tdir.letra_u IS NOT NULL AND tdir.letra_u != '' THEN CONCAT(' ',tdir.letra_u) ELSE '' END,
            CASE WHEN tdir.numero_d IS NOT NULL AND tdir.numero_d != '' THEN CONCAT(' ',tdir.numero_d) ELSE '' END,
            CASE WHEN tdir.complemento_u IS NOT NULL AND tdir.complemento_u != '' THEN CONCAT(' ',tdir.complemento_u) ELSE '' END,
            ' #',tdir.numero_t, 
            CASE WHEN tdir.letra_d IS NOT NULL AND tdir.letra_d != '' THEN CONCAT(' ',tdir.letra_d) ELSE '' END,
            CASE WHEN tdir.complemento_d IS NOT NULL AND tdir.complemento_d != '' THEN CONCAT(' ',tdir.complemento_d) ELSE '' END,
            ' - ', tdir.numero_c, 
            CASE WHEN tdir.complemento_f IS NOT NULL AND tdir.complemento_f != '' THEN CONCAT(' ',tdir.complemento_f) ELSE '' END,
            ' (', tdir.departamento, '/',tdir.municipio, ')'
        ) AS direccion_proveedor,
        SUBSTRING(CAST(tor.fecha_orden AS VARCHAR) FROM 1 FOR 10) AS fecha_orden, 
        tt.telefono AS telefono_proveedor,  SUBSTRING(CAST(tor.fecha_entrega AS VARCHAR) FROM 1 FOR 10) AS fecha_entrega,
        CONCAT(
            vwdir.tipo_via, ' ', vwdir.numero_u, 
            CASE WHEN vwdir.letra_u IS NOT NULL AND vwdir.letra_u != '' THEN CONCAT(' ',vwdir.letra_u) ELSE '' END,
            CASE WHEN vwdir.numero_d IS NOT NULL AND vwdir.numero_d != '' THEN CONCAT(' ',vwdir.numero_d) ELSE '' END,
            CASE WHEN vwdir.complemento_u IS NOT NULL AND vwdir.complemento_u != '' THEN CONCAT(' ',vwdir.complemento_u) ELSE '' END,
            ' #',vwdir.numero_t, 
            CASE WHEN vwdir.letra_d IS NOT NULL AND vwdir.letra_d != '' THEN CONCAT(' ',vwdir.letra_d) ELSE '' END,
            CASE WHEN vwdir.complemento_d IS NOT NULL AND vwdir.complemento_d != '' THEN CONCAT(' ',vwdir.complemento_d) ELSE '' END,
            ' - ', vwdir.numero_c, 
            CASE WHEN vwdir.complemento_f IS NOT NULL AND vwdir.complemento_f != '' THEN CONCAT(' ',vwdir.complemento_f) ELSE '' END,
            ' (', vwdir.departamento, '/',vwdir.municipio, ')'
        ) AS lugar_entrega,
        tor.cotizacion,
        tor.observaciones, 
        tor.total_orden,
        tu.nombre_completo AS usuario_creador,
        vwu.nombre_completo AS usuario_aprobador
    FROM
        public.tbl_ordenes tor
    LEFT JOIN public.tbl_direcciones tdir   ON tdir.id_direccion = tor.id_lugar_entrega
    LEFT JOIN public.vw_direcciones vwdir   ON vwdir.id_direccion = tor.id_lugar_entrega
    INNER JOIN public.tbl_tipo_orden tto    ON tto.id_tipo_orden = tor.id_tipo_orden
    INNER JOIN public.tbl_forma_pago tfp    ON tfp.id_forma_pago = tor.id_forma_pago
    INNER JOIN public.tbl_terceros tt       ON tt.id_tercero = tor.id_tercero 
    INNER JOIN seguridad.tbl_empresas te    ON te.id_empresa = tor.id_empresa 
    INNER JOIN seguridad.tbl_usuario tu     ON tu.id_usuario = tor.usuario_creacion 
    LEFT JOIN seguridad.vw_usuarios vwu     ON vwu.id_usuario = tor.usuario_aprobacion 
    WHERE 
        tor.id_orden = $1 AND
        tor.id_empresa = $2
    ORDER BY tor.id_orden DESC;
`

export const _buscar_detalle_orden_pdf = `
    SELECT 
        tod.id_detalle, tod.id_orden, tod.id_requisicion, tod.id_producto,  tod.id_iva,
        tr.requisicion, tp.referencia AS codigo_producto, tp.descripcion as nombre_producto,
        tu.unidad, tod.cantidad, tod.precio_compra, tod.descuento, ti.porcentaje
    FROM 
        public.tbl_orden_detalle tod
    INNER JOIN public.tbl_requisiciones tr ON tr.id_requisicion = tod.id_requisicion
    INNER JOIN public.tbl_iva ti ON ti.id_iva = tod.id_iva
    INNER JOIN public.tbl_productos tp ON tp.id_producto = tod.id_producto
    INNER JOIN public.tbl_unidad tu ON tu.id_unidad = tp.id_unidad
    WHERE  
        tod.id_orden = $1 AND 
        tod.id_estado = 4;
`