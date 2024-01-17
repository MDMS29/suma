import { Request, Response } from "express";
import { TiposMoviemientosSchema } from "../../validations/OpcionesBasicas.Zod";
import { BaseController } from "../base.controller";
import { TiposMovimientosService } from "../../services/Opciones_Basicas/TiposMovimientos.Service";

export default class TipoMovimientosController extends BaseController<TiposMovimientosService>{

    constructor() {
        super(TiposMovimientosService);
    }

    public async Obtener_Tipos_Movimientos(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { empresa } = req.query //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!empresa || empresa == 'undefined') {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }

        try {
            const respuesta = await this.service.Obtener_Tipos_Movimientos(+empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los tipos de movimientos' }) //!ERROR
        }
    }

    public async Insertar_Tipo_Movimiento(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_empresa } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }) //!ERROR
        }

        const result = TiposMoviemientosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const respuesta = await this.service.Insertar_Tipo_Movimiento(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.status(400).json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el tipo de movimiento' }) //!ERROR
        }
    }

    public async Buscar_Tipo_Movimiento(req: Request, res: Response) {
        const { usuario } = req
        const { id_tipo_mov } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_tipo_mov) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el tipo de movimiento' }) //!ERROR
        }
        try {
            const respuesta = await this.service.Buscar_Tipo_Movimiento_ID(+id_tipo_mov)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el tipo de movimiento' }) //!ERROR
        }
    }

    public async Editar_Tipo_Movimiento(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_tipo_mov } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result = TiposMoviemientosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {

            const respuesta = await this.service.Editar_Tipo_Movimiento(+id_tipo_mov, req.body, usuario.usuario)
            if ('error' in  respuesta) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await this.service.Buscar_Tipo_Movimiento_ID(+id_tipo_mov)
            if (response.error) {
                return res.status(400).json(response) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el tipo de producto' }) //!ERROR
        }
    }
}