export const _obtener_tipos_producto = `
    SELECT 
        ttp.id_tipo_producto, ttp.id_empresa, ttp.descripcion
    FROM 
        public.tbl_tipo_producto ttp
    WHERE
        ttp.id_empresa = $1
    ORDER BY ttp.id_tipo_producto DESC;
`

export const _insertar_tipo_producto = `
    INSERT INTO 
        public.tbl_tipo_producto
        (id_tipo_producto, id_empresa, descripcion)
    VALUES
        (nextval('public.tbl_tipo_producto_id_tipo_producto_seq'::regclass), $1, $2)
    RETURNING id_tipo_producto;
`

export const _buscar_tipo_producto = `
    SELECT 
        ttp.id_tipo_producto, ttp.id_empresa, ttp.descripcion
    FROM 
        public.tbl_tipo_producto ttp
    WHERE
        ttp.id_empresa = $1 AND ttp.descripcion = $2
    ORDER BY ttp.id_tipo_producto DESC;
`

export const _buscar_tipo_producto_id = `
    SELECT 
        ttp.id_tipo_producto, ttp.id_empresa, ttp.descripcion
    FROM 
        public.tbl_tipo_producto ttp
    WHERE
        ttp.id_tipo_producto = $1; 
`

export const _editar_tipo_producto = `
    UPDATE 
        public.tbl_tipo_producto
    SET 
        descripcion=$2
    WHERE 
        id_tipo_producto=$1;
`