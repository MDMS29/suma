export const _obtener_logs_auditoria = `
    SELECT 
        schema_name,
        table_name,
        user_name,
        action_tstamp - INTERVAL '5 hours' AS action_tstamp,
        COALESCE(original_data, 'NO DATA') AS original_data,
        COALESCE(new_data, 'NO DATA') AS new_data,
        COALESCE(query, 'NO DATA') AS query,
        CASE action 
            WHEN 'U' THEN 'Actualizacion'
            WHEN 'I' THEN 'Insercion'
            WHEN 'S' THEN 'Inicio Sesion'
            WHEN 'CS' THEN 'Cierre Sesion'
            WHEN 'D' THEN 'Eliminacion'
        END AS acciones,
        ip,
        ubicacion
    FROM 
        auditoria.logged_actions
    ORDER BY action_tstamp DESC 
    LIMIT 20;
`

export const _FAFiltro_logs_auditoria ='auditoria.logs_auditoria_filtro'