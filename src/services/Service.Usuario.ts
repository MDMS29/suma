import {
    _QueryAutenticarUsuario, _QueryModulosUsuario, _QueryBuscarUsuario,
    _QueryMenuModulos, _QueryInsertarUsuario, _QueryAccionesModulo,
    _QueryInsertarRolModulo, _QueryInsertarPerfilUsuario
} from "../querys/QuerysUsuarios";
import { UsuarioLogeado, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";

let bcrypt = require('bcrypt')

export class _UsuarioService {

    public async AutenticarUsuario(object: UsuarioLogin): Promise<UsuarioLogeado | undefined> {
        const { perfil, usuario, clave } = object;
        const respuesta: UsuarioLogeado | undefined = await _QueryAutenticarUsuario({ perfil, usuario, clave })
        if (respuesta) {
            //CARGAR MODULOS SEGUN EL PERFIL
            const modulos = await _QueryModulosUsuario(respuesta.id_perfil)
            if (modulos) {
                respuesta.modulos = modulos
                for (const modulo of modulos) {
                    //CARGAR LOS MENUS DE LOS MODULOS
                    const response = await _QueryMenuModulos(modulo.id_modulo)
                    modulo.menus = response
                }
                //CARGAR ACCIONES SEGUN EL USUARIO Y PERFIL
                const acciones = await _QueryAccionesModulo(respuesta.id_usuario, respuesta.id_perfil)
                respuesta.permisos = acciones
            }
            respuesta.token = generarJWT(respuesta.id_usuario)
            return respuesta
        }
        throw new Error('Error al cargar usuario')
    }


    public async BuscarUsuario(id: number): Promise<UsuarioLogeado | undefined> {
        if (id) {
            const respuesta: UsuarioLogeado | undefined = await _QueryBuscarUsuario(id)
            return respuesta
        }
        return undefined
    }

    public async InsertarUsuario(RequestUsuario: any, UsuarioCreador: string) {
        const { clave } = RequestUsuario

        if (clave) {
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            RequestUsuario.clave = hash
            const respuesta = await _QueryInsertarUsuario(RequestUsuario, UsuarioCreador)
            if (respuesta) {
                if (await _QueryInsertarRolModulo(respuesta, RequestUsuario.roles)) { // GUARDAR ROLES DE USUARIO
                    if (await _QueryInsertarPerfilUsuario(respuesta, RequestUsuario.perfiles)) { // GUARDAR PERFILES DE USUARIO
                        const data = await _QueryBuscarUsuario(respuesta) //BUSCAR EL USUARIO GUARDADO Y RETORNARLO
                        return data
                    }
                }
            }
            throw new Error('Error al guardar el usuario')
        } else {
            throw new Error('Error al hashear clave de usuario')
        }
    }
}
