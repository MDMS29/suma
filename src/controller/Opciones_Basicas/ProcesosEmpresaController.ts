import { Request, Response } from "express";
import { ProcesosEmpresaService } from "../../services/Opciones_Basicas/ProcesosEmpresa.Service";
import { ProcesoEmpresaSchema } from "../../validations/Zod/OpcionesBasicas.Zod";

export default class ProcesosEmpresaController {

    public async Obtener_Procesos_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { empresa } = req.query as { estado: string, empresa: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }

        try {
            const proceso_empresa_service = new ProcesosEmpresaService()
            const respuesta = await proceso_empresa_service.Obtener_Procesos_Empresa(+empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los procesos' }) //!ERROR
        }
    }

    public async Insertar_Procesos_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_familia_producto } = req.params
        const { id_empresa, codigo, proceso } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!codigo) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un codigo para el proceso' }) //!ERROR
        }
        if (!proceso) {
            return res.status(400).json({ error: true, message: 'Debe ingresar el nombre del proceso' }) //!ERROR
        }

        const result = ProcesoEmpresaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const proceso_empresa_service = new ProcesosEmpresaService()
            const respuesta = await proceso_empresa_service.Insertar_Procesos_Empresa(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el proceso' }) //!ERROR
        }
    }

    public async Buscar_Proceso_Empresa(req: Request, res: Response) {
        const { usuario } = req
        const { id_proceso } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_proceso) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el proceso' }) //!ERROR
        }
        try {
            const proceso_empresa_service = new ProcesosEmpresaService()
            const respuesta = await proceso_empresa_service.Buscar_Proceso_Empresa(+id_proceso)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el proceso' }) //!ERROR
        }
    }

    public async Editar_Proceso_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_proceso } = req.params
        const { id_empresa, codigo, proceso } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!id_proceso) {
            return res.status(400).json({ error: true, message: 'No se ha definido el proceso' }) //!ERROR
        }
        if (!codigo) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un codigo para el proceso' }) //!ERROR
        }
        if (!proceso) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el proceso' }) //!ERROR
        }

        const result = ProcesoEmpresaSchema.safeParse(req.body) //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const proceso_empresa_service = new ProcesosEmpresaService()

            const respuesta = await proceso_empresa_service.Editar_Proceso_Empresa(+id_proceso, req.body)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await proceso_empresa_service.Buscar_Proceso_Empresa(+id_proceso)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar el proceso' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el proceso' }) //!ERROR
        }
    }

}