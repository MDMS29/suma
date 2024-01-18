import { Request, Response } from "express";
import { BodegaSchema } from "../../validations/OpcionesBasicas.Zod";
import { BaseController } from "../base.controller";
import { BodegasService } from "../../services/Opciones_Basicas/Bodegas.Service";
import { EstadosTablas } from "../../helpers/constants";

export default class BodegasController extends BaseController<BodegasService>{

    constructor() {
        super(BodegasService);
    }

    public async Obtener_Bodegas(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { empresa, estado } = req.query //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!empresa || empresa == 'undefined') {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }
        if (!estado || estado == 'undefined') {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado a consultar' }) //!ERROR
        }

        try {
            const respuesta = await this.service.Obtener_Bodegas(+empresa, +estado)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las bodegas' }) //!ERROR
        }
    }

    public async Insertar_Bodega(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_empresa } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }) //!ERROR
        }

        const result = BodegaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const respuesta = await this.service.Insertar_Bodega(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.status(400).json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear la bodega' }) //!ERROR
        }
    }

    public async Buscar_Bodega(req: Request, res: Response) {
        const { usuario } = req
        const { id_bodega } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_bodega) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la bodega' }) //!ERROR
        }
        try {
            const respuesta = await this.service.Buscar_Bodega_Mov(+id_bodega)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la bodega' }) //!ERROR
        }
    }

    public async Editar_Bodega(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_bodega } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result = BodegaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const respuesta = await this.service.Editar_Bodega(+id_bodega, req.body, usuario.usuario)
            if ('error' in respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await this.service.Buscar_Bodega_ID(+id_bodega)
            if (response.error) {
                return res.status(400).json(response) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la bodega' }) //!ERROR
        }
    }

    public async Eliminar_Restaurar_Bodega(req: Request, res: Response) {
        const { usuario } = req
        const { id_bodega } = req.params
        const { estado, info } = req.query as { estado: string, info: string }

        if (!id_bodega) {
            return res.status(400).json({ error: true, message: 'No hay una bodega definida' })
        }

        try {
            const respuesta = await this.service.Eliminar_Restaurar_Bodega(+id_bodega, +estado, usuario.usuario, JSON.parse(info))
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message })
            }
            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al ${+estado == EstadosTablas.ESTADO_ACTIVO ? 'activar' : 'desactivar'} la bodega` })
        }


    }
}