import { Request, Response } from 'express';
import UsuarioService from '../services/Usuario.service';
import { EstadosTablas, Generar_Llaves_Secretas, _Parse_Clave, _Parse_Correo } from '../validations/utils';
import { UsuarioLogin } from '../validations/Types';
import { UsusarioSchema } from '../validations/ValidacionesZod';
import { transporter } from '../../config/mailer';

export default class UsuarioController {
    public async Autenticar_Usuario(req: Request, res: Response) {
        //TOMAR LA INFORMACIÓN DEL USUARIO ENVIADO
        const { usuario, clave, captcha }: UsuarioLogin = req.body
        //VERIFICACIÓN DEL CAPTCHA
        if (captcha === '') {
            return res.status(404).json({ error: true, message: 'Debe realizar el CAPTCHA' }) //!ERROR
        }
        try {
            //ORGANIZAR INFORMACIÓN CLAVE PARA LA AUTENTICACIÓN
            const usuario_login: Omit<UsuarioLogin, 'captcha'> = {
                usuario: _Parse_Correo(usuario),
                clave: _Parse_Clave(clave)
            }

            const usuario_service = new UsuarioService()

            //SERVICIO PARA LA AUTENTICACIÓN
            const val = await usuario_service.Autenticar_Usuario(usuario_login)

            //VERFICICARIÓN DE DATOS RETORNADOS
            if (!val) {
                //RESPUESTA AL CLIENTE
                return res.status(401).json({ error: true, message: 'Usuario o contraseña invalido' }) //!ERROR
            }

            //RESPUESTA AL CLIENTE
            return res.status(200).json(val)

        } catch (error) {
            //RESPUESTA AL CLIENTE EN CASO DE ERROR AL REALIZAR LA CONSULTA
            return res.status(500).send(error)
        }
    }

    public async Obtener_Usuarios(req: Request, res: Response) {
        const { usuario } = req//TOMAR LA INFORMACION DEL MIDDLEWARE
        // const { estado } = req.body
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' })
        }

        try {
            const usuario_service = new UsuarioService()
            //SERVICIO PARA OBTENER LOS USUARIOS
            const respuesta = await usuario_service.Obtener_Usuarios(estado)
            if (!respuesta) {
                return res.status(200).json({ error: true, message: 'No se han encontrado usuarios activos' }) //!ERROR
            }
            //RETORNAR LAS RESPUESTAS DEL SERVICIO
            return res.json(respuesta)

        } catch (error) {
            return res.status(500).json({ error: true, message: 'Error al obtener los usuarios' })
        }
    }

    public async Perfil_Usuario(req: Request, res: Response) {
        const { usuario } = req //TOMAR LA INFORMACION DEL MIDDLEWARE
        if (!usuario.id_usuario) {
            return res.status(401).send({ error: true, message: 'Inicie sesion para continuar' })
        }
        return res.status(200).json(usuario) //ENVIAR LA INFORMACION DEL MIDDLEWARE
    }

    public async Buscar_Usuario(req: Request, res: Response) {
        const { id_usuario } = req.params //OBTENER LA ID DEL USUARIO POR PARAMETROS

        try {
            const usuario_service = new UsuarioService()
            if (id_usuario) { //VALIDAR ID
                const respuesta = await usuario_service.Buscar_Usuario(+id_usuario, 'param') //INVOCAR LA FUNCION PARA BUSCAR EL USUARIO
                if (!respuesta) { //VALIDAR SI NO HAY RESPUESTA
                    return res.status(404).json({ error: true, message: 'No se ha encontrado al usuario' }) //!ERROR
                }

                return res.status(200).json(respuesta) //RETORNAR AL USUARIO LA INFORMACION ENCONTRADA
            }
            return res.status(500).json({ error: true, message: 'Error al buscar el usuario' }) //!ERROR
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al buscar el usuario' })//!ERROR
        }
    }

    public async Crear_Usuario(req: Request, res: Response) {
        // const { roles } = req.body
        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(401).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //!ERROR
        }

        
        const result = UsusarioSchema.safeParse(req.body) //VALIDACION DE LOS DATOS CON LA LIBRERIA ZOD
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(404).json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const usuario_service = new UsuarioService()
            const respuesta = await usuario_service.Insertar_Usuario(result.data, req.usuario?.usuario) //INVOCAR FUNCION PARA INSERTAR EL USUARIO
            if (respuesta.error) { //SI LA RESPUESTA LLEGA CORRECTAMENTE
                return res.status(404).json(respuesta) //!ERROR
            }
            //TOMAR LA INFORMACION PERSONALIZADA PARA ENVIARLA HACIA EL CLIENTE
            const { id_usuario, nombre_completo, usuario, id_estado, correo, estado_usuario } = respuesta

            return res.status(200).json({
                id_usuario,
                nombre_completo,
                usuario,
                id_estado,
                estado_usuario,
                correo
            }) //ENVIAR LA INFORMACION DEL USUARIO CREADO
        } catch (error) {
            return res.status(500).json({ error: true, message: 'Error al crear el usuario' }) //!ERROR
        }

    }

    public async Editar_Usuario(req: Request, res: Response) {
        const { perfiles, roles } = req.body //OBTENER LA INFORMACION ENVIADA
        const { id_usuario } = req.params //OBTENER EL ID DEL USUARIO POR PARAMETROS
        //VALIDACION DE DATOS
        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(400).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //!Error
        }
        if (!id_usuario) { //VALIDAR QUE SI SE HA ENVIADO UN ID
            return res.status(400).json({ error: true, message: "Usuario no definido" }) //!ERROR
        }
        if (perfiles?.length <= 0) { //VALIDAR QUE SI SE ESTEN AGREGANDO PERFILES
            return res.status(400).json({ error: true, message: "Debe asignarle al menos un perfil al usuario" }) //!ERROR
        }
        // const rol = roles.filter((rol: { id_rol: number }) => rol.id_rol === 1)
        // if (rol?.length <= 0) {
        //     return res.status(404).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }) //!ERROR
        // }
        if (roles?.length <= 0) {//VALIDAR QUE SI SE ESTEN AGREGANDO ROLES
            return res.status(400).json({ error: true, message: "Debe asignarle permisos al usuario" }) //!ERROR
        }

        // const result = UsusarioSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        // if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
        //     return res.json({ error: true, message: result.error.issues }) //!ERROR
        // }

        try {
            const usuario_service = new UsuarioService()
            const respuesta: any = await usuario_service.Editar_Usuario(req.body, req.usuario?.usuario) //INVOCAR FUNCION PARA EDITAR EL USUARIO
            if (respuesta?.error) { //VALIDAR SI HAY UN ERROR
                return res.status(400).json(respuesta) //!ERROR
            }
            const perfilesEditados: any = await usuario_service.Editar_Perfiles_Usuario(perfiles, +id_usuario) //INVOCAR FUNCION PARA EDITAR LOS PERFILES DEL USUARIO
            if (perfilesEditados?.error) { //VALIDAR SI HAY UN ERROR
                return res.status(400).json(perfilesEditados) //!ERROR
            }
            const permisoEditado = await usuario_service.Editar_Permisos_Usuario(roles, +id_usuario) //INVOCAR FUNCION PARA EDITAR LOS ROLES DEL USUARIO
            if (permisoEditado?.error) {//VALIDAR SI HAY UN ERROR
                return res.status(400).json(permisoEditado) //!ERROR
            }
            const usuarioEditado = await usuario_service.Buscar_Usuario(+id_usuario, 'param')
            if (!usuarioEditado) {//VALIDAR SI HAY UN ERROR
                return res.status(400).json({ error: true, message: 'Usuario no encontrado' })
            }
            return res.status(200).json(usuarioEditado) //RETORNO DE USUARIO EDITADO
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el usuario' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Usuario(req: Request, res: Response) {
        const { id_usuario } = req.params //OBTENER EL ID DEL USUARIO ENVIADO POR PARAMETROS
        let { estado } = req.query as { estado: string }//OBTENER EL ESTADO QUE TENDRA EL USUARIO

        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(401).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //!ERROR
        }

        if (!id_usuario) { //VALIDAR SI SE ESTA ENVIANDO UN ID VALIDO
            return res.status(400).json({ error: true, message: "Usuario no definido" })
        }
        if (!estado) { //VALIDAR SI EL ESTADO EXISTE
            return res.status(400).json({ error: true, message: "Estado no definido" })
        }
        if (typeof estado === 'string') {
            //CONVERSION DEL ESTADO STRING A NUMBER PARA ENVIARLO AL SERVICE
            // estado = +estado
            // if (!estado) {
            //     return res.json({ error: true, message: "Estado no definido" }) //VALIDAR SI EL ESTADO ES UN VALOR VALIDO
            // }
        }
        try {
            const usuario_service = new UsuarioService()
            const busqueda = await usuario_service.Cambiar_Estado_Usuario({ usuario: +id_usuario, estado: estado }) //INVOCAR FUNCION PARA CAMBIAR EL ESTADO DEL USUARIO
            if (busqueda?.error) { //VALIDAR SI HAY ALGUN ERROR
                return res.status(400).json(busqueda) //!ERROR
            }

            //ENVIAR INFORMACION DEPENDIENDO DEL ESTADO
            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el usuario' : 'Se ha desactivado el usuario' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el usuario' : 'Error al desactivar el usuario' }) //!ERROR

        }
    }

    public async Cambiar_Clave_Usuario(req: Request, res: Response) {
        const { id_usuario } = req.params //OBTENER EL ID DEL USUARIO ENVIADO POR PARAMETROS

        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(401).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //!ERROR
        }
        if (!id_usuario) { //VALIDAR SI SE ESTA ENVIANDO UN ID VALIDO
            return res.status(400).json({ error: true, message: "Usuario no definido" }) //!ERROR
        }

        try {
            const usuario_service = new UsuarioService()
            let clave = Generar_Llaves_Secretas()
            if (clave === '') {
                return res.status(400).json({ error: true, message: 'Error al generar clave' }) //!ERROR
            }
            const Usuario_Change = await usuario_service.Cambiar_Clave_Usuario(+id_usuario, clave, true)
            if (Usuario_Change.error) {
                return res.status(400).json({ error: true, message: 'Error al cambiar la contraseña del usuario' }) //!ERROR
            }

            //ENVIAR CORREO AL USUARIO PARA RESTABLECER LA CONTRASEÑA DEL USUARIO
            const info = await transporter.sendMail({
                from: '"SUMA" <mazomoises@gmail.com>', // sender address
                to: Usuario_Change.data_usuario?.correo, // list of receivers
                subject: "Recuperación de contraseña", // Subject line
                html: `
                        <div>
                            <p>Cordial saludo, ${Usuario_Change.data_usuario?.nombre}!</p>
                            <br />
                            <p>Atentamente nos permitimos comunicarle que sus datos para el ingreso al Sistema Unificado de Mejora y Autogestión - <b>SUMA</b> son:</p>
                            <p>Usuario: <strong>${Usuario_Change.data_usuario?.usuario}</strong></p>
                            <p>Nueva Clave: <strong>${Usuario_Change.data_usuario?.clave}</strong></p>
                            <br />
                            <p>En caso de no haber solicitado este cambio, ponganse en contacto con nuestro equipo de soporte.</p>
                            <p>Cordialmente,</p>
                            <br />
                            <img src="https://devitech.com.co/wp-content/uploads/2019/07/logo_completo.png" alt="Logo Empresa" />
                        </div>
                    `,
            });

            if (!info.accepted) {
                return res.status(500).json({ error: true, message: 'Error al restablecer la clave del usuario' }); //!ERROR
            }

            return res.status(200).json({ error: false, message: 'Se ha restablecido la clave del usuario' }); //*SUCCESS
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al cambiar la contraseña del usuario' }) //!ERROR
        }
    }

    public async Resetear_Clave_Usuario(req: Request, res: Response) {
        const { id_usuario } = req.params //OBTENER EL ID DEL USUARIO ENVIADO POR PARAMETROS
        const { clave } = req.body //OBTENER LA NUEVA CLAVE DEL USUARIO

        if (!req.usuario?.id_usuario) { //VALIDAR SI EL USUARIO ESTA LOGUEADO
            return res.status(401).json({ error: true, message: "Debe inicar sesión para realizar esta acción" }) //!ERROR
        }
        if (!id_usuario) { //VALIDAR SI SE ESTA ENVIANDO UN ID VALIDO
            return res.status(400).json({ error: true, message: "Usuario no definido" }) //!ERROR
        }
        if (clave === '') {
            return res.status(400).json({ error: true, message: "No se ha definido la clave" }) //!ERROR
        }

        try {
            const usuario_service = new UsuarioService()
            const Usuario_Change = await usuario_service.Cambiar_Clave_Usuario(+id_usuario, clave, false)
            if (Usuario_Change.error) {
                return res.status(400).json({ error: true, message: 'Error al cambiar la contraseña del usuario' }) //!ERROR
            }

            return res.status(200).json({ error: false, message: 'Se ha restablecido la clave del usuario' }); //!ERROR
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al cambiar la contraseña del usuario' }) //!ERROR
        }
    }
}