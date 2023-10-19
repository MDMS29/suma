import { Request, Response } from "express";
import { RolService } from "../services/Rol.service";
import { EstadosTablas } from "../validations/utils";

export class _RolController {

    public async ObtenerRoles(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(404).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _RolService = new RolService()
            const respuesta = await _RolService.ObtenerRoles(+estado)
            if (respuesta?.error) {
                return res.status(404).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los roles' }) //!ERROR
        }
    }

    public async InsertarRol(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { nombre, descripcion } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!nombre) {
            return res.status(404).json({ error: true, message: 'Debe ingresar un nombre al rol' }) //!ERROR
        }
        if (!descripcion) {
            return res.status(404).json({ error: true, message: 'Debe ingresar una descripcion al rol' }) //!ERROR
        }

        try {
            const _RolService = new RolService()
            const respuesta = await _RolService.InsertarRol(nombre, descripcion, usuario?.usuario)

            if (respuesta?.error) {
                return res.status(404).json(respuesta)
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el reol' }) //!ERROR
        }
    }

    public async BuscarRol(req: Request, res: Response) {
        const { id_rol } = req.params
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_rol) {
            return res.json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        try {
            const _RolService = new RolService()

            const respuesta = await _RolService.BuscarRol(+id_rol)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el rol' }) //!ERROR
        }
    }

    public async EditarRol(req: Request, res: Response) {
        const { usuario } = req
        const { id_rol } = req.params
        const { nombre, descripcion } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_rol) {
            return res.status(404).json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        if (!nombre) {
            return res.status(404).json({ error: true, message: 'Ingrese el nombre del rol' }) //!ERROR
        }
        if (!descripcion) {
            return res.status(404).json({ error: true, message: 'Ingrese al descripcion del rol' }) //!ERROR
        }

        // const result = PerfilesSchema.safeParse(req.body)
        // if (!result.success) {
        //     return res.status(404).json({ error: true, message: result.error.issues }) //!ERROR
        // }

        try {
            const _RolService = new RolService()

            const respuesta = await _RolService.EditarRol(+id_rol, nombre, descripcion, usuario.usuario)
            if (respuesta.error) {
                return res.status(404).json({ error: respuesta.error, message: respuesta.message })
            }

            return res.status(200).json({ error: false, message: 'Rol editado correctamente' }) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el rol' }) //!ERROR
        }
    }

    public async CambiarEstadoRol(req: Request, res: Response) {
        const { usuario } = req
        const { id_rol } = req.params
        const { estado } = req.query as { estado: string }
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_rol) {
            return res.json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _RolService = new RolService()
            const respuesta = await _RolService.CambiarEstadoRol(+id_rol, +estado)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el rol' : 'Se ha desactivado el rol' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el rol' : 'Error al desactivar el rol' }) //!ERROR
        }
    }

}