import { Request, Response } from "express";
import { HistorialService } from "../../services/Auditoria/Auditoria.service";
import { FiltroLogsAuditoriaSchema } from "../../validations/Auditoria.Zod";

export default class _HistorialController {

    public async Obtener_Logs_Auditoria(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO
    
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        try {
            const historial_service = new HistorialService()
            const respuesta = await historial_service.Obtener_Logs_Auditoria()
            if(respuesta.error){
                return res.status(500).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los logs de auditoria' }) //!ERROR
        }
    }

    public async Obtener_Logs_Auditoria_Filtro(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO
    
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result: any = FiltroLogsAuditoriaSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const historial_service = new HistorialService()
            const respuesta:any = await historial_service.Obtener_Logs_Auditoria_Filtro(req.body)
            if(respuesta?.error){
                return res.status(500).json({ error: respuesta.error, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los logs de auditoria' }) //!ERROR
        }
    }


}