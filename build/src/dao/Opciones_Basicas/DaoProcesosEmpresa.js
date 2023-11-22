"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._editar_proceso_empresa = exports._buscar_proceso_id = exports._buscar_proceso_nombre = exports._buscar_proceso_codigo = exports._insertar_proceso_empresa = exports._obtener_procesos_empresa = void 0;
exports._obtener_procesos_empresa = `
    SELECT 
        tp.id_proceso, tp.id_empresa, tp.codigo, tp.proceso
    FROM 
        public.tbl_procesos tp
    WHERE
        tp.id_empresa = $1
    ORDER BY tp.id_proceso DESC;
`;
exports._insertar_proceso_empresa = `
    INSERT INTO 
        public.tbl_procesos
        (id_proceso, id_empresa, codigo, proceso, fecha_creacion, usuario_creacion)
    VALUES
        (nextval('public.tbl_procesos_id_proceso_seq'::regclass), $1, $2, $3, now(), $4)
    RETURNING id_proceso;
`;
exports._buscar_proceso_codigo = `
    SELECT 
        tp.id_proceso, tp.id_empresa, tp.codigo, tp.proceso
    FROM 
        public.tbl_procesos tp
    WHERE
        tp.id_empresa = $1 AND tp.codigo = $2;
`;
exports._buscar_proceso_nombre = `
    SELECT 
        tp.id_proceso, tp.id_empresa, tp.codigo, tp.proceso
    FROM 
        public.tbl_procesos tp
    WHERE
        tp.id_empresa = $1 AND tp.proceso = $2;
`;
exports._buscar_proceso_id = `
    SELECT 
        tp.id_proceso, tp.id_empresa, tp.codigo, tp.proceso
    FROM 
        public.tbl_procesos tp
    WHERE
        tp.id_proceso = $1;
`;
exports._editar_proceso_empresa = `
    UPDATE 
        public.tbl_procesos
    SET 
        codigo=$2, proceso=$3
    WHERE 
        id_proceso=$1;
`;
