"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._editar_tipo_producto = exports._buscar_tipo_producto_id = exports._buscar_tipo_producto = exports._insertar_tipo_producto = exports._obtener_tipos_producto = void 0;
exports._obtener_tipos_producto = `
    SELECT 
        ttp.id_tipo_producto, ttp.id_empresa, ttp.descripcion
    FROM 
        public.tbl_tipo_producto ttp
    WHERE
        ttp.id_empresa = $1
    ORDER BY ttp.id_tipo_producto DESC;
`;
exports._insertar_tipo_producto = `
    INSERT INTO 
        public.tbl_tipo_producto
        (id_tipo_producto, id_empresa, descripcion)
    VALUES
        (nextval('public.tbl_tipo_producto_id_tipo_producto_seq'::regclass), $1, $2)
    RETURNING id_tipo_producto;
`;
exports._buscar_tipo_producto = `
    SELECT 
        ttp.id_tipo_producto, ttp.id_empresa, ttp.descripcion
    FROM 
        public.tbl_tipo_producto ttp
    WHERE
        ttp.id_empresa = $1 AND ttp.descripcion = $2
    ORDER BY ttp.id_tipo_producto DESC;
`;
exports._buscar_tipo_producto_id = `
    SELECT 
        ttp.id_tipo_producto, ttp.id_empresa, ttp.descripcion
    FROM 
        public.tbl_tipo_producto ttp
    WHERE
        ttp.id_tipo_producto = $1; 
`;
exports._editar_tipo_producto = `
    UPDATE 
        public.tbl_tipo_producto
    SET 
        descripcion=$2
    WHERE 
        id_tipo_producto=$1;
`;
