import { Request, Response } from 'express';
import { _UsuarioService } from '../services/Service.Usuario';
import { _ParseClave, _ParseCorreo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';

export class _UsuarioController {


    public async AutenticarUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()

        const { usuario, clave } = req.body
        try {
            const UsuarioLogin: UsuarioLogin = {
                usuario: _ParseCorreo(usuario),
                clave: _ParseClave(clave)
            }

            const val = await ServiceUsuario.AutenticarUsuario(UsuarioLogin)
            if (val === undefined) {
                return res.status(400).json({ message: '¡Correo o Contraseña invalidos!' })
            }

            return res.status(200).json(val)

        } catch (error) {
            return res.status(400).send(error)
        }
    }

    public ObtenerUsuarios(req: Request, res: Response) {
        const { usuario } = req
        if (!usuario) {
            res.status(400).json({ message: "No se ha encontrado el usuario" })
        }
        res.status(200).json([{ perfil: usuario }, { recursos: [{ nombre: "Usuarios", url: "/usuarios" }] }])
    }

    public CrearUsuario(req: Request, res: Response): void {
        res.json(req.body);
    }

    public ModificarUsuario(req: Request, res: Response): void {
        res.json(req.body);
    }

    public EliminarUsuario(_: Request, res: Response): void {
        res.send('Eliminar usuario');
    }
}
