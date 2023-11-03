export const _obtener_productos_empresa = `
    SELECT 
        tp.id_producto, tp.id_empresa, tp.id_familia, tf.descripcion as nombre_familia, 
        tp.id_marca, tm.marca, tp.id_tipo_producto, tpp.descripcion as tipo_producto, 
        tp.referencia, tu.id_unidad, tu.unidad, tp.descripcion as nombre_producto, 
        tp.precio_costo, tp.precio_venta,

        CASE WHEN tp.foto = '' OR tp.foto = NULL THEN 'Sin foto' ELSE tp.foto END as foto_con,
        CASE WHEN tp.ficha = true THEN 'SI' ELSE 'NO' END as ficha_con,
        CASE WHEN tp.inventariable = true THEN 'SI' ELSE 'NO' END as inventariable_con,
        CASE WHEN tp.compuesto = true THEN 'SI' ELSE 'NO' END as compuesto_con,
        CASE WHEN tp.critico = true THEN 'SI' ELSE 'NO' END as critico_con,
        CASE WHEN tp.certificado = true THEN 'SI' ELSE 'NO' END as certificado_con

    FROM 
        public.tbl_productos tp

    INNER JOIN public.tbl_familia tf ON tf.id_familia = tp.id_familia
    INNER JOIN public.tbl_marca tm ON tm.id_marca = tp.id_marca
    INNER JOIN public.tbl_tipo_producto tpp ON tpp.id_tipo_producto = tp.id_tipo_producto
    INNER JOIN public.tbl_unidad tu ON tu.id_unidad = tp.id_unidad

    WHERE
        tp.id_estado = $1 AND tp.id_empresa = $2
    ORDER BY tp.id_producto DESC;
`

export const _insertar_producto_empresa = `
    INSERT INTO 
        public.tbl_productos
        (
            id_producto, codigo_barras,
            id_empresa, id_familia, id_marca, 
            id_tipo_producto, referencia, id_unidad,
            descripcion, precio_costo, precio_venta, 
            critico, inventariable, foto, 
            compuesto, ficha, certificado, 
            id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_productos_id_producto_seq'::regclass), $5,
            $1, $2, $3, 
            $4, $5, $6, 
            $7, $8, $9, 
            $10, $11, $12, 
            $13, $14, $15, 
            1, now(), $16
        )
    RETURNING id_producto;
`

export const _buscar_producto_nombre = `
    SELECT 
        tp.id_producto, tp.id_empresa, tp.id_familia, tp.id_marca, tp.id_tipo_producto,
        tp.referencia, tp.id_unidad, tp.descripcion, 
        tp.precio_costo, tp.precio_venta, tp.foto, tp.ficha, tp.inventariable,  
        tp.compuesto, tp.critico, tp.certificado
    FROM 
        public.tbl_productos tp

    INNER JOIN public.tbl_familia tf ON tf.id_familia = tp.id_familia
    INNER JOIN public.tbl_marca tm ON tm.id_marca = tp.id_marca
    INNER JOIN public.tbl_tipo_producto tpp ON tpp.id_tipo_producto = tp.id_tipo_producto
    INNER JOIN public.tbl_unidad tu ON tu.id_unidad = tp.id_unidad

    WHERE
        tp.id_empresa = $1 AND tp.descripcion = $2;
`

export const _buscar_producto_referencia = `
    SELECT 
        tp.id_producto, tp.id_empresa, tp.id_familia, tp.id_marca, tp.id_tipo_producto,
        tp.referencia, tp.id_unidad, tp.descripcion, 
        tp.precio_costo, tp.precio_venta, tp.foto, tp.ficha, tp.inventariable,  
        tp.compuesto, tp.critico, tp.certificado
    FROM 
        public.tbl_productos tp

    INNER JOIN public.tbl_familia tf ON tf.id_familia = tp.id_familia
    INNER JOIN public.tbl_marca tm ON tm.id_marca = tp.id_marca
    INNER JOIN public.tbl_tipo_producto tpp ON tpp.id_tipo_producto = tp.id_tipo_producto
    INNER JOIN public.tbl_unidad tu ON tu.id_unidad = tp.id_unidad

    WHERE
        tp.id_empresa = $1 AND tp.referencia = $2;
`

export const _buscar_producto_id = `
    SELECT 
        tp.id_producto, tp.id_empresa, tp.id_familia, tp.id_marca, tp.id_tipo_producto,
        tp.referencia, tp.id_unidad, tp.descripcion, 
        tp.precio_costo, tp.precio_venta, tp.foto, tp.ficha, tp.inventariable,  
        tp.compuesto, tp.critico, tp.certificado
    FROM 
        public.tbl_productos tp

    INNER JOIN public.tbl_familia tf ON tf.id_familia = tp.id_familia
    INNER JOIN public.tbl_marca tm ON tm.id_marca = tp.id_marca
    INNER JOIN public.tbl_tipo_producto tpp ON tpp.id_tipo_producto = tp.id_tipo_producto
    INNER JOIN public.tbl_unidad tu ON tu.id_unidad = tp.id_unidad

    WHERE
        tp.id_producto = $1;
`

export const _FA_obtener_productos_filtro = 'public.obtener_productos_filtro'


export const _editar_producto_empresa = `
    UPDATE 
        public.tbl_productos
    SET 
        id_empresa=$2, id_familia=$3, id_marca=$4,
        id_tipo_producto=$5, referencia=$6, id_unidad=$7,
        descripcion=$8, precio_costo=$9, precio_venta=$10,
        critico=$11, inventariable=$12, foto=$13,
        compuesto=$14, ficha=$15, certificado=$16,
        fecha_modificacion=now(), usuario_modificacion=$17
    WHERE 
        id_producto=$1;
`


export const _cambiar_estado_producto = `
    UPDATE 
        public.tbl_productos
    SET 
        id_estado=$2
    WHERE 
        id_producto=$1;
`