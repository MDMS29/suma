import { Request, Response } from "express";
import { CentroCostoEmpresaService } from "../../services/Opciones_Basicas/CentroCostoEmpresa.Service";
import { EstadosTablas } from "../../validations/utils";

export default class CentroCostoEmpresa {

    public async Obtener_Centros_Costo_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado, empresa } = req.query as { estado: string, empresa: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }
        if (!empresa) {
            return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }) //!ERROR
        }

        try {
            const centro_costo_service = new CentroCostoEmpresaService()
            const respuesta = await centro_costo_service.Obtener_Centros_Costo_Empresa(+estado, +empresa)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los centros de costos' }) //!ERROR
        }
    }

    public async Insertar_Centros_Costo_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_familia_producto } = req.params
        const { id_empresa, id_proceso, codigo, centro_costo, correo_responsable } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!id_proceso) {
            return res.status(400).json({ error: true, message: 'Debe ingresar el nombre del proceso' }) //!ERROR
        }
        if (!codigo) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un codigo para el proceso' }) //!ERROR
        }
        if (!centro_costo) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el centro' }) //!ERROR
        }
        if (!correo_responsable) {
            return res.status(400).json({ error: true, message: 'El centro debe tener un responsable' }) //!ERROR
        }

        try {
            const centro_costo_service = new CentroCostoEmpresaService()
            const respuesta = await centro_costo_service.Insertar_Centro_Costo_Empresa(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el proceso' }) //!ERROR
        }
    }

    public async Buscar_Centro_Costo(req: Request, res: Response) {
        const { usuario } = req
        const { id_centro_costo } = req.params
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_centro_costo) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el centro de costo' }) //!ERROR
        }
        try {
            const centro_costo_service = new CentroCostoEmpresaService()
            const respuesta = await centro_costo_service.Buscar_Centro_Costo(+id_centro_costo)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el centro de costo' }) //!ERROR
        }
    }

    public async Editar_Centro_Costo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_centro_costo } = req.params
        const { id_empresa, id_proceso, codigo, centro_costo, correo_responsable } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!id_centro_costo) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el centro de costo' }) //!ERROR
        }
        if (!id_proceso) {
            return res.status(400).json({ error: true, message: 'Debe seleccionar un proceso' }) //!ERROR
        }
        if (!codigo) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un codigo para el proceso' }) //!ERROR
        }
        if (!centro_costo) {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el centro' }) //!ERROR
        }
        if (!correo_responsable) {
            return res.status(400).json({ error: true, message: 'El centro debe tener un responsable' }) //!ERROR
        }

        try {
            const centro_costo_service = new CentroCostoEmpresaService()

            const respuesta = await centro_costo_service.Editar_Centro_Costo(+id_centro_costo, req.body)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await centro_costo_service.Buscar_Centro_Costo(+id_centro_costo)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar el centro' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el centro' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Centro(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_centro_costo } = req.params
        const { estado } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_centro_costo) {
            return res.status(400).json({ error: true, message: 'No se ha definido el centro' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }) //!ERROR
        }

        try {
            const centro_costo_service = new CentroCostoEmpresaService()
            const centro_cambio_estado = await centro_costo_service.Cambiar_Estado_Centro(+id_centro_costo, estado)
            if (centro_cambio_estado.error) {
                return res.status(400).json({ error: true, message: centro_cambio_estado.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el centro de costo' : 'Se ha desactivado el centro de costo' })
        } catch (error) {
            console.log(error)
            return res.status(200).json({ error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el centro de costo' : 'Error al desactivar el centro de costo' }) //!ERROR
        }
    }

}