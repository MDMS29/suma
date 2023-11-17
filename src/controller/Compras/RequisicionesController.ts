import { Request, Response } from "express";
import { EstadosTablas } from "../../helpers/constants";
import { RequisicionesService } from "../../services/Compras/Requisiciones.Service";
import { RequisicionesSchema } from "../../validations/Requisiciones.Zod";

export default class RequisicionesController {

    public async Obtener_Requisiciones(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado, empresa, noRequi } = req.query as { estado: string, empresa: string, noRequi : string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const requisiciones_service = new RequisicionesService()
            if(noRequi !== undefined){
                const respuesta = await requisiciones_service.Obtener_Requisiciones(estado, +empresa, usuario.id_usuario, 'noRequi', noRequi)
                if (respuesta?.error) {
                    return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
                }
                
                return res.status(200).json(respuesta)
            }else{

                const respuesta = await requisiciones_service.Obtener_Requisiciones(estado, +empresa, usuario.id_usuario, '', '')
                if (respuesta?.error) {
                    return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
                }
                
                return res.status(200).json(respuesta)
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las requisiciones' }) //!ERROR
        }
    }

    public async Insertar_Requisicion(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        // VALIDACION DE DATOS
        const result = RequisicionesSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const familias_producto_service = new RequisicionesService()
            const respuesta = await familias_producto_service.Insertar_Requisicion(req.body, usuario?.id_usuario)
            if (respuesta?.error) {
                return res.status(400).json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al crear la requisicion ${req.body.consecutivo}` }) //!ERROR
        }
    }

    public async Buscar_Requisicion(req: Request, res: Response) {
        const { usuario } = req
        const { id_requisicion } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_requisicion) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la requisicion' }) //!ERROR
        }
        try {
            const requisiciones_service = new RequisicionesService()
            const respuesta = await requisiciones_service.Buscar_Requisicion(+id_requisicion)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la requisicion' }) //!ERROR
        }
    }

    public async Editar_Requisicion(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_requisicion } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if (!id_requisicion) {
            return res.status(404).json({ error: true, message: 'No se ha encontrado la requisicion' }) //!ERROR
        }

        // VALIDACION DE DATOS
        const result = RequisicionesSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const requisiciones_service = new RequisicionesService()
            const respuesta = await requisiciones_service.Editar_Requisicion(+id_requisicion, req.body, usuario?.id_usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await requisiciones_service.Buscar_Requisicion(+id_requisicion)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar la familia' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la familia' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Requisicion(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_requisicion } = req.params
        const { estado } = req.query

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_requisicion) {
            return res.status(400).json({ error: true, message: 'No se ha definido la requisicion' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }) //!ERROR
        }

        try {
            const requisiciones_service = new RequisicionesService()
            const familia_estado = await requisiciones_service.Cambiar_Estado_Requisicion(+id_requisicion, +estado)
            if (familia_estado.error) {
                return res.status(400).json({ error: true, message: familia_estado.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_PENDIENTE ? 'Se ha restaurado la requisicion' : 'Se ha inactivado la requisicion' })
        } catch (error) {
            console.log(error)
            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_PENDIENTE ? 'Error al restaurar la requisicion' : 'Error al inactivar la requisicion' }) //!ERROR
        }
    }

    public async Generar_PDF_Requisicion(req: Request, res: Response) {
        const { usuario } = req
        const { id_requisicion } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_requisicion) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la requisicion' }) //!ERROR
        }
        try {
            const requisiciones_service = new RequisicionesService()
            const pdf: any = await requisiciones_service.Generar_PDF_Requisicion(+id_requisicion)
            if (pdf.error) {
                return res.json({ error: true, message: pdf.message }) //!ERROR
            }

            // Configurar encabezados para el navegador
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename=Req_${pdf.nombre}.pdf`);
            return res.send(pdf.data)
        } catch (error) {
            console.log(error)
            return 
            // res.json({ error: true, message: 'Error al generar el documento' }) //!ERROR
        }
    }

    public async Aprobar_Desaprobar_Detalle(req: Request, res: Response) {
        const { usuario } = req
        const { id_requisicion } = req.params
        const { detalles } = req.body

        console.log(req.body)

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_requisicion) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la requisicion' }) //!ERROR
        }
        if (detalles.length <= 0) {
            return res.status(400).json({ error: true, message: 'No hay detalles para calificar' }) //!ERROR
        }

        try {
            const requisiciones_service = new RequisicionesService()
            const respuesta: any = await requisiciones_service.Aprobar_Desaprobar_Detalle(+id_requisicion, detalles, usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.json(respuesta)
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error calificar los detalles de la requisicion' }) //!ERROR
        }
    }
}