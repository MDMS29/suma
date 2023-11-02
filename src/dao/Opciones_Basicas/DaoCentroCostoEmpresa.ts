export const _obtener_centros_costos_empresa = `
    SELECT 
        tc.id_centro, tc.id_proceso, tp.proceso, tc.id_empresa, tc.codigo, tc.centro_costo, tc.correo_responsable, tc.consecutivo, tc.id_estado 
    FROM 
        public.tbl_centros tc
    INNER JOIN public.tbl_procesos tp ON tp.id_proceso = tc.id_proceso
    WHERE
        tc.id_estado = $1 AND tc.id_empresa = $2 
    ORDER BY tc.id_centro DESC;
`

export const _insertar_centro_costo = `
    INSERT INTO 
        public.tbl_centros
        (id_centro, id_empresa, id_proceso, codigo, centro_costo, correo_responsable, id_estado, fecha_creacion, usuario_creacion, consecutivo)
    VALUES
        (nextval('public.tbl_centros_id_centro_seq'::regclass), $1, $2, $3, $4, $5, 1, now(), $6, $7)
    RETURNING id_centro;
`

export const _buscar_centro_codigo = `
    SELECT 
        tc.id_centro, tc.id_proceso, tp.proceso, tc.id_empresa, tc.codigo, tc.centro_costo, tc.correo_responsable, tc.consecutivo, tc.id_estado 
    FROM 
        public.tbl_centros tc
    INNER JOIN public.tbl_procesos tp ON tp.id_proceso = tc.id_proceso
    WHERE
        tc.id_empresa = $1 AND tc.codigo = $2;
`


export const _buscar_centro_nombre = `
    SELECT 
        tc.id_centro, tc.id_proceso, tp.proceso, tc.id_empresa, tc.codigo, tc.centro_costo, tc.correo_responsable, tc.consecutivo, tc.id_estado 
    FROM 
        public.tbl_centros tc
    INNER JOIN public.tbl_procesos tp ON tp.id_proceso = tc.id_proceso
    WHERE
        tc.id_empresa = $1 AND tc.centro_costo = $2;
`


export const _buscar_responsable_centro = `
    SELECT 
        tc.id_centro, tc.id_proceso, tp.proceso, tc.id_empresa, tc.codigo, tc.centro_costo, tc.correo_responsable, tc.consecutivo, tc.id_estado 
    FROM 
        public.tbl_centros tc
    INNER JOIN public.tbl_procesos tp ON tp.id_proceso = tc.id_proceso
    WHERE
        tc.id_empresa = $1 AND tc.correo_responsable = $2;
`


export const _buscar_centro_id = `
    SELECT 
        tc.id_centro, tc.id_proceso, tp.proceso, tc.id_empresa, tc.codigo, tc.centro_costo, tc.correo_responsable, tc.consecutivo, tc.id_estado 
    FROM 
        public.tbl_centros tc
    INNER JOIN public.tbl_procesos tp ON tp.id_proceso = tc.id_proceso
    WHERE
        tc.id_centro = $1;
`

export const _editar_centro_costo = `
    UPDATE 
        public.tbl_centros
    SET 
        id_proceso=$2, codigo=$3, centro_costo=$4, correo_responsable=$5, consecutivo=$6
    WHERE 
        id_centro=$1;
`

export const _cambiar_estado_centro = `
UPDATE 
        public.tbl_centros
    SET 
        id_estado = $2
    WHERE 
        id_centro=$1;
`