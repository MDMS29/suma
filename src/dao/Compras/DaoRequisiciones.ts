export const _FA_obtener_requisicion_enc = 'public.obtener_requisiciones_empresa'

export const _FA_obtener_requisicion_filtro = 'public.obtener_requisiciones_empresa_filtro'

export const _FA_obtener_productos_pendientes = 'public.fnc_obtener_productos_pendientes'

export const _buscar_detalle_requisicion = `
    SELECT 
        trd.id_detalle, trd.id_producto, tp.referencia, tp.descripcion as nombre_producto, tp.id_unidad, tu.unidad,
        trd.cantidad, trd.justificacion, trd.id_estado, tp.critico, tp.certificado
    FROM
        public.tbl_requisicion_detalle trd
    INNER JOIN public.tbl_productos tp  ON tp.id_producto   = trd.id_producto
    INNER JOIN public.tbl_unidad    tu  ON tu.id_unidad     = tp.id_unidad
    WHERE 
        trd.id_requisicion = $1 AND trd.id_estado != 2 
    ORDER BY trd.id_detalle ASC;
`

export const _buscar_requisicion_consecutivo = `
    SELECT 
        tr.id_requisicion, tr.requisicion, tr.id_proceso, tr.id_centro, tc.centro_costo, tr.comentarios, tr.id_estado, 
        te.nombre_estado, tr.fecha_requisicion
    FROM
        tbl_requisiciones tr
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tr.id_centro 
    INNER JOIN seguridad.tbl_estados te ON te.id_estado = tr.id_estado 
    WHERE
        tr.requisicion = $1
`

export const _insertar_requisicion_enc = `
    INSERT INTO 
        public.tbl_requisiciones
        (
            id_requisicion, 
            id_empresa, id_proceso, id_centro,
            id_tipo_producto, requisicion, fecha_requisicion,
            hora_requisicion, comentarios, equipo, 
            id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_requisiciones_id_requisicion_seq'::regclass), 
            $1, $2, $3, 
            $4, $5, $6, 
            now(), $7, $8, 
            3, now(), $9
        )
    RETURNING id_requisicion;
`

export const _insertar_requisicion_det = `
    INSERT INTO 
        public.tbl_requisicion_detalle
        (
            id_detalle, 
            id_requisicion, 
            id_producto, cantidad, justificacion, 
            id_estado, fecha_creacion, usuario_creacion
        )
    VALUES
        (
            nextval('tbl_requisicion_detalle_id_detalle_seq'::regclass), 
            $1,
            $2, $3, $4, 
            3, now(), $5
        )
    RETURNING id_detalle;
`

export const _buscar_requisicion_id = ` 
    SELECT 
        tr.id_requisicion, tr.requisicion, tr.id_centro, tc.centro_costo, tr.id_proceso, tr.comentarios, tr.id_estado, 
        te.nombre_estado, tr.fecha_requisicion, tr.id_empresa, ste.razon_social, tp.proceso, 
        tr.id_tipo_producto, ttp.descripcion as tipo_productos, tr.usuario_revision, tr.fecha_revision,
        tc.correo_responsable, tr.fecha_creacion, tr.usuario_creacion
    FROM
        tbl_requisiciones tr
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tr.id_centro 
    INNER JOIN public.tbl_procesos tp ON tp.id_proceso = tr.id_proceso 
    INNER JOIN seguridad.tbl_estados te ON te.id_estado = tr.id_estado 
    INNER JOIN seguridad.tbl_empresas ste ON ste.id_empresa = tr.id_empresa
    INNER JOIN public.tbl_tipo_producto ttp ON ttp.id_tipo_producto = tr.id_tipo_producto 
    WHERE
        tr.id_requisicion = $1
`

export const _editar_requisicion_enc = `
    UPDATE 
        public.tbl_requisiciones
    SET 
        id_empresa=$2, id_proceso=$3, id_centro=$4, 
        id_tipo_producto=$5, requisicion=$6, comentarios=$7, 
        equipo=1, fecha_requisicion=$8
    WHERE 
        id_requisicion=$1;       
`

export const _editar_requisicion_det = `
    UPDATE 
        public.tbl_requisicion_detalle
    SET 
        id_producto=$2, cantidad=$3, justificacion=$4, 
        id_estado=$5, fecha_modificacion=now(), usuario_modificacion=$6
    WHERE 
        id_detalle=$1;
`

export const _cambiar_estado_requisicion = `
    UPDATE 
        public.tbl_requisiciones
    SET 
        id_estado=$2
    WHERE 
        id_requisicion=$1;     
`

export const _aprobar_desaprobar_detalle = `
    UPDATE 
        public.tbl_requisicion_detalle
    SET 
        id_estado=$2
    WHERE 
        id_detalle=$1;     
`

export const _buscar_detalle_id = `
    SELECT 
        id_detalle, id_requisicion
    FROM 
        public.tbl_requisicion_detalle
    WHERE
        id_detalle=$1;
`

export const _editar_usuario_revision = `
    UPDATE 
        public.tbl_requisiciones
    SET 
        usuario_revision=$2, fecha_revision=now()
    WHERE 
        id_requisicion=$1;        
`

export const _buscar_correo_responsable = `
    SELECT 
        tr.id_requisicion, tc.correo_responsable
    FROM
        tbl_requisiciones tr
    INNER JOIN public.tbl_centros tc ON tc.id_centro = tr.id_centro
    WHERE
        tr.id_requisicion = $1 AND tr.id_estado != 2 AND tc.id_estado != 2;
`