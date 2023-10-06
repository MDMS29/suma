"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._EditarPerfilUsuario = exports._BuscarPerfilUsuario = exports._EditarUsuario = exports._PAInsertarPerfilUsuario = exports._PAInsertarRolModuloUsuario = exports._FABuscarUsuarioCorreo = exports._FABuscarUsuarioID = exports._FAInsertarUsuario = exports._FAObtenerUsuario = exports._FAAccionesModulos = exports._FAMenusModulos = exports._FAModulosUsuario = exports._FALoginUsuario = void 0;
exports._FALoginUsuario = 'seguridad.login_usuario';
exports._FAModulosUsuario = 'seguridad.modulos_usuario';
exports._FAMenusModulos = 'seguridad.menus_modulo';
exports._FAAccionesModulos = 'seguridad.acciones_modulo';
exports._FAObtenerUsuario = 'seguridad.obtener_usuarios_estado';
exports._FAInsertarUsuario = 'seguridad.insertar_usuario';
exports._FABuscarUsuarioID = 'seguridad.buscar_usuario_id';
exports._FABuscarUsuarioCorreo = 'seguridad.buscar_usuario_correo';
exports._PAInsertarRolModuloUsuario = 'seguridad.insertar_modulo_usuario';
exports._PAInsertarPerfilUsuario = 'seguridad.insertar_perfil_usuario';
exports._EditarUsuario = `
    UPDATE 
        seguridad.tbl_usuario
    SET 
        nombre_completo=$2, usuario=$3, 
        clave=$4, fecha_modificacion=now(), 
        usuario_modificacion=$5, correo=$6
    WHERE 
        id_usuario=$1;
`;
exports._BuscarPerfilUsuario = `
    SELECT 
    *
    FROM
    seguridad.tbl_perfil_usuario tpu
    WHERE 
    tpu.id_usuario = $1 AND tpu.id_perfil = $2;
    
    `;
exports._EditarPerfilUsuario = `
        UPDATE 
            seguridad.tbl_perfil_usuario
        SET 
            id_estado=$3
        WHERE 
            id_usuario=$1 and id_perfil=$2;
    `;
