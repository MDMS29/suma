
// TIPOS DE ORDENES
export const _FAObtener_tipos_ordenes = `public.fnc_obtener_consecutivo_ordenes`

export const _buscar_tipo_orden_nombre = `
    SELECT 
        id_tipo_orden, id_empresa, tipo_orden, consecutivo
    FROM 
        public.tbl_tipo_orden
    WHERE 
        tipo_orden = $1 AND 
        id_empresa = $2;
`

export const _obtener_tipo_producto_orden = `
    SELECT 
        DISTINCT 
            tto.id_tipo_producto_orden, tto.id_tipo_orden, tto.id_tipo_producto,
            ttp.descripcion as tipo_producto, tto.id_estado
    FROM 
        public.tbl_tipo_producto_orden tto
    INNER JOIN public.tbl_tipo_producto ttp ON ttp.id_tipo_producto = tto.id_tipo_producto
    WHERE 
        tto.id_tipo_orden = $1 AND 
        tto.id_estado != 2
`

export const _insertar_tipo_orden = `
    INSERT INTO 
        public.tbl_tipo_orden
        (
            id_tipo_orden, 
            id_empresa, tipo_orden, consecutivo
        )
    VALUES
        (
            nextval('tbl_tipo_orden_id_tipo_orden_seq'::regclass), 
            $1, $2, $3
        )
    RETURNING id_tipo_orden;
`

export const _insertar_tipo_producto_orden = `
    INSERT INTO 
    public.tbl_tipo_producto_orden
    (
        id_tipo_producto_orden, 
        id_tipo_orden, id_tipo_producto, id_estado
    )
    VALUES(
        nextval('tbl_tipo_producto_orden_id_tipo_producto_orden_seq'::regclass), 
        $1, $2, 1
    )    
    RETURNING id_tipo_producto_orden;
`

export const _buscar_tipo_orden_id = `
    SELECT 
        id_tipo_orden, id_empresa, tipo_orden, consecutivo
    FROM 
        public.tbl_tipo_orden
    WHERE 
    id_tipo_orden = $1;
`

export const _buscar_tipo_producto_orden = `
    SELECT 
        DISTINCT 
            tto.id_tipo_producto_orden, tto.id_tipo_orden, tto.id_tipo_producto, tto.id_estado
    FROM 
        public.tbl_tipo_producto_orden tto
    WHERE 
        tto.id_tipo_producto = $1 AND
        tto.id_tipo_orden = $2 
`

export const _editar_tipo_orden = `
    UPDATE 
        public.tbl_tipo_orden
    SET 
        tipo_orden=$2, consecutivo=$3
    WHERE 
        id_tipo_orden=$1;
`

export const _editar_tipo_produco_orden = `
    UPDATE 
        public.tbl_tipo_producto_orden
    SET 
        id_tipo_orden=$2, id_tipo_producto=$3, id_estado=$4
    WHERE 
        id_tipo_producto_orden=$1;
`