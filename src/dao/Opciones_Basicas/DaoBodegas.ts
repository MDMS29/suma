export const _obtener_bodegas = `
    SELECT 
        tb.id_bodega, tb.nombre, tb.con_entradas, tb.con_salidas
    FROM 
        public.tbl_bodegas tb 
    WHERE 
        tb.id_empresa = $1 AND 
        tb.id_estado = $2;
`

export const _buscar_bodega_nombre = `
    SELECT 
        tb.id_bodega, tb.nombre, tb.con_entradas, tb.con_salidas
    FROM 
        public.tbl_bodegas tb 
    WHERE 
        tb.id_empresa = $1 AND 
        tb.nombre = $2;
`

export const _insertar_bodega = `
    INSERT INTO 
        public.tbl_bodegas
        (
            id_bodega, 
            id_empresa, nombre, con_entradas, con_salidas, id_estado
        )
    VALUES
        (
            nextval('tbl_bodegas_id_bodega_seq'::regclass), 
            $1, $2, $3, $4, 1
        )
    RETURNING id_bodega;
`

export const _insertar_mov_bodega = `
    INSERT INTO 
        public.tbl_mov_bodegas
        (
            id_mov_bodega, id_bodega, id_tipo_mov, id_estado
        )
    VALUES
        (
            nextval('tbl_mov_bodegas_id_mov_bodega_seq'::regclass), 
            $1, $2, 1
        )
    RETURNING id_mov_bodega;
`

export const _buscar_bodega_id = `
    SELECT 
        tb.id_bodega, tb.nombre, tb.con_entradas, tb.con_salidas
    FROM 
        public.tbl_bodegas tb 
    WHERE 
        tb.id_bodega = $1;
`

export const _buscar_movimientos_bodega = `
    SELECT 
        tmb.id_mov_bodega, tmb.id_bodega, tmb.id_tipo_mov, tmb.id_estado
    FROM 
        public.tbl_mov_bodegas tmb
    WHERE 
     tmb.id_bodega = $1 AND tmb.id_estado = 1;
`

export const _editar_bodega = `
    UPDATE 
        public.tbl_bodegas
    SET 
        id_empresa=$2, nombre=$3, con_entradas=$4, con_salidas=$5
    WHERE 
        id_bodega=$1;
`

export const _editar_movimiento_bodega = `
    UPDATE 
        public.tbl_mov_bodegas
    SET 
        id_estado=$2
    WHERE 
        id_mov_bodega=$1;
`