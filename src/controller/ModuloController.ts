import { Request, Response } from "express";
import ModuloService from "../services/Modulo.service";

export class _ModuloController {
    public async ObtenerModulos(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const respuesta = await _ModuloService.ObtenerModulos(+estado)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }
    public async InsertarModulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { nombre_modulo, icono } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (nombre_modulo == '') {
            return res.json({ error: true, message: 'Debe ingresar un nombre para el modulo' }) //!ERROR
        }
        if (icono == '') {
            return res.json({ error: true, message: 'Debe ingresar un icono para el modulo' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const respuesta = await _ModuloService.InsertarModulo(nombre_modulo, icono)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }
    public async BuscarModulo() {

    }
    public async EditarModulo() {

    }
    public async CambiarEstadoModulo() {

    }
}