import { Request, Response } from "express";
import { ParametrosService } from "../../../services/Opciones_Basicas/Parametrizadas/Parametros.Service";
import { IvaSchema } from "../../../validations/OpcionesBasicas.Zod";

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

    public async Obtener_Ivas(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        const { empresa } = req.query as { empresa: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!empresa) {
            return res.status(401).json({ error: true, message: 'No hay una empresa definida' }) //!ERROR
        }

        try {
            const unidades_medidas_service = new ParametrosService()
            const respuesta = await unidades_medidas_service.Obtener_Ivas(empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los ivas' }) //!ERROR
        }
    }

    public async Insertar_Iva(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result = IvaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const unidades_medidas_service = new ParametrosService()
            const respuesta = await unidades_medidas_service.Insertar_Iva(req.body, usuario.usuario)
            if ('error' in respuesta) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al insertar el iva' }) //!ERROR
        }
    }

    public async Buscar_Iva(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        const { iva_id } = req.params as { iva_id: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!iva_id) {
            return res.status(401).json({ error: true, message: 'No hay un iva definido' }) //!ERROR
        }

        try {
            const unidades_medidas_service = new ParametrosService()
            const respuesta = await unidades_medidas_service.Buscar_Iva(iva_id)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los ivas' }) //!ERROR
        }
    }

    public async Editar_Iva(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { iva_id } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result = IvaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const unidades_medidas_service = new ParametrosService()
            const respuesta = await unidades_medidas_service.Editar_Iva(+iva_id, req.body, usuario.usuario)
            if ('error' in respuesta) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al insertar el iva' }) //!ERROR
        }
    }
}