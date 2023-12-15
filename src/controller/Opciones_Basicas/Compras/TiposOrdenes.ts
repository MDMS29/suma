import { Request, Response } from "express"
import _TipoOrdenesService from "../../../services/Opciones_Basicas/Compras/TipoOrdenes.Service"
import { TipoOrdenSchema } from "../../../validations/OpcionesBasicas.Zod"

export default class TipoOrdenesController {
    
    async Obtener_Tipos_Ordenes(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO

        const { empresa } = req.query as { empresa: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No hay una empresa definida' }) //!ERROR
        }

        try {
            const ordenes_service = new _TipoOrdenesService()
            const respuesta = await ordenes_service.Obtener_Tipos_Ordenes(+empresa)
            if (respuesta.error) {
                return res.status(500).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los tipos de orden' }) //!ERROR
        }
    }

    async Insertar_Tipo_Orden(req: Request, res: Response) {
        const { usuario } = req

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result: any = TipoOrdenSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const ordenes_service = new _TipoOrdenesService()
            const respuesta = await ordenes_service.Insertar_Tipo_Orden(result.data)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al insertar el tipo de orden' }) //!ERROR
        }
    }

    async Buscar_Tipo_Orden(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO

        const { id_tipo_orden } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!id_tipo_orden) {
            return res.status(400).json({ error: true, message: 'No hay un tipo de orden definido' }) //!ERROR
        }

        try {
            const ordenes_service = new _TipoOrdenesService()
            const respuesta = await ordenes_service.Buscar_Tipo_Orden(+id_tipo_orden)
            if (respuesta.error) {
                return res.status(500).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los tipos de orden' }) //!ERROR
        }
    }

    async Editar_Tipo_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_tipo_orden } = req.params


        console.log('---  REQBODY  --- \n', req.body, '---  fin REQBODY  --- \n')

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!id_tipo_orden) {
            return res.status(400).json({ error: true, message: 'No hay un tipo de orden definido' }) //!ERROR
        }

        const result: any = TipoOrdenSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const ordenes_service = new _TipoOrdenesService()
            const respuesta = await ordenes_service.Editar_Tipo_Orden(result.data, +id_tipo_orden)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el tipo de orden' }) //!ERROR
        }
    }
}