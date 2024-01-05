export const _insertar_direccion = `
    INSERT INTO 
        public.tbl_direcciones
        (
            id_direccion, 
            tipo_via, numero_u, letra_u, 
            numero_d, complemento_u, numero_t, 
            letra_d, complemento_d, numero_c, 
            complemento_f, departamento, municipio
        )
    VALUES
        (
            nextval('tbl_direcciones_id_direccion_seq'::regclass), 
            $1, $2, $3,
            $4, $5, $6, 
            $7, $8, $9 , 
            $10, $11, $12
        )
    RETURNING id_direccion;
`

export const _editar_direccion = `
    UPDATE 
        public.tbl_direcciones
    SET 
        tipo_via=$2, numero_u=$3, letra_u=$4, 
        numero_d=$5, complemento_u=$6, numero_t=$7, 
        letra_d=$8, complemento_d=$9, numero_c=$10, 
        complemento_f=$11, departamento=$12, municipio=$13
    WHERE 
        id_direccion=$1;
`

export const _insertar_tabla_temporal = `
    INSERT INTO 
        auditoria.tbl_temp_valores_auxiliares
        (
            id, 
            v_user, v_ip, v_ubicacion
        )
    VALUES
        (
            nextval('auditoria.tbl_temp_valores_auxiliares_id_seq'::regclass), 
            $1, $2, $3
        );
`