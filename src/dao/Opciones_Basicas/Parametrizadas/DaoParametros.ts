export const _obtener_tipos_documentos = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_tipo_doc
    ORDER BY tipo_doc ASC 
`

export const _obtener_formas_pago = `
    SELECT 
        DISTINCT * 
    FROM 
        public.tbl_forma_pago
    ORDER BY forma_pago ASC 
`