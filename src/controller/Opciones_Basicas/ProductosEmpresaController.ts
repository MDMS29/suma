import { Request, Response } from "express";
import { ProductosEmpresaService } from "../../services/Opciones_Basicas/ProductosEmpresa.Service";
import { ProductosSchema } from "../../validations/Zod/OpcionesBasicas.Zod";
import { EstadosTablas, _Foto_Default } from "../../helpers/constants";

export default class ProductosEmpresaController {

    public async Obtener_Productos_Empresa(req: Request, res: Response) {
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
            const producto_empresa_service = new ProductosEmpresaService()
            const respuesta = await producto_empresa_service.Obtener_Productos_Empresa(+estado, +empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los productos de la empresa' }) //!ERROR
        }
    }

    public async Insertar_Producto_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if(!req.body.foto){
            req.body.foto = _Foto_Default
        }

        const result: any = ProductosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const producto_empresa_service = new ProductosEmpresaService()
            const respuesta = await producto_empresa_service.Insertar_Producto_Empresa(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear la marca' }) //!ERROR
        }
    }

    public async Buscar_Producto_Empresa(req: Request, res: Response) {
        const { usuario } = req
        const { id_producto } = req.params
        const { tipo } = req.query
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_producto) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el producto' }) //!ERROR
        }

        try {
            const producto_empresa_service = new ProductosEmpresaService()
            if (tipo) {
                const respuesta = await producto_empresa_service.Buscar_Producto_Filtro('tipo_producto', +tipo)
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }) //!ERROR
                }
                return res.json(respuesta) //*SUCCESSFUL

            } else {

                const respuesta = await producto_empresa_service.Buscar_Producto_Empresa(+id_producto)
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }) //!ERROR
                }
                return res.json(respuesta) //*SUCCESSFUL
            }
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el producto' }) //!ERROR
        }
    }

    public async Editar_Producto_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        console.log(req.body)
        const { id_producto } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if(!req.body.foto){
            req.body.foto = _Foto_Default
        }

        const result: any = ProductosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const producto_empresa_service = new ProductosEmpresaService()

            const respuesta = await producto_empresa_service.Editar_Producto_Empresa(+id_producto, result.data, usuario?.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await producto_empresa_service.Buscar_Producto_Empresa(+id_producto)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar el producto' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el producto' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Producto(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_producto } = req.params
        const { estado } = req.query

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_producto) {
            return res.status(400).json({ error: true, message: 'No se ha definido el producto' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }) //!ERROR
        }

        try {
            const producto_empresa_service = new ProductosEmpresaService()
            const producto = await producto_empresa_service.Cambiar_Estado_Producto(+id_producto, +estado)
            if (producto.error) {
                return res.status(400).json({ error: true, message: producto.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el producto' : 'Se ha desactivado el producto' })
        } catch (error) {
            console.log(error)
            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el producto' : 'Error al desactivar el producto' }) //!ERROR
        }
    }
}