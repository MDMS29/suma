import { Request, Response } from "express";
import { OrdenesService } from "../../services/Compras/Ordenes.Service";

// import url from "url"

export default class _OrdenesController {


    public async Obtener_Ordenes(req: Request, res: Response) {
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


}