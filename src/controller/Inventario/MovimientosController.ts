import { Request, Response } from "express";
import { EstadosTablas } from "../../helpers/constants";
import { BaseController } from "../base.controller";
import MovimientosAlmacenService from "../../services/Inventario/Movimientos.service";
import { MovimientosSchema } from "../../validations/Inventario.Zod";

export default class MovimientosAlmacenController extends BaseController<MovimientosAlmacenService>{

    constructor() {
        super(MovimientosAlmacenService);
    }

    public async Obtener_Movimiento_Almacen(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { empresa, estado } = req.query as { empresa: string, estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }) //!ERROR
        }

        try {
            const respuesta = await this.service.Obtener_Movimiento_Almacen(+empresa, +estado)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los movimientos de la empresa' }) //!ERROR
        }
    }

    public async Insertar_Movimiento(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        const result = MovimientosSchema.safeParse(req.body)
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const respuesta = await this.service.Insertar_Movimiento(req.body, usuario)
            if (respuesta?.error) {
                return res.json(respuesta)
            }

            return res.status(201).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el menu' }) //!ERROR
        }
    }

    public async Buscar_Movimiento(req: Request, res: Response) {
        const { id_movimiento } = req.params
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_movimiento) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el movimiento' }) //!ERROR
        }
        try {

            const respuesta = await this.service.Buscar_Movimiento(+id_movimiento)
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.status(200).json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la empresa' }) //!ERROR
        }
    }

    public async Editar_Movimiento(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_movimiento } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        try {
            const respuesta: any = await this.service.Editar_Movimiento(+id_movimiento, req.body, usuario.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await this.service.Buscar_Movimiento(+id_movimiento)
            if (!response) {
                return res.status(400).json({ error: true, message: response.message }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el movimiento' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Movimiento(req: Request, res: Response) {
        const { usuario } = req
        const { id_movimiento } = req.params
        const { estado, info } = req.query as { estado: string, info: string }
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_movimiento) {
            return res.json({ error: true, message: 'No se ha encontrado el movimiento' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }
        if (!info) {
            return res.json({ error: true, message: 'Error de informacion' });
        }

        try {
            const respuesta = await this.service.Cambiar_Estado_Empresa(+id_movimiento, +estado, JSON.parse(info), usuario.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado la empresa' : 'Se ha desactivado la empresa' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar la empresa' : 'Error al desactivar la empresa' }) //!ERROR
        }
    }

}