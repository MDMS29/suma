export const _obtener_logs_auditoria = `
    SELECT 
        schema_name, table_name, user_name, action_tstamp,
        CASE 
            WHEN original_data IS NULL THEN 'NO DATA'
            ELSE original_data
        END AS original_data,

        CASE 
            WHEN new_data IS NULL THEN 'NO DATA'
            ELSE new_data
        END AS new_data,

        CASE 
            WHEN query IS NULL THEN 'NO DATA'
            ELSE query
        END AS query,

        CASE action 
            WHEN 'U' THEN 'Actualizacion'
            WHEN 'I' THEN 'Insercion'
            WHEN 'S' THEN 'Inicio Sesion'
            WHEN 'CS' THEN 'Cierre Sesion'
            WHEN 'D' THEN 'Eliminacion'
        END AS action
    FROM 
    auditoria.logged_actions
    ORDER BY action_tstamp DESC 
    LIMIT 20;

`

export const _FAFiltro_logs_auditoria ='auditoria.logs_auditoria_filtro'