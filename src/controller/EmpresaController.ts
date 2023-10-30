import { Request, Response } from "express";
import { EstadosTablas } from "../validations/utils";
import EmpresaService from "../services/Empresa.service";

export default class _EmpresaController {

    public async Obtener_Empresas(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const empresa_service = new EmpresaService()
            const respuesta = await empresa_service.Obtener_Empresas(+estado)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener las empresas del sistema' }) //!ERROR
        }
    }

    public async Insertar_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        // const { id_modulo } = req.params
        const { nit, razon_social, telefono, direccion, correo } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if (!nit || nit === "") {
            return res.status(400).json({ error: true, message: 'Ingrese el nit de la empresa' }) //!ERROR
        }
        if (!razon_social || razon_social === "") {
            return res.status(400).json({ error: true, message: 'Ingrese la razon social de la empresa' }) //!ERROR
        }
        if (!telefono || telefono === "") {
            return res.status(400).json({ error: true, message: 'Ingrese el telefono de la empresa' }) //!ERROR
        }
        if (!direccion || direccion === "") {
            return res.status(400).json({ error: true, message: 'Ingrese la direccion de la empresa' }) //!ERROR
        }
        if (!correo || correo === "") {
            return res.status(400).json({ error: true, message: 'Ingrese el correo de la empresa' }) //!ERROR
        }

        try {
            const empresa_service = new EmpresaService()
            const respuesta = await empresa_service.Insertar_Empresa(req.body, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta)
            }

            return res.status(201).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el menu' }) //!ERROR
        }
    }

    public async Buscar_Empresa(req: Request, res: Response) {
        const { id_empresa } = req.params
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        try {
            const empresa_service = new EmpresaService()

            const respuesta = await empresa_service.Buscar_Empresa(+id_empresa)
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.status(200).json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar la empresa' }) //!ERROR
        }
    }

    public async Editar_Empresa(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_empresa } = req.params
        const { nit, razon_social, telefono, direccion, correo } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }

        if (!id_empresa) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }) //!ERROR
        }
        if (!nit || nit === "") {
            return res.status(400).json({ error: true, message: 'Ingrese el nit de la empresa' }) //!ERROR
        }
        if (!razon_social || razon_social === "") {
            return res.status(400).json({ error: true, message: 'Ingrese la razon social de la empresa' }) //!ERROR
        }
        if (!telefono || telefono === "") {
            return res.status(400).json({ error: true, message: 'Ingrese el telefono de la empresa' }) //!ERROR
        }
        if (!direccion || direccion === "") {
            return res.status(400).json({ error: true, message: 'Ingrese la direccion de la empresa' }) //!ERROR
        }
        if (!correo || correo === "") {
            return res.status(400).json({ error: true, message: 'Ingrese el correo de la empresa' }) //!ERROR
        }

        // const result = PerfilesSchema.safeParse(req.body)
        // if (!result.success) {
        //     return res.status(400).json({ error: true, message: result.error.issues }) //!ERROR
        // }

        try {
            const menu_service = new EmpresaService()

            const respuesta = await menu_service.Editar_Empresa(id_empresa, req.body, usuario.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await menu_service.Buscar_Empresa(+id_empresa)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar la empresa' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar la empresa' }) //!ERROR
        }
    }

    public async Cambiar_Estado_Menu(req: Request, res: Response) {
        const { usuario } = req
        const { id_menu } = req.params
        const { estado } = req.query as { estado: string }
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_menu) {
            return res.json({ error: true, message: 'No se ha encontrado el menu' }) //!ERROR
        }
        if (!estado) {
            return res.json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const menu_service = new EmpresaService()
            const respuesta = await menu_service.Cambiar_Estado_Rol(+id_menu, +estado)
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el menu' : 'Se ha desactivado el menu' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el menu' : 'Error al desactivar el menu' }) //!ERROR
        }
    }

}