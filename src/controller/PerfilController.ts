import { Request, Response } from "express";
import { PerfilService } from "../services/Perfil.service";
import { PerfilesSchema } from "../validations/ValidacionesZod";
import { EstadosTablas } from "../validations/utils";

export class _PerfilController {

    public async Obtener_Perfiles(req: Request, res: Response) {

        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(404).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.Obtener_Perfiles(+estado)
            if (respuesta?.error) {
                return res.status(404).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los perfiles' }) //!ERROR
        }
    }

    public async Obtener_Modulos_Perfiles(req: Request, res: Response) {
        // const { perfiles } = req.body
        const { usuario } = req
        // const { perfiles } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!req.body || req.body.length <= 0) {
            return res.status(404).json({ error: true, message: 'Debe asignar perfiles' }) //!ERROR
        }

        try {
            const Perfil_Service = new PerfilService();
            //OBTENER LOS MODULOS DE LOS PERFILES
            const respuesta = await Perfil_Service.Obtener_Modulos_Perfil(req.body)
            if (respuesta?.error) {
                return res.status(404).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al cargar los modulos del perfil' }) //!ERROR
        }

    }

    public async Insertar_Perfil(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { nombre_perfil, modulos } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!nombre_perfil) {
            return res.status(404).json({ error: true, message: 'Debe ingresar un nombre al perfil' }) //!ERROR
        }
        if (modulos.length <= 0) {
            return res.status(404).json({ error: true, message: 'El perfil debe tener al menos un modulo' }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.Insertar_Perfil(nombre_perfil, usuario.usuario, modulos)

            if (respuesta?.error) {
                return res.status(404).json(respuesta)
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el perfil' }) //!ERROR
        }
    }

    public async Editar_Perfil(req: Request, res: Response) {
        const { usuario } = req
        const { id_perfil } = req.params
        const { nombre_perfil, modulos } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_perfil) {
            return res.status(404).json({ error: true, message: 'No se ha encontrado el perfil' }) //!ERROR
        }
        if (!nombre_perfil) {
            return res.status(404).json({ error: true, message: 'Ingrese el nombre del perfil' }) //!ERROR
        }
        if (modulos.length <= 0) {
            return res.status(404).json({ error: true, message: 'El perfil debe tener al menos un modulo' }) //!ERROR
        }

        const result = PerfilesSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(404).json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()

            const respuesta = await _PerfilService.Editar_Perfil(+id_perfil, nombre_perfil, usuario.usuario)
            if (respuesta.error) {
                return res.status(404).json({ error: respuesta.error, message: respuesta.message })
            }

            const modulosEditado = await _PerfilService.Editar_Modulos_Perfil(+id_perfil, modulos)
            if (modulosEditado.error) {
                return res.status(404).json({ error: modulosEditado.error, message: modulosEditado.message })
            }
            
            const perfil = await _PerfilService.Buscar_Perfil(+id_perfil)
            return res.status(200).json(perfil) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el perfil' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Perfil(req: Request, res: Response) {
        const { usuario } = req
        const { id_perfil } = req.params
        const { estado } = req.query as { estado: string }
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_perfil) {
            return res.json({ error: true, message: 'No se ha encontrado el perfil' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.Cambiar_Estado_Perfil(+id_perfil, +estado)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.json({ error: false, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el perfil' : 'Se ha desactivado el perfil' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el perfil' : 'Error al desactivar del perfil' }) //!ERROR
        }
    }

    public async Buscar_Perfil(req: Request, res: Response) {
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

            const respuesta = await _PerfilService.Buscar_Perfil(+id_perfil)
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