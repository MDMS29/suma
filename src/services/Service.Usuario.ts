import { _InsertarUsuario } from "../dao/DaoUsuarios";
import { _QueryAutenticarUsuario, _QueryModulosUsuario, _QueryBuscarUsuario, _QueryMenuModulos, _QueryInsertarUsuario } from "../querys/QuerysUsuarios";
import { UsuarioLogeado, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";
let bcrypt = require('bcrypt')
export class _UsuarioService {

    public async AutenticarUsuario(object: UsuarioLogin): Promise<UsuarioLogeado | undefined> {
        const { usuario, clave } = object;
        const respuesta: UsuarioLogeado | undefined = await _QueryAutenticarUsuario({ usuario, clave })
        if (respuesta) {
            const modulos = await _QueryModulosUsuario(respuesta.id_usuario)
            if (modulos) {
                respuesta.modulos = modulos
                for (const modulo of modulos) {
                    const response = await _QueryMenuModulos(modulo.id_modulo)
                    modulo.menus = response
                }
                respuesta.token = generarJWT(respuesta.id_usuario)
            }
        }
        return respuesta
    }


    public async BuscarUsuario(id: number): Promise<UsuarioLogeado | undefined> {
        if (id) {
            const respuesta: UsuarioLogeado | undefined = await _QueryBuscarUsuario(id)
            return respuesta
        }
        return
    }
    public async InsertarUsuario(RequestUsuario: any, UsuarioCreador: number) {
        const { clave } = RequestUsuario

        if (clave) {
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            RequestUsuario.clave = hash
            const respuesta = await _QueryInsertarUsuario(RequestUsuario, UsuarioCreador)
            return respuesta
        } else {
            throw new Error('Error al hashear clave')
        }
    }
}
