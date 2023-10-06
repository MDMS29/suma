import { _DB, client } from "../../config/db";

import {
    _FALoginUsuario, _FAModulosUsuario, _FAMenusModulos,
    _FAAccionesModulos, _FAInsertarUsuario, _FABuscarUsuarioID,
    _FABuscarUsuarioCorreo, _PAInsertarRolModuloUsuario, _PAInsertarPerfilUsuario,
    _FAObtenerUsuario, _EditarUsuario, _BuscarPerfilUsuario,
    _EditarPerfilUsuario, _BuscarRolUsuario, _EditarRolUsuario, _CambiarEstadoUsuario
} from "../dao/DaoUsuarios";

import {
    UsuarioLogin, ModulosUsuario, MenusModulos, PermisosModulos
} from "../validations/Types";

let bcrypt = require('bcrypt')

export class _QueryUsuario {


    public async AutenticarUsuario({ usuario, clave }: UsuarioLogin) {
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
    public async ModulosUsuario(id_usuario: number): Promise<undefined | ModulosUsuario[]> {
        try {
            //FUNCTIÓN ALMACENADA PARA BUSCAR LOS MODULOS DEL USUARIO POR EL ID DEL USUARIO
            const result = await _DB.func(_FAModulosUsuario, [id_usuario, 1])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async MenuModulos(id_usuario: number, id_modulo: number): Promise<[] | MenusModulos[]> {
        try {
            //FUNCIÓN ALMACENADA PARA TOMAR LOS MENUS DE CADA UNO DE LOS MODULOS DEL USUARIO
            const result = await _DB.func(_FAMenusModulos, [id_usuario, id_modulo])
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }
    public async PermisosModulo(id_modulo: number, id_usuario: number): Promise<[] | PermisosModulos[]> {
        try {
            //FUNCIÓN ALMACENADA PARA TOMAR LOS ACCIONES PERMITIDAS PARA CADA UNO DE LOS MODULOS DEL USUARIO
            const result = await _DB.func(_FAAccionesModulos, [id_modulo, id_usuario])
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }
    public async ObtenerUsuarios(estado: string) {
        try {
            //FUNCIÓN ALMACENADA PARA TOMAR LOS USUARIOS SEGUN UN ESTADO
            const result = await _DB.func(_FAObtenerUsuario, [+estado])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async BuscarUsuarioID(id: number) {
        try {
            //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU ID
            let result = await _DB.func(_FABuscarUsuarioID, [id])
            return result

        } catch (error) {
            console.log(error)
            return
        }
    }
    public async BuscarUsuarioCorreo(usuario = '', correo = '') {
        try {
            if (usuario !== '' && correo !== '') {
                //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU USUARIO Y CORREO
                let result = await _DB.func(_FABuscarUsuarioCorreo, [usuario, correo])
                return result
            }
            if (usuario !== '') {
                let result = await client.query('SELECT tu.usuario FROM seguridad.tbl_usuario tu WHERE tu.usuario = $1', [usuario])
                return result.rows
            }
            if (correo !== '') {
                let result = await client.query('SELECT tu.correo FROM seguridad.tbl_usuario tu WHERE tu.correo = $1', [correo])
                return result.rows
            }
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async InsertarUsuario(RequestUsuario: any, UsuarioCreador: string): Promise<number | undefined> {
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
    public async InsertarPerfilUsuario(id_usuario: number, perfil: any) {
        try {
            //PROCESO ALMACENADO PARA INSERTAR LOS PERFILES DEL USUARIO 
            await _DB.proc(_PAInsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
            return true
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async InsertarRolModulo(id_usuario: number, rol: any) {
        try {
            //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
            await _DB.proc(_PAInsertarRolModuloUsuario, [id_usuario, rol.id_rol]);
            return true
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async EditarUsuario({ id_usuario, usuarioEditado, nombreEditado, correoEditado, claveEditada }: any, UsuarioModificador: string) {
        try {
            const result = await client.query(_EditarUsuario, [id_usuario, nombreEditado, usuarioEditado, claveEditada, UsuarioModificador, correoEditado])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async BuscarPerfilUsuario({ id_perfil }: { id_perfil: number }, usuario: number) {
        try {
            const result = await client.query(_BuscarPerfilUsuario, [usuario, id_perfil]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async EditarPerfilUsuario(id_perfil: number, id_estado: number, usuario: number) {
        try {
            const result = await client.query(_EditarPerfilUsuario, [usuario, id_perfil, id_estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async BuscarRolUsuario({ id_rol }: { id_rol: number }, usuario: number) {
        try {
            const result = await client.query(_BuscarRolUsuario, [usuario, id_rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async EditarRolUsuario(id_rol: number, id_estado: number, usuario: number) {
        try {
            const result = await client.query(_EditarRolUsuario, [usuario, id_rol, id_estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async CambiarEstadoUsuario(usuario: number, estado: number) {
        try {
            const result = await client.query(_CambiarEstadoUsuario, [usuario, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}