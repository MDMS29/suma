import { Request, Response } from "express";
import { UnidadesMedidaService } from "../../services/Opciones_Basicas/UnidadesMedida.Service"
import { UnidadMedidaSchema } from "../../validations/OpcionesBasicas.Zod";

export default class UnidadesMedidaController {

    public async Obtener_Unidades_Medida(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado, empresa } = req.query as { estado: string, empresa: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const unidades_medidas_service = new UnidadesMedidaService()
            const respuesta = await unidades_medidas_service.Obtener_Unidades_Medida(+estado, +empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las unidades de medida' }) //!ERROR
        }
    }

    public async Insertar_Unidad_Medida(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_modulo } = req.params
        const { id_empresa, unidad } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }) //!ERROR
        }
        if (!unidad) {
            return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }) //!ERROR
        }

        const result = UnidadMedidaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const menu_service = new UnidadesMedidaService()
            const respuesta = await menu_service.Insertar_Unidad_Medida(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta)
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el menu' }) //!ERROR
        }
    }

    public async Buscar_Unidad_Medida(req: Request, res: Response) {
        const { usuario } = req
        const { id_unidad } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_unidad) {
            return res.json({ error: true, message: 'No se ha encontrado la unidad de medida' }) //!ERROR
        }
        try {
            const menu_service = new UnidadesMedidaService()

            const respuesta = await menu_service.Buscar_Unidad_Medida(+id_unidad)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la unidad de medida' }) //!ERROR
        }
    }

    public async Editar_Unidad_Medida(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_unidad } = req.params
        const { id_empresa, unidad } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }) //!ERROR
        }
        if (!unidad) {
            return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }) //!ERROR
        }

        const result = UnidadMedidaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const menu_service = new UnidadesMedidaService()

            const respuesta = await menu_service.Editar_Unidad_Medida(+id_unidad, req.body, usuario.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await menu_service.Buscar_Unidad_Medida(+id_unidad)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar la unidad de medida' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la unidad de medida' }) //!ERROR
        }
    }
}