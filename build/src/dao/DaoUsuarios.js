"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._BuscarUsuario = exports._LoginUsuario = exports._SeleccionarTodosLosUsuarios = void 0;
exports._SeleccionarTodosLosUsuarios = 'SELECT * FROM public.tbl_usuarios';
exports._LoginUsuario = "SELECT id_usuario, correo, contrasena FROM public.tbl_usuarios WHERE correo= $1 AND contrasena=$2";
exports._BuscarUsuario = "SELECT id_usuario, correo, contrasena FROM public.tbl_usuarios WHERE id_usuario = $1";
