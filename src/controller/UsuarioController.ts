import { Request, Response } from 'express';
import { _UsuarioService } from '../services/Service.Usuario';
import { _ParseClave, _ParseCorreo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';
import { UsusarioSchema } from '../validations/UsuarioSchemas';

export class _UsuarioController {

    //FUNCIÓN PARA AUTENTICAR EL USUARIO POR SU USUARIO Y CLAVE INGRESADA
    public async AutenticarUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        //TOMAR LA INFORMACIÓN DEL USUARIO ENVIADO
        const { usuario, clave, captcha } = req.body
        //VERIFICACIÓN DEL CAPTCHA
        if (captcha === '') {
            return res.send({ error: true, message: 'Debe realizar el CAPTCHA' })
        }
        try {
            //ORGANIZAR INFORMACIÓN CLAVE PARA LA AUTENTICACIÓN
            const UsuarioLogin: UsuarioLogin = {
                usuario: _ParseCorreo(usuario),
                clave: _ParseClave(clave)
            }

            //SERVICIO PARA LA AUTENTICACIÓN
            const val = await ServiceUsuario.AutenticarUsuario(UsuarioLogin)
            //VERFICICARIÓN DE DATOS RETORNADOS
            if (!val) {
                //RESPUESTA AL CLIENTE
                return res.json({ error: true, message: 'Usuario o contraseña invalido' })
            }

            //RESPUESTA AL CLIENTE
            return res.status(200).json(val)

        } catch (error) {
            //RESPUESTA AL CLIENTE EN CASO DE ERROR AL REALIZAR LA CONSULTA
            return res.status(400).send(error)
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
}
