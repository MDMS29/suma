import { Request, Response } from "express";
import { OrdenesService } from "../../services/Compras/Ordenes.Service";
import { FiltroOrdenesSchema, OrdenesSchema } from "../../validations/Compras.Zod";

export default class _OrdenesController {


    public async Obtener_Ordenes_Filtro(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado, empresa } = req.query as { estado: string, empresa: string, requisicion: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        // VALIDACION DE DATOS
        const result = FiltroOrdenesSchema.partial().safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Obtener_Ordenes_Filtro(estado, +empresa, usuario.id_usuario, req.body)

            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las requisiciones' }) //!ERROR
        }
    }

    async Obtener_Ordenes(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO

        const { empresa, estado, inputs } = req.query as { empresa: string, estado: string, inputs: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!empresa || empresa === 'undefined') {
            return res.status(401).json({ error: true, message: 'No hay una empresa definida' }) //!ERROR
        }

        if (!estado) {
            return res.status(401).json({ error: true, message: 'No se ha definido el estado a filtrar' }) //!ERROR
        }

        try {
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Obtener_Ordenes(empresa, estado, inputs)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
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
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Insertar_Orden(result.data, usuario.id_usuario)
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
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Buscar_Orden(+id_orden, usuario.id_empresa)
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
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Editar_Orden(result.data, +id_orden)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al editar la orden ${req.body.orden}` }) //!ERROR
        }
    }

    async Aprobar_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden_aprobar } = req.params as { id_orden_aprobar: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        try {
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Aprobar_Orden(+id_orden_aprobar, usuario?.id_empresa, usuario.id_usuario ?? 0)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al aprobar la orden ${req.body.orden}` }) //!ERROR
        }
    }

    async Eliminar_Restaurar_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden } = req.params
        const { estado } = req.query


        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se hay un estado a cambiar' }) //!ERROR
        }
        if (!id_orden) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la orden a cambiar' }) //!ERROR
        }

        try {
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Eliminar_Restaurar_Orden(+id_orden, +estado)
            if (!respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al cambiar el estado de la orden` }) //!ERROR
        }
    }

    async Generar_Documento_Orden(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden } = req.params as { id_orden: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_orden) {
            return res.status(401).json({ error: true, message: 'No existe esta orden' }) //!ERROR
        }

        try {
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Generar_Documento_Orden(+id_orden, usuario.id_empresa)
            if (respuesta && 'error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=orden_generada.pdf`);
            return res.send(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al buscar la orden' }) //!ERROR
        }
    }

    async Enviar_Correo_Aprobacion_Proveedor(req: Request, res: Response) {
        const { usuario } = req
        const { id_orden } = req.params as { id_orden: string }
        const { empresa } = req.query

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_orden) {
            return res.status(401).json({ error: true, message: 'No existe esta orden' }) //!ERROR
        }
        if (!empresa) {
            return res.status(401).json({ error: true, message: 'No hay empresa a buscar' }) //!ERROR
        }

        try {
            const ordenes_service = new OrdenesService()
            const respuesta = await ordenes_service.Enviar_Correo_Aprobacion_Proveedor(+id_orden, +empresa)
            if (respuesta && respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).send(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al buscar la orden' }) //!ERROR
        }
    }
}