import { Request, Response } from "express";
import { TiposProductoService } from "../../services/Opciones_Basicas/TipoProducto.Service";

export default class TipoProductoController {

    public async Obtener_Tipos_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { empresa } = req.query as { estado: string, empresa: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }


        try {
            const tipos_producto_service = new TiposProductoService()
            const respuesta = await tipos_producto_service.Obtener_Tipos_Producto(+empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los tipos de producto' }) //!ERROR
        }
    }

    public async Insertar_Tipo_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_modulo } = req.params
        const { id_empresa, descripcion } = req.body
        
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }) //!ERROR
        }
        if (!descripcion) {
            return res.status(400).json({ error: true, message: 'Debe asignarle una descripcion al tipo de producto' }) //!ERROR
        }


        try {
            const tipos_producto_service = new TiposProductoService()
            const respuesta = await tipos_producto_service.Insertar_Tipo_Producto(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el tipo de producto' }) //!ERROR
        }
    }

    public async Buscar_Tipo_Producto(req: Request, res: Response) {
        const { usuario } = req
        const { id_tipo_producto } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_tipo_producto) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el tipo de producto' }) //!ERROR
        }
        try {
            const tipos_producto_service = new TiposProductoService()
            const respuesta = await tipos_producto_service.Buscar_Tipo_Producto(+id_tipo_producto)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la unidad de medida' }) //!ERROR
        }
    }

    public async Editar_Tipo_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_tipo_producto } = req.params
        const { id_empresa, descripcion } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }) //!ERROR
        }
        if (!descripcion) {
            return res.status(400).json({ error: true, message: 'Debe asignarle una descripcion al tipo de producto' }) //!ERROR
        }

        try {
            const tipos_producto_service = new TiposProductoService()

            const respuesta = await tipos_producto_service.Editar_Tipo_Producto(+id_tipo_producto, req.body)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await tipos_producto_service.Buscar_Tipo_Producto(+id_tipo_producto)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar el tipo de producto' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el tipo de producto' }) //!ERROR
        }
    }
}