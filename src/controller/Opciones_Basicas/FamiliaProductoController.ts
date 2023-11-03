import { Request, Response } from "express";
import { FamiliaProductoService } from "../../services/Opciones_Basicas/FamiliaProducto.Service";
import { EstadosTablas } from "../../utils";
import { FamiliaProductoSchema } from "../../validations/Validaciones.Zod";

export default class FamiliaProductoController {

    public async Obtener_Familias_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado, empresa } = req.query as { estado: string, empresa: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
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
            const familias_producto_service = new FamiliaProductoService()
            const respuesta = await familias_producto_service.Obtener_Familias_Producto(+estado, +empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las familias de los productos' }) //!ERROR
        }
    }

    public async Insertar_Familia_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_familia_producto } = req.params
        const { id_empresa, referencia, descripcion } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!referencia) {
            return res.status(400).json({ error: true, message: 'Debe ingresar una referencia para la familia' }) //!ERROR
        }
        if (!descripcion) {
            return res.status(400).json({ error: true, message: 'Debe ingresar una descripcion para la familia' }) //!ERROR
        }

        const result = FamiliaProductoSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const familias_producto_service = new FamiliaProductoService()
            const respuesta = await familias_producto_service.Insertar_Familia_Producto(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear la marca' }) //!ERROR
        }
    }

    public async Buscar_Familia_Producto(req: Request, res: Response) {
        const { usuario } = req
        const { id_familia_producto } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_familia_producto) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la familia' }) //!ERROR
        }
        try {
            const familias_producto_service = new FamiliaProductoService()
            const respuesta = await familias_producto_service.Buscar_Familia_Producto(+id_familia_producto)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la familia' }) //!ERROR
        }
    }

    public async Editar_Familia_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_familia_producto } = req.params
        const { id_empresa, referencia, descripcion } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!id_familia_producto) {
            return res.status(400).json({ error: true, message: 'No se ha definido la familia' }) //!ERROR
        }
        if (!referencia) {
            return res.status(400).json({ error: true, message: 'Debe ingresar una referencia para la familia' }) //!ERROR
        }
        if (!descripcion) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para la familia' }) //!ERROR
        }

        const result = FamiliaProductoSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const familia_producto_service = new FamiliaProductoService()

            const respuesta = await familia_producto_service.Editar_Familia_Producto(+id_familia_producto, req.body)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await familia_producto_service.Buscar_Familia_Producto(+id_familia_producto)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar la familia' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la familia' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Familia(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_familia_producto } = req.params
        const { estado } = req.query

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_familia_producto) {
            return res.status(400).json({ error: true, message: 'No se ha definido la familia' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }) //!ERROR
        }

        try {
            const familia_producto_service = new FamiliaProductoService()
            const familia_estado = await familia_producto_service.Cambiar_Estado_Familia(+id_familia_producto, +estado)
            if (familia_estado.error) {
                return res.status(400).json({ error: true, message: familia_estado.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado la familia' : 'Se ha desactivado la familia' })
        } catch (error) {
            console.log(error)
            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Error al activar la familia' : 'Error al desactivar la familia' }) //!ERROR
        }
    }
}