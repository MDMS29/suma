import { _DB } from "../../config/db";

import {
    _FALoginUsuario, _FAModulosUsuario, _FAMenusModulos,
    _FAAccionesModulos, _FAInsertarUsuario, _FABuscarUsuarioID,
    _FABuscarUsuarioCorreo, _PAInsertarRolModuloUsuario, _PAInsertarPerfilUsuario,
     _FAObtenerUsuario
} from "../dao/DaoUsuarios";
// UsuarioLogeado
import {
    UsuarioLogin, ModulosUsuario, MenusModulos, PermisosModulos
} from "../validations/Types";


let bcrypt = require('bcrypt')

export const _QueryAutenticarUsuario = async ({ usuario, clave }: UsuarioLogin) => {
    try {
        //FUNCIÓN ALMACENADA PARA BUSCAR LA INFORMACIÓN DEL USUARIO DEPENDIENDO DEL CAMPO DE "USUARIO"
        const result = await _DB.func(_FALoginUsuario, [usuario])
        if (result.length !== 0) {
            //COMPARACIÓN DE LAS CLAVES HASHEADAS
            const matches = await bcrypt.compare(clave, result[0].clave)
            if (matches) {
                return result
            }
            return
        }
        return
    } catch (error) {
        console.log(error)
    }
}
export const _QueryModulosUsuario = async (id_usuario: number): Promise<undefined | ModulosUsuario[]> => {
    try {
        //FUNCTIÓN ALMACENADA PARA BUSCAR LOS MODULOS DEL USUARIO POR EL ID DEL USUARIO
        const result = await _DB.func(_FAModulosUsuario, [id_usuario])
        return result
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryMenuModulos = async (id_usuario: number, id_modulo: number): Promise<[] | MenusModulos[]> => {
    try {
        //FUNCIÓN ALMACENADA PARA TOMAR LOS MENUS DE CADA UNO DE LOS MODULOS DEL USUARIO
        const result = await _DB.func(_FAMenusModulos, [id_usuario, id_modulo])
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}
export const _QueryPermisosModulo = async (id_modulo: number, id_usuario: number): Promise<[] | PermisosModulos[]> => {
    try {
        //FUNCIÓN ALMACENADA PARA TOMAR LOS ACCIONES PERMITIDAS PARA CADA UNO DE LOS MODULOS DEL USUARIO
        const result = await _DB.func(_FAAccionesModulos, [id_modulo, id_usuario])
        return result
    } catch (error) {
        console.log(error)
        return []
    }
}

export const _QueryObtenerUsuarios = async (estado: string) => {
    try {
        //FUNCIÓN ALMACENADA PARA TOMAR LOS USUARIOS SEGUN UN ESTADO
        const result = await _DB.func(_FAObtenerUsuario, [+estado])
        return result
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryBuscarUsuario = async (id = 0, usuario = '', correo = '') => {

    let Result
    try {
        if (id !== 0) {
            //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU ID
            Result = await _DB.func(_FABuscarUsuarioID, [id])
        }
        if (usuario !== '' && correo !== '') {
            //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU USUARIO Y CORREO
            Result = await _DB.func(_FABuscarUsuarioCorreo, [usuario, correo])
        }
        return Result[0]
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryInsertarUsuario = async (RequestUsuario: any, UsuarioCreador: string): Promise<number | undefined> => {
    const { nombre_completo, usuario, clave, correo } = RequestUsuario

    try {
        //FUNCTIÓN ALMACENADA PARA INSERTAR LA INFORMACIÓN DEL USUARIO Y RETORNAR EL NUEVO ID
        const result = await _DB.func(_FAInsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
        if (result) {
            return result[0].insertar_usuario;
        }
        return
    } catch (error) {
        console.log(error)
        return
    }
}
export const _QueryInsertarRolModulo = async (id_usuario: number, roles: any[]) => {
    try {
        for (const rol of roles) {
            //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
            await _DB.proc(_PAInsertarRolModuloUsuario, [id_usuario, rol.id_rol]);
        }
    } catch (error) {
        console.log(error)
    } finally {
        return true
    }
}
export const _QueryInsertarPerfilUsuario = async (id_usuario: number, perfiles: any[]) => {
    try {
        for (const perfil of perfiles) {
            //PROCESO ALMACENADO PARA INSERTAR LOS PERFILES DEL USUARIO 
            await _DB.proc(_PAInsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
        }
    } catch (error) {
        console.log(error)
    } finally {
        return true
    }
}