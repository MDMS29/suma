import { Request, Response } from 'express';
import { _UsuarioService } from '../services/Service.Usuario';
import { _ParseClave, _ParseCorreo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';
import { UsusarioSchema } from '../validations/UsuarioSchemas';
import { _QueryMenusUsuario } from '../querys/QuerysUsuarios';

export class _UsuarioController {

    public async AutenticarUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        const { usuario, clave, captcha } = req.body
        if (captcha === '') {
            return res.send({ error: true, message: 'Debe realizar el CAPTCHA' })
        }
        try {
            const UsuarioLogin: UsuarioLogin = {
                usuario: _ParseCorreo(usuario),
                clave: _ParseClave(clave)
            }

            const val = await ServiceUsuario.AutenticarUsuario(UsuarioLogin)
            if (!val) {
                return res.json({ error: true, message: 'Usuario o contraseña invalido' })
            }

            return res.status(200).json(val)

        } catch (error) {
            return res.status(400).send(error)
        }
    }

    public async ObtenerModulosUsuario(req: Request, res: Response) {
        const { id_usuario } = req.params
        if (!id_usuario) {
            return res.json({ error: true, message: "Inicie sesion para continuar" })
        }

        const ServiceUsuario = new _UsuarioService()
        try {
            const respuesta = await ServiceUsuario.ModulosUsuario(+id_usuario)
            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return 
        }
    }

    public async BuscarUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        const { id_usuario } = req.params

        if (id_usuario) {
            const respuesta = await ServiceUsuario.BuscarUsuario(+id_usuario, 'param', '')
            if (!respuesta) {
                return res.json({ error: true, message: 'Usuario no encontrado' })
            }

            res.statusCode = 200
            return res.status(200).json(respuesta)
        }
        return res.status(404).json({ message: '' })

    }

    public async CrearUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        if (!req.usuario?.id_usuario) {
            return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" })
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
            return res.status(400).json(respuesta)
        }

        // return res.status(400).json({ message: "No se ha podido crear el usuario" })
    }
    public ObtenerUsuarios(req: Request, res: Response) {
        const { usuario } = req
        if (!usuario) {
            res.status(400).json({ message: "No se ha encontrado el usuario" })
        }
        res.status(200).json([{ perfil: usuario }, { recursos: [{ nombre: "Usuarios", url: "/usuarios" }] }])
    }

    public ModificarUsuario(req: Request, res: Response): void {
        res.json(req.body);
    }

    public EliminarUsuario(_: Request, res: Response): void {
        res.send('Eliminar usuario');
    }

    public async ObtenerMenusUsuario(req: Request, res: Response) {
        const { id_usuario, id_perfil } = req.params
        const resultado = await _QueryMenusUsuario(+id_usuario, +id_perfil)
        res.json(resultado);
    }
}
