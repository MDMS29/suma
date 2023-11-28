export const _obtener_logs_auditoria = `
    SELECT 
    schema_name, table_name, user_name, action_tstamp, original_data, new_data, query,
    CASE action 
        WHEN 'U' THEN 'Actualizacion'
        WHEN 'I' THEN 'Insercion'
        WHEN 'S' THEN 'Inicio Sesion'
        WHEN 'CS' THEN 'Cierre Sesion'
        WHEN 'D' THEN 'Eliminacion'
    END action
    FROM 
    auditoria.logged_actions
    ORDER BY action_tstamp DESC 
    LIMIT 20;
`