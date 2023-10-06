import { Request, Response } from 'express';
import { _UsuarioService } from '../services/Service.Usuario';
import { _ParseClave, _ParseCorreo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';
import { UsusarioSchema } from '../validations/UsuarioSchemas';

export class _UsuarioController {

    //FUNCIÓN PARA AUTENTICAR EL USUARIO POR SU USUARIO Y CLAVE INGRESADA
    public async AutenticarUsuario(req: Request, res: Response) {
        //TOMAR LA INFORMACIÓN DEL USUARIO ENVIADO
        const { usuario, clave, captcha } = req.body
        //VERIFICACIÓN DEL CAPTCHA
        if (captcha === '') {
            return res.send({ error: true, message: 'Debe realizar el CAPTCHA' })
        }
        try {
            //INICIALIZAR SERVICIO
            const ServiceUsuario = new _UsuarioService()
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
    public async ObtenerUsuarios(req: Request, res: Response) {
        const { usuario } = req
        const { estado } = req.query as { estado: string }
        if (!usuario?.id_usuario) {
            return res.json({ error: true, message: 'Inicie sesion para continuar' })
        }

        try {
            //INICIALIZAR SERVICIO
            const ServiceUsuario = new _UsuarioService()
            //SERVICIO PARA OBTENER LOS USUARIOS
            const respuesta = await ServiceUsuario.ObtenerUsuarios(estado)

            //RETORNAR LAS RESPUESTAS DEL SERVICIO
            return res.json(respuesta)

        } catch (error) {
            return res.json({ error: true, message: 'Error al obtener los usuarios' })
        }
    }
    public async PerfilUsuario(req: Request, res: Response) {
        const { usuario } = req
        res.json(usuario)
    }
    public async BuscarUsuario(req: Request, res: Response) {
        const ServiceUsuario = new _UsuarioService()
        const { id_usuario } = req.params

        if (id_usuario) {
            const respuesta = await ServiceUsuario.BuscarUsuario(+id_usuario, 'param')
            if (!respuesta) {
                return res.json({ error: true, message: 'No se ha encontrado al usuario' })
            }

            return res.json(respuesta)
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
    public async EditarUsuario(req: Request, res: Response) {
        const { usuario, perfiles, roles } = req.body
        const { id_usuario } = req.params
        //VALIDACION DE DATOS
        if (!id_usuario) {
            return res.json({ error: true, message: "Usuario no definido" })
        }
        if (perfiles?.length <= 0) {
            return res.json({ error: true, message: "Debe asignarle al menos un perfil al usuario" })
        }
        if (roles?.length <= 0) {
            return res.json({ error: true, message: "Debe asignarle permisos al usuario" })
        }
        const result = UsusarioSchema.partial().safeParse(usuario)
        if (!result.success) {
            const error = result.error.issues
            return res.status(400).json(error)
        }
        //INICIALIZAR SERVICIO
        const ServiceUsuario = new _UsuarioService()
        //SERVICIO PARA EDITAR EL USUARIO
        const respuesta: any = await ServiceUsuario.EditarUsuario(result.data, req.usuario?.usuario)
        if (respuesta?.error) {
            return res.json(respuesta)
        }
        const perfilesEditados: any = await ServiceUsuario.EditarPerfilesUsuario(perfiles, usuario.id_usuario)
        if (perfilesEditados?.error) {
            return res.json(perfilesEditados)
        }
        const permisoEditado = await ServiceUsuario.EditarPermisosUsuario(roles, usuario.id_usuario)
        if (permisoEditado?.error) {
            return res.json(permisoEditado)
        }
        const usuarioEditado = await ServiceUsuario.BuscarUsuario(+id_usuario, 'param')
        if (!usuarioEditado) {
            return res.json({ error: true, message: 'Usuario no encontrado' })
        }

        return res.json(usuarioEditado)
    }
    public async CambiarEstadoUsuario(req: Request, res: Response) {
        const { id_usuario } = req.params
        let { estado } = req.body

        if (!id_usuario) {
            return res.json({ error: true, message: "Usuario no definido" })
        }
        if (!estado) {
            return res.json({ error: true, message: "Estado no definido" })
        }
        if (typeof estado === 'string') {
            //CONVERSION DEL ESTADO STRING A NUMBER PARA ENVIARLO AL SERVICE
            estado = +estado
            if (!estado) {
                return res.json({ error: true, message: "Estado no definido" })
            }
        }
        //INICIALIZAR SERVICIO
        const ServiceUsuario = new _UsuarioService()
        const busqueda = await ServiceUsuario.CambiarEstadoUsuario(+id_usuario, estado)
        if (busqueda?.error) {
            return res.json(busqueda)
        }
        return res.json({ error: false, message: estado == 1 ? 'Se ha activado el usuario' : 'Se ha desactivado el usuario' })
    }
}
