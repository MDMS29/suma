import { Request, Response } from "express";
import { EstadosTablas } from "../../helpers/constants";
import { TercerosSchema } from "../../validations/Compras.Zod";
import { ProveedoresService } from "../../services/Compras/Proveedores.Service";

export default class ProveedoresController {
    public async Obtener_Proveedores(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado, empresa,  } = req.query as { estado: string, empresa: string, requisicion: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
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
            const requisiciones_service = new ProveedoresService()
            const respuesta = await requisiciones_service.Obtener_Proveedores(estado, empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las requisiciones' }) //!ERROR
        }
    }

    public async Insertar_Proveedor(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }

        // VALIDACION DE DATOS
        const result = TercerosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const proveedores_service = new ProveedoresService()
            const respuesta = await proveedores_service.Insertar_Proveedor(req.body, usuario?.id_usuario)
            if (respuesta?.error) {
                return res.status(400).json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: `Error al crear la requisicion ${req.body.consecutivo}` }) //!ERROR
        }
    }

    public async Buscar_Proveedor(req: Request, res: Response) {
        const { usuario } = req
        const { id_proveedor } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_proveedor) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el proveedor' }) //!ERROR
        }
        try {
            const proveedores_service = new ProveedoresService()
            const respuesta = await proveedores_service.Buscar_Proveedor(+id_proveedor)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la requisicion' }) //!ERROR
        }
    }

    public async Editar_Proveedor(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_proveedor } = req.params

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_proveedor) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado este proveedor' }) //!ERROR
        }

        // VALIDACION DE DATOS
        const result = TercerosSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const proveedores_service = new ProveedoresService()
            const respuesta = await proveedores_service.Editar_Proveedor(+id_proveedor, req.body)
            if (respuesta?.error) {
                return res.status(400).json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la familia' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Proveedor(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_proveedor } = req.params
        const { estado } = req.query

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }) //!ERROR
        }
        if (!id_proveedor) {
            return res.status(400).json({ error: true, message: 'No se ha definido el proveedor' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }) //!ERROR
        }

        try {
            const proveedor_request = new ProveedoresService()
            const proveedor_estado = await proveedor_request.Cambiar_Estado_Proveedor(+id_proveedor, +estado)
            if (proveedor_estado.error) {
                return res.status(400).json({ error: true, message: proveedor_estado.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: proveedor_estado.message })
        } catch (error) {
            console.log(error)
            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Error al restaurar el proveedor' : 'Error al inactivar el proveedor' }) //!ERROR
        }
    }

}