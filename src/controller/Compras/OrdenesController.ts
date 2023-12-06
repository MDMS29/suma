import { Request, Response } from "express";
import { OrdenesService } from "../../services/Compras/Ordenes.Service";
import { OrdenesSchema } from "../../validations/Compras.Zod";

// import url from "url"

export default class _OrdenesController {


    async Obtener_Ordenes(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO

        const { tipo, empresa, estado } = req.query as { tipo: string, empresa: string, estado: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!tipo) {
            return res.status(401).json({ error: true, message: 'No hay un tipo de orden a buscar' }) //!ERROR
        }

        if (!empresa) {
            return res.status(401).json({ error: true, message: 'No hay una empresa definida' }) //!ERROR
        }

        if (!estado) {
            return res.status(401).json({ error: true, message: 'No se ha definido el estado a filtrar' }) //!ERROR
        }

        try {
            const historial_service = new OrdenesService()
            const respuesta = await historial_service.Obtener_Ordenes(tipo, empresa, estado)
            if (respuesta.error) {
                return res.status(500).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }


            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las ordenes' }) //!ERROR
        }
    }

    async Insertar_Orden(req: Request, res: Response) {
        const { usuario } = req

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result: any = OrdenesSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const historial_service = new OrdenesService()
            const respuesta = await historial_service.Insertar_Orden(result.data, usuario.id_usuario)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al insertar la orden' }) //!ERROR
        }
    }

    async Buscar_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden } = req.params as { id_orden: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_orden) {
            return res.status(401).json({ error: true, message: 'No existe esta orden' }) //!ERROR
        }

        try {
            const historial_service = new OrdenesService()
            const respuesta = await historial_service.Buscar_Orden(+id_orden, usuario.id_empresa)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al buscar la orden' }) //!ERROR
        }
    }

    async Editar_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden } = req.params as { id_orden: string }


        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result: any = OrdenesSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const historial_service = new OrdenesService()
            const respuesta = await historial_service.Editar_Orden(result.data, +id_orden)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al editar la orden ${req.body.orden}` }) //!ERROR
        }
    }

    async Eliminar_Restaurar_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden } = req.params
        const { id_estado } = req.query


        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_estado) {
            return res.status(400).json({ error: true, message: 'No se hay un estado a cambiar' }) //!ERROR
        }
        if (!id_orden) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la orden a cambiar' }) //!ERROR
        }

        try {
            const historial_service = new OrdenesService()
            const respuesta = await historial_service.Eliminar_Restaurar_Orden(+id_orden, +id_estado)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al cambiar el estado de la orden` }) //!ERROR
        }
    }

}