"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._Editar_Empresa_Usuario = exports._Insertar_Empresa_Usuario = exports._CambiarClaveUsuario = exports._CambiarEstadoUsuario = exports._EditarRolUsuario = exports._BuscarRolUsuario = exports._EditarPerfilUsuario = exports._BuscarPerfilUsuario = exports._EditarUsuario = exports._PAInsertarPerfilUsuario = exports._PAInsertarRolModuloUsuario = exports._FABuscarUsuarioCorreo = exports._FABuscarUsuarioID = exports._FAInsertarUsuario = exports._FAObtenerUsuario = exports._FAAccionesModulos = exports._FAMenusModulos = exports._FAModulosUsuario = exports._FALoginUsuario = void 0;
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
    UPDATE seguridad.tbl_perfil_usuario
    SET id_estado=$3
    WHERE id_usuario=$1 AND id_perfil=$2;
`;
exports._BuscarRolUsuario = `
    SELECT 
        *
    FROM
        seguridad.tbl_usuario_roles tur
    WHERE 
        tur.id_usuario = $1 AND tur.id_rol_modulo = $2;
`;
exports._EditarRolUsuario = `
    UPDATE seguridad.tbl_usuario_roles
    SET id_estado=$3
    WHERE id_usuario=$1 AND id_rol_modulo=$2;
`;
exports._CambiarEstadoUsuario = `
    UPDATE 
        seguridad.tbl_usuario
    SET 
        id_estado=$2
    WHERE 
        id_usuario=$1
`;
exports._CambiarClaveUsuario = `
    UPDATE 
        seguridad.tbl_usuario
    SET 
        clave=$2, cm_clave=$3
    WHERE 
        id_usuario=$1
`;
exports._Insertar_Empresa_Usuario = `
    INSERT INTO 
        seguridad.tbl_usuarios_empresas
        (id_empresa, id_usuario, id_estado, fecha_creacion, usuario_creacion)
    VALUES 
        ($1, $2, 1, now(), $3)
`;
exports._Editar_Empresa_Usuario = `
    UPDATE
        seguridad.tbl_usuarios_empresas
    SET
        id_empresa=$2, fecha_actualizacion=now(), usuario_modificacion=$3
    WHERE 
        id_usuario = $1
`;
