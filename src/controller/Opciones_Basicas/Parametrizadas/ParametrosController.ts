import { Request, Response } from "express";
import { ParametrosService } from "../../../services/Opciones_Basicas/Parametrizadas/Parametros.Service";

export default class ParametrosController {

    public async Obtener_Tipos_Documento(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        try {
            const unidades_medidas_service = new ParametrosService()
            const respuesta = await unidades_medidas_service.Obtener_Tipos_Documento()
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los tipos de documento' }) //!ERROR
        }
    }

    public async Obtener_Formas_Pago(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        try {
            const unidades_medidas_service = new ParametrosService()
            const respuesta = await unidades_medidas_service.Obtener_Formas_Pago()
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las formas de pago' }) //!ERROR
        }
    }
}