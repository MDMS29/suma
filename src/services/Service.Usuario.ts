import { _QueryAutenticarUsuario, _QueryBuscarUsuario } from "../querys/QuerysUsuarios";
import { UsuarioLogeado, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";

export class _UsuarioService {

    public async AutenticarUsuario(object: UsuarioLogin): Promise<any> {
        const { correo, contrasena } = object;
        const respuesta: UsuarioLogeado | undefined = await _QueryAutenticarUsuario({ correo, contrasena })
        if (respuesta !== undefined) {
            respuesta.token = generarJWT(respuesta.id_usuario)
        }

        return respuesta
    }

    public async BuscarUsuario(id: number): Promise<any> {
        const respuesta = await _QueryBuscarUsuario(id)
        return respuesta
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
