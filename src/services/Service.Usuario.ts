import {
    _QueryAutenticarUsuario, _QueryModulosUsuario, _QueryBuscarUsuario,
    _QueryMenuModulos, _QueryInsertarUsuario, _QueryAccionesModulo,
    _QueryInsertarRolModulo, _QueryInsertarPerfilUsuario
} from "../querys/QuerysUsuarios";
import { UsuarioLogeado, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";

let bcrypt = require('bcrypt')

export class _UsuarioService {

    public async AutenticarUsuario(object: UsuarioLogin) {
        const { usuario, clave } = object;
        const respuesta = await _QueryAutenticarUsuario({ usuario, clave })

        if (respuesta) {
            respuesta.perfilLogin = [] //ARRAY PARA TODOS LOS PERFILES QUE TENGA ASIGNADO EL USUARIO
            for (const res of respuesta) {
                res.perfiles = { id_perfil: res.id_perfil, nombre_perfil: res.nombre_perfil }
                //CARGAR MODULOS SEGUN EL PERFIL
                const modulos = await _QueryModulosUsuario(res.perfiles.id_perfil)
                if (modulos) {
                    res.perfiles.modulos = modulos
                    for (const modulo of modulos) {
                        //CARGAR LOS MENUS DE LOS MODULOS
                        const response = await _QueryMenuModulos(modulo.id_modulo)
                        modulo.menus = response
                    }
                    // CARGAR ACCIONES SEGUN EL USUARIO Y PERFIL
                    const acciones = await _QueryAccionesModulo(respuesta[0].id_usuario, res.perfiles.id_perfil)
                    res.perfiles.permisos = acciones
                }

            }
            const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, estado } = respuesta[0]
            respuesta.forEach((res: UsuarioLogeado) => respuesta.perfilLogin.push(res.perfiles));
            respuesta.token = generarJWT(respuesta[0].id_usuario)
            return {
                usuario:
                {
                    id_usuario,
                    nombre_completo,
                    usuario,
                    fecha_creacion,
                    correo,
                    estado,
                    token: respuesta.token
                },
                perfiles: respuesta.perfilLogin
            }
        }
        return undefined
    }


    public async BuscarUsuario(id = 0, usuario = '', correo = ''): Promise<UsuarioLogeado | undefined> {
        if (id) {
            const respuesta: UsuarioLogeado | undefined = await _QueryBuscarUsuario(id, usuario, correo)
            return respuesta
        }
        return undefined
    }

    public async InsertarUsuario(RequestUsuario: any, UsuarioCreador: string): Promise<any> {
        const { usuario, correo, clave } = RequestUsuario

        const respuesta = await _QueryBuscarUsuario(0, usuario, correo)
        if (respuesta) {
            return { error: true, message: 'Este usuario ya existe' }
        }
        if (clave) {
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            RequestUsuario.clave = hash
            const respuesta = await _QueryInsertarUsuario(RequestUsuario, UsuarioCreador)
            if (respuesta) {
                if (await _QueryInsertarRolModulo(respuesta, RequestUsuario.roles)) { // GUARDAR ROLES DE USUARIO
                    if (await _QueryInsertarPerfilUsuario(respuesta, RequestUsuario.perfiles)) { // GUARDAR PERFILES DE USUARIO
                        const data = await _QueryBuscarUsuario(respuesta, '', '') //BUSCAR EL USUARIO GUARDADO Y RETORNARLO
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
