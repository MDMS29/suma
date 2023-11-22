export const _obtener_proveedores = `
    SELECT DISTINCT
        t.id_tercero, t.id_empresa, t.id_tipo_tercero, t.id_tipo_doc, 
        t.documento, t.nombre, t.direccion, t.telefono, t.correo, t.contacto, 
        t.tel_contacto, t.id_estado, t.fecha_registro, t.usuario_creacion,
        ttp.id_tipo_producto, ttp.descripcion as tipo_producto, tts.id_tercero as id_tercero_suministro
    FROM 
        public.tbl_terceros t
    LEFT JOIN tbl_tipo_suministro tts ON tts.id_tercero = t.id_tercero
    LEFT JOIN tbl_tipo_producto ttp ON ttp.id_tipo_producto = tts.id_tipo_producto
    WHERE 
        t.id_estado = $1 AND 
        t.id_empresa = $2 AND 
        t.id_tipo_tercero = 2;
`