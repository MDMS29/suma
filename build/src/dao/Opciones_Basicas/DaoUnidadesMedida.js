"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._editar_unidad_medida = exports._buscar_unidad_medida_id = exports._buscar_unidad_medida = exports._insertar_unidad_medida = exports._obtener_unidades_medida = void 0;
exports._obtener_unidades_medida = `
    SELECT 
        tum.id_unidad, tum.id_empresa, tum.unidad
    FROM 
        public.tbl_unidad tum
    WHERE
        tum.id_empresa = $1
    ORDER BY tum.id_unidad DESC;
`;
exports._insertar_unidad_medida = `
    INSERT INTO 
        public.tbl_unidad
        (id_unidad, id_empresa, unidad)
    VALUES
        (nextval('public.tbl_unidad_id_unidad_seq'::regclass), $1, $2)
    RETURNING id_unidad;
`;
exports._buscar_unidad_medida = `
    SELECT 
        tum.id_unidad, tum.id_empresa, tum.unidad
    FROM 
        public.tbl_unidad tum
    WHERE
        tum.id_empresa = $1 AND tum.unidad = $2
    ORDER BY tum.id_unidad DESC;
`;
exports._buscar_unidad_medida_id = `
    SELECT 
        tum.id_unidad, tum.id_empresa, tum.unidad
    FROM 
        public.tbl_unidad tum
    WHERE
        tum.id_unidad = $1
    ORDER BY tum.id_unidad DESC;  
`;
exports._editar_unidad_medida = `
    UPDATE 
        public.tbl_unidad
    SET 
        unidad=$2
    WHERE 
        id_unidad=$1;
`;
