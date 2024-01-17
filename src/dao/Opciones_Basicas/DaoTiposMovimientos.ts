export const _obtener_tipos_movimientos = `
    SELECT 
        ttm.id_tipo_mov, ttm.id_empresa, ttm.descripcion, ttm.tipo_mov,
        CASE WHEN ttm.tipo_mov = 1 THEN 'Entrada' ELSE 'Salida' END as nom_tipo_mov
    FROM 
        public.tbl_tipos_movs ttm
    WHERE ttm.id_empresa = $1
    ORDER BY ttm.id_tipo_mov DESC;
`

export const _buscar_tipo_movimiento = `
    SELECT 
        ttm.id_tipo_mov, ttm.id_empresa, ttm.descripcion, ttm.tipo_mov,
        CASE WHEN ttm.tipo_mov = 1 THEN 'Entrada' ELSE 'Salida' END as nom_tipo_mov
    FROM 
        public.tbl_tipos_movs ttm
    WHERE ttm.id_empresa = $1 AND ttm.descripcion = $2 AND ttm.tipo_mov = $3;
`

export const _insertar_tipo_movimiento = `
    INSERT INTO 
        public.tbl_tipos_movs
        (
            id_tipo_mov, 
            id_empresa, descripcion, tipo_mov
        )
    VALUES
        (
            nextval('tbl_tipos_movs_id_tipo_mov_seq'::regclass), 
            $1, $2, $3
        )
    RETURNING id_tipo_mov;
`

export const _buscar_tipo_movimiento_id = `
    SELECT 
        ttm.id_tipo_mov, ttm.id_empresa, ttm.descripcion, ttm.tipo_mov,
        CASE WHEN ttm.tipo_mov = 1 THEN 'Entrada' ELSE 'Salida' END as nom_tipo_mov
    FROM 
        public.tbl_tipos_movs ttm
    WHERE ttm.id_tipo_mov = $1;
`

export const _editar_tipo_movimiento = `
    UPDATE 
        public.tbl_tipos_movs
    SET 
        id_empresa=$2, descripcion=$3, tipo_mov=$4
    WHERE 
        id_tipo_mov= $1;
`