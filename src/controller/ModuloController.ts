import { Request, Response } from "express";
import ModuloService from "../services/Modulo.service";
import { MessageError } from "../validations/Types";
import { ModulosSchema } from "../validations/ValidacionesZod";

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
        const { cod_modulo, nombre_modulo, icono } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!nombre_modulo) {
            return res.json({ error: true, message: 'Debe ingresar un nombre para el modulo' }) //!ERROR
        }
        if (!cod_modulo) {
            return res.json({ error: true, message: 'Debe ingresar un codigo para el modulo' }) //!ERROR
        }
        if (!icono) {
            return res.json({ error: true, message: 'Debe ingresar un icono para el modulo' }) //!ERROR
        }

        const result = ModulosSchema.safeParse(req.body)
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const respuesta = await _ModuloService.InsertarModulo(cod_modulo, nombre_modulo, icono, usuario?.usuario)
            if (respuesta?.error) {
                return res.json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }

    public async BuscarModulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo || !+id_modulo) {
            return res.json({ error: true, message: 'No se ha definido el modulo' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const modulo: MessageError | any = await _ModuloService.BuscarModulo(+id_modulo)
            if (modulo?.error) {
                return res.json({ error: true, message: modulo.message }) //!ERROR
            }

            return res.json(modulo)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el modulo' }) //!ERROR
        }
    }

    public async EditarModulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params
        const { cod_modulo, nombre_modulo, icono } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.json({ error: true, message: 'No se ha encontrado el modulo' }) //!ERROR
        }
        if (!cod_modulo) {
            return res.json({ error: true, message: 'No se ha definido el codigo del modulo' }) //!ERROR
        }
        if (!nombre_modulo) {
            return res.json({ error: true, message: 'No se ha definido el nombre del modulo' }) //!ERROR
        }
        if (!icono) {
            return res.json({ error: true, message: 'No se ha definido el icono del modulo' }) //!ERROR
        }

        //VALIDACIONES CON LIBRERIA ZOD
        const result = ModulosSchema.safeParse(req.body)
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const modulo = await _ModuloService.EditarModulo(+id_modulo, req.body, usuario.usuario)

            if (modulo?.error) {
                return res.json({ error: true, message: 'Error al editar el modulo' }) //!ERROR
            }

            const moduloEditado = await _ModuloService.BuscarModulo(+id_modulo)
            if (moduloEditado.error) {
                return res.json({ error: true, message: 'No se ha podido encontrar el modulo' }) //!ERROR             
            }
            return res.json(moduloEditado) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al editar el modulo' }) //!ERROR             
        }
    }
    public async CambiarEstadoModulo() {

    }
}