import { Request, Response } from "express";
import { PerfilService } from "../services/Service.Perfil";

export class _PerfilController {

    public async ObtenerPerfiles(req: Request, res: Response) {

        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //ERROR
        }

        try {
            const _PerfilService = new PerfilService()
            const respuesta = await _PerfilService.ObtenerPerfiles(+estado)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al obtener los perfiles' }) //ERROR
        }
    }

    public async ObtenerModulosPerfiles(req: Request, res: Response) {
        const { perfiles } = req.body
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //ERROR
        }
        if (!perfiles || perfiles.length <= 0 || !perfiles[0].id_perfil) {
            return res.json({ error: true, message: 'Debe asignar perfiles' }) //ERROR
        }

        try {
            const Perfil_Service = new PerfilService();
            //OBTENER LOS MODULOS DE LOS PERFILES
            const respuesta = await Perfil_Service.ObtenerModulosPerfil(perfiles)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //ERROR
            }

            //OBTENER LOS PERMISOS DE LOS MODULOS

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al cargar los modulos del perfil' }) //ERROR
        }

    }

    public async InsertarPerfil(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { nombre_perfil, modulos } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //ERROR
        }
        if (!nombre_perfil) {
            return res.json({ error: true, message: 'Debe ingresar un nombre al perfil' }) //ERROR
        }
        if (modulos.length <= 0) {
            return res.json({ error: true, message: 'El perfil debe tener al menos un modulo' }) //ERROR
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
            return res.json({ error: true, message: 'Error al crear el perfil' }) //ERROR
        }
    }
}