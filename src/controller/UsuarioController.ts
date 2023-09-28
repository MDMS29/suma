import { Request, Response } from 'express';
import { _UsuarioService } from '../services/Service.Usuario';
import { _ParseClave, _ParseCorreo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';
import { UsusarioSchema } from '../schemas/UsuarioSchemas';

export class _UsuarioController {

    public async AutenticarUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        const { perfil, usuario, clave } = req.body
        try {
            const UsuarioLogin: UsuarioLogin = {
                perfil,
                usuario: _ParseCorreo(usuario),
                clave: _ParseClave(clave)
            }

            const val = await ServiceUsuario.AutenticarUsuario(UsuarioLogin)
            if (!val) {
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

    public async CrearUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        if (!req.usuario?.id_usuario) {
            return res.status(400).json({ message: "Debe inicar sesión para realizar esta acción" })
        }

        const result = UsusarioSchema.safeParse(req.body) //Validación de datos con librería zod
        if (!result.success) {
            const error = result.error.issues
            return res.status(400).json(error)
        }
        const respuesta = await ServiceUsuario.InsertarUsuario(result.data, req.usuario?.usuario)
        if (!respuesta.error) {
            return res.status(201).json(respuesta)
        } else {
            return res.status(400).json(respuesta?.error)
        }

        return res.status(400).json({ message: "No se ha podido crear el usuario" })
    }

    public ModificarUsuario(req: Request, res: Response): void {
        res.json(req.body);
    }

    public EliminarUsuario(_: Request, res: Response): void {
        res.send('Eliminar usuario');
    }
}
