export const _obtener_proveedores = `
    SELECT DISTINCT
        t.id_tercero, t.id_empresa, t.id_tipo_tercero, t.id_tipo_doc, 
        t.documento, t.nombre, t.direccion, t.telefono, t.correo, t.contacto, 
        t.tel_contacto, t.id_estado, t.fecha_registro, t.usuario_creacion,
        ttp.id_tipo_producto, ttp.descripcion as tipo_producto, tts.id_tercero as id_tercero_suministro,
        td.tipo_doc, tts.id_suministro, tts.id_estado as estado_suministro
    FROM 
        public.tbl_terceros t
    LEFT JOIN tbl_tipo_doc td ON td.id_tipo_doc = t.id_tipo_doc
    LEFT JOIN tbl_tipo_suministro tts ON tts.id_tercero = t.id_tercero
    LEFT JOIN tbl_tipo_producto ttp ON ttp.id_tipo_producto = tts.id_tipo_producto
    WHERE 
        t.id_estado = $1 AND 
        t.id_empresa = $2 AND 
        tts.id_estado != 2 AND
        t.id_tipo_tercero = 2;
`

export const _buscar_documento_proveedor = `
    SELECT DISTINCT
        t.id_tercero, t.id_tipo_doc, t.documento
    FROM 
        public.tbl_terceros t
    WHERE 
        t.documento = $1 AND 
        t.id_tipo_doc = $2
`
export const _buscar_correo_proveedor = `
    SELECT DISTINCT
        t.id_tercero, t.correo
    FROM 
        public.tbl_terceros t
    WHERE 
        t.correo = $1 AND 
        t.id_tipo_tercero = 2
`

export const _insertar_proveedor = `
INSERT INTO public.tbl_terceros
    (
        id_tercero, 
        id_empresa, id_tipo_tercero, id_tipo_doc,
        documento, nombre, direccion, 
        telefono, correo, contacto, 
        tel_contacto, id_estado, fecha_registro, 
        usuario_creacion
    )
    VALUES
    (
        nextval('tbl_terceros_id_tercero_seq'::regclass), 
        $1, $2, $3, 
        $4, $5, $6, 
        $7, $8, $9, 
        $10, $11, now(),
        $12
    )
    RETURNING id_tercero;
`

export const _insertar_suministro_proveedor = `
        INSERT INTO public.tbl_tipo_suministro
        (
            id_suministro,
            id_tercero, id_tipo_producto
        )
        VALUES 
        (
            nextval('tbl_tipo_suministro_id_suministro_seq'::regclass),
            $1, $2, 1
        )
        RETURNING id_suministro;
`
export const _buscar_proveedor_id = `
    SELECT DISTINCT
        t.id_tercero, t.id_empresa, t.id_tipo_tercero, t.id_tipo_doc as id_tipo_documento, 
        t.documento, t.nombre, t.direccion, t.telefono, t.correo, t.contacto, 
        t.tel_contacto as telefono_contacto, t.id_estado,
        ttp.id_tipo_producto, ttp.descripcion as tipo_producto, tts.id_tercero as id_tercero_suministro,
        td.tipo_doc, tts.id_suministro, tts.id_estado as estado_suministro
    FROM 
        public.tbl_terceros t
    LEFT JOIN tbl_tipo_doc td ON td.id_tipo_doc = t.id_tipo_doc
    LEFT JOIN tbl_tipo_suministro tts ON tts.id_tercero = t.id_tercero
    LEFT JOIN tbl_tipo_producto ttp ON ttp.id_tipo_producto = tts.id_tipo_producto
    WHERE 
        t.id_tercero = $1 AND 
        tts.id_estado != 2 AND
        t.id_tipo_tercero = 2;
`

export const _buscar_suministro_proveedor = `
    SELECT 
        * 
    FROM 
        public.tbl_tipo_suministro tts 
    WHERE 
        tts.id_tercero = $1 AND 
        tts.id_suministro = $2 
`

export const _editar_proveedor = `
    UPDATE 
        public.tbl_terceros
    SET 
        id_empresa=$2, id_tipo_tercero=$3, id_tipo_doc=$4, 
        documento=$5, nombre=$6, direccion=$7, 
        telefono=$8, correo=$9, contacto=$10, 
        tel_contacto=$11
    WHERE 
        id_tercero=$1;
`

export const _editar_suministro = `
    UPDATE 
        public.tbl_tipo_suministro 
    SET
        id_estado= $2
    WHERE id_suministro = $1
`

export const _cambiar_estado_proveedor = `
    UPDATE 
        public.tbl_terceros
    SET 
        id_estado = $2
    WHERE 
        id_tercero=$1;
`
