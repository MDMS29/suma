"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._editar_marca_producto = exports._buscar_marca_producto_id = exports._buscar_marca_producto = exports._insertar_marca_producto = exports._obtener_marcas_producto = void 0;
exports._obtener_marcas_producto = `
    SELECT 
        tm.id_marca, tm.marca
    FROM 
        public.tbl_marca tm
    ORDER BY tm.id_marca DESC;
`;
exports._insertar_marca_producto = `
    INSERT INTO 
        public.tbl_marca
        (id_marca, marca)
    VALUES
        (nextval('public.tbl_marca_id_marca_seq'::regclass), $1)
    RETURNING id_marca;
`;
exports._buscar_marca_producto = `
    SELECT 
        tm.id_marca, tm.marca
    FROM 
        public.tbl_marca tm
    WHERE 
        tm.marca = $1
    ORDER BY tm.id_marca DESC;
`;
exports._buscar_marca_producto_id = `
    SELECT 
        tm.id_marca, tm.marca
    FROM 
        public.tbl_marca tm
    WHERE 
        tm.id_marca = $1;
`;
exports._editar_marca_producto = `
    UPDATE 
        public.tbl_marca
    SET 
        marca=$2
    WHERE 
        id_marca=$1;
`;
