export const _obtener_tipos_documentos = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_tipo_doc
    ORDER BY tipo_doc DESC 
`

export const _obtener_formas_pago = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_forma_pago
    ORDER BY forma_pago DESC 
`

export const _obtener_ivas = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_iva
    WHERE id_empresa = $1
    ORDER BY id_iva DESC;
`

export const _insertar_iva = `
    INSERT INTO 
        public.tbl_iva
        (
            id_iva, 
            descripcion, porcentaje, id_empresa
        )
    VALUES
        (
            nextval('tbl_iva_id_iva_seq'::regclass), 
            $1, $2, $3
        )
    RETURNING id_iva;
`

export const _buscar_iva_id = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_iva
    WHERE id_iva = $1
    ORDER BY id_iva DESC;
`

export const _buscar_iva_nombre = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_iva
    WHERE descripcion = $1
    ORDER BY id_iva ASC;
`

export const _editar_iva = `
    UPDATE 
        public.tbl_iva
    SET 
        descripcion=$2, porcentaje=$3, id_empresa=$4
    WHERE 
        id_iva=$1;
`