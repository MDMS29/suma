import { Request, Response } from "express";
import { MarcaProductoService } from "../../services/Opciones_Basicas/MarcaProducto.Service";
import { MarcaSchema } from "../../validations/Validaciones.Zod";

export default class MarcasProductoController {

    public async Obtener_Marcas_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }


        try {
            const marcas_producto_service = new MarcaProductoService()
            const respuesta = await marcas_producto_service.Obtener_Marcas_Producto()
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las marcas' }) //!ERROR
        }
    }

    public async Insertar_Marca_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_modulo } = req.params
        const { marca } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!marca) {
            return res.status(400).json({ error: true, message: 'Debe asignarle un nombre a la marca' }) //!ERROR
        }

        const result = MarcaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const tipos_producto_service = new MarcaProductoService()
            const respuesta = await tipos_producto_service.Insertar_Marca_Producto(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear la marca' }) //!ERROR
        }
    }

    public async Buscar_Marca_Producto(req: Request, res: Response) {
        const { usuario } = req
        const { id_marca_producto } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_marca_producto) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la marca' }) //!ERROR
        }
        try {
            const marcas_producto_service = new MarcaProductoService()
            const respuesta = await marcas_producto_service.Buscar_Marca_Producto(+id_marca_producto)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la marca' }) //!ERROR
        }
    }

    public async Editar_Marca_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_marca_producto } = req.params
        const { marca } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if (!marca) {
            return res.status(400).json({ error: true, message: 'Debe ingresar el nombre de la marca' }) //!ERROR
        }

        const result = MarcaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const marcas_producto_service = new MarcaProductoService()

            const respuesta = await marcas_producto_service.Editar_Marca_Producto(+id_marca_producto, req.body)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await marcas_producto_service.Buscar_Marca_Producto(+id_marca_producto)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar la marca' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la marca' }) //!ERROR
        }
    }
}