export const _obtener_familias_producto = `
    SELECT 
        tf.id_familia, tf.id_empresa, tf.referencia, tf.descripcion, tf.id_estado
    FROM 
        public.tbl_familia tf
    WHERE
        tf.id_estado = $1 AND tf.id_empresa = $2
    ORDER BY tf.id_familia DESC;
`

export const _insertar_familia_producto = `
    INSERT INTO 
        public.tbl_familia
        (id_familia, id_empresa, referencia, descripcion, id_estado)
    VALUES
        (nextval('public.tbl_familia_id_familia_seq'::regclass), $1, $2, $3, 1)
    RETURNING id_familia;
`

export const _buscar_familia_producto = `
    SELECT 
        tf.id_familia, tf.id_empresa, tf.referencia, tf.descripcion, tf.id_estado
    FROM 
        public.tbl_familia tf
    WHERE
        tf.id_empresa = $1 AND tf.referencia = $2;
`


export const _buscar_familia_descripcion = `
    SELECT 
        tf.id_familia, tf.id_empresa, tf.referencia, tf.descripcion, tf.id_estado
    FROM 
        public.tbl_familia tf
    WHERE
        tf.id_empresa = $1 AND tf.descripcion = $2;
`


export const _buscar_familia_producto_id = `
    SELECT 
        tf.id_familia, tf.id_empresa, tf.referencia, tf.descripcion, tf.id_estado
    FROM 
        public.tbl_familia tf
    WHERE
        tf.id_familia = $1;
`

export const _editar_familia_producto = `
    UPDATE 
        public.tbl_familia
    SET 
        id_empresa=$2, referencia=$3, descripcion=$4
    WHERE 
        id_familia=$1;
`


export const _cambiar_estado_familia = `
    UPDATE 
        public.tbl_familia
    SET 
        id_estado=$2
    WHERE 
        id_familia=$1;
`