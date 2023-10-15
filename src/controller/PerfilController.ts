import { Request, Response } from "express";
import { PerfilService } from "../services/Perfil.service";
import { PerfilesSchema } from "../validations/ValidacionesZod";
import { EstadosTablas } from "../validations/utils";

export class _PerfilController {

    public async ObtenerPerfiles(req: Request, res: Response) {

        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.ObtenerPerfiles(+estado)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al obtener los perfiles' }) //!ERROR
        }
    }

    public async ObtenerModulosPerfiles(req: Request, res: Response) {
        // const { perfiles } = req.body
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!req.body || req.body.length <= 0) {
            return res.json({ error: true, message: 'Debe asignar perfiles' }) //!ERROR
        }

        try {
            const Perfil_Service = new PerfilService();
            //OBTENER LOS MODULOS DE LOS PERFILES
            const respuesta = await Perfil_Service.ObtenerModulosPerfil(req.body)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al cargar los modulos del perfil' }) //!ERROR
        }

    }

    public async InsertarPerfil(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { nombre_perfil, modulos } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!nombre_perfil) {
            return res.json({ error: true, message: 'Debe ingresar un nombre al perfil' }) //!ERROR
        }
        if (modulos.length <= 0) {
            return res.json({ error: true, message: 'El perfil debe tener al menos un modulo' }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.InsertarPerfil(nombre_perfil, usuario.usuario, modulos)

            if (respuesta?.error) {
                return res.json(respuesta)
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al crear el perfil' }) //!ERROR
        }
    }

    public async EditarPerfil(req: Request, res: Response) {
        const { usuario } = req
        const { id_perfil } = req.params
        const { nombre_perfil, modulos } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_perfil) {
            return res.json({ error: true, message: 'No se ha encontrado el perfil' }) //!ERROR
        }
        if (!nombre_perfil) {
            return res.json({ error: true, message: 'Ingrese el nombre del perfil' }) //!ERROR
        }
        if (modulos.length <= 0) {
            return res.json({ error: true, message: 'El perfil debe tener al menos un modulo' }) //!ERROR
        }

        const result = PerfilesSchema.safeParse(req.body)
        if (!result.success) {
            return res.json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()

            const respuesta = await _PerfilService.EditarPerfil(+id_perfil, nombre_perfil, usuario.usuario)
            if (respuesta.error) {
                return res.json({ error: respuesta.error, message: respuesta.message })
            }

            const modulosEditado = await _PerfilService.EditarModulosPerfil(+id_perfil, modulos)
            if (modulosEditado.error) {
                return res.json({ error: modulosEditado.error, message: modulosEditado.message })
            }
            return res.json({ error: false, message: 'Perfil editado correctamente' }) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al editar el perfil' }) //!ERROR
        }
    }

    public async CambiarEstadoPerfil(req: Request, res: Response) {
        const { usuario } = req
        const { id_perfil } = req.params
        const { estado } = req.query as { estado: string }
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_perfil) {
            return res.json({ error: true, message: 'No se ha encontrado el perfil' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.CambiarEstadoPerfil(+id_perfil, +estado)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el perfil' : 'Se ha desactivado el perfil' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el perfil' : 'Error al desactivar del perfil' }) //!ERROR
        }
    }

    public async BuscarPerfil(req: Request, res: Response) {
        const { id_perfil } = req.params
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_perfil) {
            return res.json({ error: true, message: 'No se ha encontrado el perfil' }) //!ERROR
        }
        try {
            const _PerfilService = new PerfilService()

            const respuesta = await _PerfilService.BuscarPerfil(+id_perfil)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el perfil' }) //!ERROR
        }
    }
}