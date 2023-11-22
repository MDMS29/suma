import { Request, Response } from "express";
import { RolService } from "../../services/Configuracion/Rol.service";
import { EstadosTablas } from "../../helpers/constants";
import { RolesSchema } from "../../validations/Configuracion.Zod";

export class _RolController {

    public async Obtener_Roles(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(404).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _RolService = new RolService()
            const respuesta = await _RolService.Obtener_Roles(+estado)
            if (respuesta?.error) {
                return res.status(404).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los roles' }) //!ERROR
        }
    }

    public async Insertar_Rol(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { nombre, descripcion } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!nombre || nombre === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre al rol' }) //!ERROR
        }
        if (!descripcion || descripcion === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar una descripción al rol' }) //!ERROR
        }

        const zod_validacion = RolesSchema.safeParse(req.body)
        if (!zod_validacion.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: zod_validacion.error.issues[0].message }) //!ERROR
        }

        try {
            const _RolService = new RolService()
            const respuesta = await _RolService.Insertar_Rol(nombre, descripcion, usuario?.usuario) 
            if (respuesta?.error) {
                return res.json(respuesta)
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el rol' }) //!ERROR
        }
    }

    public async Buscar_Rol(req: Request, res: Response) {
        const { id_rol } = req.params
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_rol) {
            return res.json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        try {
            const _RolService = new RolService()

            const respuesta = await _RolService.Buscar_Rol(+id_rol)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el rol' }) //!ERROR
        }
    }

    public async Editar_Rol(req: Request, res: Response) {
        const { usuario } = req
        const { id_rol } = req.params
        const { nombre, descripcion } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_rol) {
            return res.status(404).json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        if (!nombre || nombre === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre al rol' }) //!ERROR
        }
        if (!descripcion || descripcion === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar una descripcion al rol' }) //!ERROR
        }

        const zod_validacion = RolesSchema.safeParse(req.body)
        if (!zod_validacion.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: zod_validacion.error.issues[0].message }) //!ERROR
        }


        try {
            const _RolService = new RolService()

            const respuesta = await _RolService.Editar_Rol(+id_rol, nombre, descripcion, usuario.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await _RolService.Buscar_Rol(+id_rol)
            if (!response) {
                return res.status(400).json({ error: true, message: response.message }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el rol' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Rol(req: Request, res: Response) {
        const { usuario } = req
        const { id_rol } = req.params
        const { estado } = req.query as { estado: string }
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_rol) {
            return res.json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _RolService = new RolService()
            const respuesta = await _RolService.Cambiar_Estado_Rol(+id_rol, +estado)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.json({ error: false, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el rol' : 'Se ha desactivado el rol' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el rol' : 'Error al desactivar el rol' }) //!ERROR
        }
    }

}