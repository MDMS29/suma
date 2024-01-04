export const _obtener_empresas = `
    SELECT 
        te.id_empresa, te.nit, te.razon_social, te.telefono, te.id_direccion, te.correo
    FROM 
        seguridad.tbl_empresas te
    WHERE
        te.id_estado = $1
    ORDER BY te.id_empresa DESC
`

export const _buscar_razon_social = `
    SELECT 
        * 
    FROM 
        seguridad.tbl_empresas te
    WHERE 
        te.razon_social = $1
`

export const _insertar_empresa = `
    INSERT INTO 
        seguridad.tbl_empresas
        (id_empresa, nit, razon_social, telefono, id_direccion, correo, id_estado, fecha_creacion, usuario_creacion)
    VALUES
        (nextval('seguridad.tbl_empresas_id_empresa_seq'::regclass), $1, $2, $3, $4, $5, 1, now(), $6)
    RETURNING id_empresa;
`

export const _buscar_empresa_id = `
    SELECT 
        te.id_empresa, te.nit, te.razon_social, te.telefono, te.id_direccion, te.correo,
        to_jsonb(
            json_build_object(
                'id_lugar_entrega', tdir.id_direccion,
                'tipo_via', tdir.tipo_via,
                'numero_u', tdir.numero_u,
                'letra_u', CASE WHEN tdir.letra_u IS NOT NULL THEN tdir.letra_u ELSE '' END,
                'numero_d', CASE WHEN tdir.numero_d IS NOT NULL THEN tdir.numero_d ELSE '' END,
                'complemento_u', CASE WHEN tdir.complemento_u IS NOT NULL THEN tdir.complemento_u ELSE '' END,
                'numero_t', tdir.numero_t,
                'letra_d', CASE WHEN tdir.letra_d IS NOT NULL THEN tdir.letra_d ELSE '' END,
                'complemento_d', CASE WHEN tdir.complemento_d IS NOT NULL THEN tdir.complemento_d ELSE '' END,
                'numero_c', tdir.numero_c,
                'complemento_f',  CASE WHEN tdir.complemento_f IS NOT NULL THEN tdir.complemento_f ELSE '' END,
                'departamento', tdir.departamento,
                'municipio', tdir.municipio
            )
        ) AS direccion
    FROM 
        seguridad.tbl_empresas te
    LEFT JOIN tbl_direcciones tdir ON tdir.id_direccion = tor.id_direccion
    WHERE
        te.id_empresa = $1
`

export const _buscar_empresa_nit = `
    SELECT 
        te.id_empresa, te.nit, te.razon_social, te.telefono, te.id_direccion, te.correo,
        to_jsonb(
            json_build_object(
                'id_lugar_entrega', tdir.id_direccion,
                'tipo_via', tdir.tipo_via,
                'numero_u', tdir.numero_u,
                'letra_u', CASE WHEN tdir.letra_u IS NOT NULL THEN tdir.letra_u ELSE '' END,
                'numero_d', CASE WHEN tdir.numero_d IS NOT NULL THEN tdir.numero_d ELSE '' END,
                'complemento_u', CASE WHEN tdir.complemento_u IS NOT NULL THEN tdir.complemento_u ELSE '' END,
                'numero_t', tdir.numero_t,
                'letra_d', CASE WHEN tdir.letra_d IS NOT NULL THEN tdir.letra_d ELSE '' END,
                'complemento_d', CASE WHEN tdir.complemento_d IS NOT NULL THEN tdir.complemento_d ELSE '' END,
                'numero_c', tdir.numero_c,
                'complemento_f',  CASE WHEN tdir.complemento_f IS NOT NULL THEN tdir.complemento_f ELSE '' END,
                'departamento', tdir.departamento,
                'municipio', tdir.municipio
            )
        ) AS direccion
    FROM 
        seguridad.tbl_empresas te
    LEFT JOIN tbl_direcciones tdir ON tdir.id_direccion = tor.id_direccion
    WHERE
        te.nit = $1
`

export const _editar_empresa = `
    UPDATE 
        seguridad.tbl_empresas te
    SET 
        nit=$2, razon_social=$3, telefono=$4, id_direccion=$5, correo=$6, fecha_actualizacion=now(), usuario_modificacion=$7
    WHERE 
        id_empresa=$1;
`

export const _cambiar_estado_empresa = `
    UPDATE 
        seguridad.tbl_empresas te
    SET 
       id_estado = $2
    WHERE 
        id_empresa=$1;
`