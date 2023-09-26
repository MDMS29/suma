import { _QueryAutenticarUsuario, _QueryModulosUsuario, _QueryBuscarUsuario, _QueryMenuModulos } from "../querys/QuerysUsuarios";
import { UsuarioLogeado, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";

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

    public ObtenerUsuarios(): void {

    }

    public CrearUsuario(): void {
    }

    public ModificarUsuario(): void {
    }

    public EliminarUsuario(): void {
    }
}
