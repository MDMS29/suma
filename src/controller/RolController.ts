import { Request, Response } from "express";
import { RolService } from "../services/Rol.service";

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
            return res.status(500).json({ error: true, message: 'Error al crear el perfil' }) //!ERROR
        }
    }
}