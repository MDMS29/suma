import { Request, Response } from 'express';
import { _UsuarioService } from '../services/Service.Usuario';
import { EstadosTablas, _ParseClave, _ParseCorreo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';
import { UsusarioSchema } from '../validations/UsuarioSchemas';

export class _UsuarioController {
    private _Usuario_Service: _UsuarioService;

    constructor(_Usuario_Service: _UsuarioService) {
        //INICIALIZAR SERVICIO
        this._Usuario_Service = _Usuario_Service;
    }

    public async AutenticarUsuario(req: Request, res: Response) {
        //TOMAR LA INFORMACIÓN DEL USUARIO ENVIADO
        const { usuario, clave, captcha }: UsuarioLogin = req.body
        //VERIFICACIÓN DEL CAPTCHA
        if (captcha === '') {
            return res.send({ error: true, message: 'Debe realizar el CAPTCHA' })
        }
        try {
            //ORGANIZAR INFORMACIÓN CLAVE PARA LA AUTENTICACIÓN
            const UsuarioLogin: Omit<UsuarioLogin, 'captcha'> = {
                usuario: _ParseCorreo(usuario),
                clave: _ParseClave(clave)
            }

            //SERVICIO PARA LA AUTENTICACIÓN
            const val = await this._Usuario_Service.AutenticarUsuario(UsuarioLogin)
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
        const { usuario } = req//TOMAR LA INFORMACION DEL MIDDLEWARE
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' })
        }

        try {
            //SERVICIO PARA OBTENER LOS USUARIOS
            const respuesta = await this._Usuario_Service.ObtenerUsuarios(estado)
            if (!respuesta) {
                return res.json({ error: true, message: 'No se han encontrado usuarios activos' }) //ERROR
            }
            //RETORNAR LAS RESPUESTAS DEL SERVICIO
            return res.json(respuesta)

        } catch (error) {
            return res.json({ error: true, message: 'Error al obtener los usuarios' })
        }
    }

    public async PerfilUsuario(req: Request, res: Response) {
        const { usuario } = req //TOMAR LA INFORMACION DEL MIDDLEWARE
        res.json(usuario) //ENVIAR LA INFORMACION DEL MIDDLEWARE
    }

    public async BuscarUsuario(req: Request, res: Response) {
        const { id_usuario } = req.params //OBTENER LA ID DEL USUARIO POR PARAMETROS

        try {
            if (id_usuario) { //VALIDAR ID
                const respuesta = await this._Usuario_Service.BuscarUsuario(+id_usuario, 'param') //INVOCAR LA FUNCION PARA BUSCAR EL USUARIO
                if (!respuesta) { //VALIDAR SI NO HAY RESPUESTA
                    return res.json({ error: true, message: 'No se ha encontrado al usuario' }) //ERROR
                }

                return res.json(respuesta) //RETORNAR AL USUARIO LA INFORMACION ENCONTRADA
            }
            return res.json({ error: true, message: 'Error al buscar el usuario' }) //ERROR
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al buscar el usuario' })//ERROR
        }
    }

    public async CrearUsuario(req: Request, res: Response) {
        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //ERROR
        }

        const result = UsusarioSchema.safeParse(req.body) //VALIDACION DE LOS DATOS CON LA LIBRERIA ZOD
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.json({ error: true, message: result.error.issues }) //ERROR
        }
        try {

            const respuesta = await this._Usuario_Service.InsertarUsuario(result.data, req.usuario?.usuario) //INVOCAR FUNCION PARA INSERTAR EL USUARIO
            if (!respuesta.error) { //SI LA RESPUESTA LLEGA CORRECTAMENTE
                return res.json(respuesta) //ENVIAR LA INFORMACION DEL USUARIO CREADO
            } else {
                return res.json({ error: true, message: respuesta }) //ERROR
            }
        } catch (error) {
            return res.json({ error: true, message: 'Error al crear el usuario' }) //ERROR
        }

    }

    public async EditarUsuario(req: Request, res: Response) {
        const { usuario, perfiles, roles } = req.body //OBTENER LA INFORMACION ENVIADA
        const { id_usuario } = req.params //OBTENER EL ID DEL USUARIO POR PARAMETROS
        //VALIDACION DE DATOS
        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //ERROR
        }
        if (!id_usuario) { //VALIDAR QUE SI SE HA ENVIADO UN ID
            return res.json({ error: true, message: "Usuario no definido" }) //ERROR
        }
        if (perfiles?.length <= 0) { //VALIDAR QUE SI SE ESTEN AGREGANDO PERFILES
            return res.json({ error: true, message: "Debe asignarle al menos un perfil al usuario" }) //ERROR
        }
        if (roles?.length <= 0) {//VALIDAR QUE SI SE ESTEN AGREGANDO ROLES
            return res.json({ error: true, message: "Debe asignarle permisos al usuario" }) //ERROR
        }
        const result = UsusarioSchema.partial().safeParse(usuario) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.json({ error: true, message: result.error.issues }) //ERROR
        }

        const respuesta: any = await this._Usuario_Service.EditarUsuario(result.data, req.usuario?.usuario) //INVOCAR FUNCION PARA EDITAR EL USUARIO
        if (respuesta?.error) { //VALIDAR SI HAY UN ERROR
            return res.json(respuesta) //ERROR
        }
        const perfilesEditados: any = await this._Usuario_Service.EditarPerfilesUsuario(perfiles, usuario.id_usuario) //INVOCAR FUNCION PARA EDITAR LOS PERFILES DEL USUARIO
        if (perfilesEditados?.error) { //VALIDAR SI HAY UN ERROR
            return res.json(perfilesEditados) //ERROR
        }
        const permisoEditado = await this._Usuario_Service.EditarPermisosUsuario(roles, usuario.id_usuario) //INVOCAR FUNCION PARA EDITAR LOS ROLES DEL USUARIO
        if (permisoEditado?.error) {//VALIDAR SI HAY UN ERROR
            return res.json(permisoEditado) //ERROR
        }
        const usuarioEditado = await this._Usuario_Service.BuscarUsuario(+id_usuario, 'param')
        if (!usuarioEditado) {//VALIDAR SI HAY UN ERROR
            return res.json({ error: true, message: 'Usuario no encontrado' })
        }

        return res.json(usuarioEditado) //RETORNO DE USUARIO EDITADO
    }

    public async CambiarEstadoUsuario(req: Request, res: Response) {
        const { id_usuario } = req.params //OBTENER EL ID DEL USUARIO ENVIADO POR PARAMETROS
        let { estado } = req.body //OBTENER EL ESTADO QUE TENDRA EL USUARIO

        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //ERROR
        }

        if (!id_usuario) { //VALIDAR SI SE ESTA ENVIANDO UN ID VALIDO
            return res.json({ error: true, message: "Usuario no definido" })
        }
        if (!estado) { //VALIDAR SI EL ESTADO EXISTE
            return res.json({ error: true, message: "Estado no definido" })
        }
        if (typeof estado === 'string') {
            //CONVERSION DEL ESTADO STRING A NUMBER PARA ENVIARLO AL SERVICE
            estado = +estado
            if (!estado) {
                return res.json({ error: true, message: "Estado no definido" }) //VALIDAR SI EL ESTADO ES UN VALOR VALIDO
            }
        }
        const busqueda = await this._Usuario_Service.CambiarEstadoUsuario(+id_usuario, estado) //INVOCAR FUNCION PARA CAMBIAR EL ESTADO DEL USUARIO
        if (busqueda?.error) { //VALIDAR SI HAY ALGUN ERROR
            return res.json(busqueda) //ERROR
        }

        //ENVIAR INFORMACION DEPENDIENDO DEL ESTADO
        return res.json({ error: false, message: estado == EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el usuario' : 'Se ha desactivado el usuario' })
    }
}
