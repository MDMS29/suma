import { Request, Response } from "express";
import { ProductosEmpresaService } from "../../services/Opciones_Basicas/ProductosEmpresa.Service";
import { ProductosSchema } from "../../validations/OpcionesBasicas.Zod";
import { EstadosTablas, _Foto_Default } from "../../helpers/constants";
import {BaseController} from "../base.controller";

export default class ProductosEmpresaController extends BaseController<ProductosEmpresaService>{

    constructor() {
        super(ProductosEmpresaService);
    }

    public async Obtener_Productos_Empresa(req: Request, res: Response) {
        const { usuario } = req
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
            const respuesta = await this.service.Obtener_Productos_Empresa(+estado, +empresa)
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
        const { usuario } = req

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if(!req.body.foto){
            req.body.foto = _Foto_Default
        }

        const result: any = ProductosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const respuesta = await this.service.Insertar_Producto_Empresa(req.body, usuario)
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
            return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_producto) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el producto' }) //!ERROR
        }

        try {
            if (tipo) {
                const respuesta = await this.service.Buscar_Producto_Filtro('tipo_producto', +tipo, usuario.id_empresa)
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }) //!ERROR
                }
                return res.json(respuesta) //*SUCCESSFUL

            } else {

                const respuesta = await this.service.Buscar_Producto_Empresa(+id_producto)
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
        const { usuario } = req
        const { id_producto } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        if(!req.body.foto){
            req.body.foto = _Foto_Default
        }

        const result: any = ProductosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {

            const respuesta = await this.service.Editar_Producto_Empresa(+id_producto, req.body, usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await this.service.Buscar_Producto_Empresa(+id_producto)
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
        const { usuario } = req
        const { id_producto } = req.params
        const { estado, info } = req.query as {estado: string, info:string}

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_producto) {
            return res.status(400).json({ error: true, message: 'No se ha definido el producto' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }) //!ERROR
        }

        try {
            const producto = await this.service.Cambiar_Estado_Producto(+id_producto, +estado, JSON.parse(info), usuario.usuario)
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