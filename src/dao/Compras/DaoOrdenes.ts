export const _obtener_ordenes = `
    SELECT 
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
        tor.id_tipo_orden = $1 AND
        tor.id_empresa = $2 AND
        tor.id_estado = $3
    ORDER BY tor.id_orden DESC;
`