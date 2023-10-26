import { Request, Response } from "express";
import ModuloService from "../services/Modulo.service";
import { ModulosSchema } from "../validations/ValidacionesZod";
import { EstadosTablas } from "../validations/utils";

export default class _ModuloController {
    public async Obtener_Modulos(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const respuesta = await _ModuloService.Obtener_Modulos(+estado)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }

    public async Insertar_Modulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { cod_modulo, nombre_modulo, icono, roles } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!nombre_modulo || nombre_modulo === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el modulo' }) //!ERROR
        }
        if (!cod_modulo || cod_modulo === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar un codigo para el modulo' }) //!ERROR
        }
        if (!icono || icono === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar un icono para el modulo' }) //!ERROR
        }
        if (roles.length <= 0) {
            return res.status(400).json({ error: true, message: 'El modulo debe tener por lo menos un rol' }) //!ERROR
        }
        const rol = roles.filter((rol: { id_rol: number }) => rol.id_rol === 1)
        if (rol?.length <= 0) {
            return res.status(400).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }) //!ERROR
        }

        // const zod_validacion = ModulosSchema.safeParse(req.body)
        // if (!zod_validacion.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
        //     return res.status(400).json({ error: true, message: zod_validacion.error.issues }) //!ERROR
        // }

        try {
            const _ModuloService = new ModuloService()
            const respuesta = await _ModuloService.Insertar_Modulo(cod_modulo, nombre_modulo, icono, usuario?.usuario, roles)
            
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }

    public async Buscar_Modulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo || !+id_modulo) {
            return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const modulo = await _ModuloService.Buscar_Modulo(+id_modulo)
            if (modulo?.error) {
                return res.status(400).json({ error: true, message: modulo.message }) //!ERROR
            }

            return res.status(200).json(modulo)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al encontrar el modulo' }) //!ERROR
        }
    }

    public async Editar_Modulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params
        const { cod_modulo, nombre_modulo, icono, roles } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el modulo' }) //!ERROR
        }
        if (!cod_modulo || cod_modulo === "") {
            return res.status(400).json({ error: true, message: 'No se ha definido el codigo del modulo' }) //!ERROR
        }
        if (!nombre_modulo || nombre_modulo === "") {
            return res.status(400).json({ error: true, message: 'No se ha definido el nombre del modulo' }) //!ERROR
        }
        if (!icono || icono === "") {
            return res.status(400).json({ error: true, message: 'No se ha definido el icono del modulo' }) //!ERROR
        }
        if (roles.length <= 0) {
            return res.status(400).json({ error: true, message: 'El modulo debe tener por lo menos un rol' }) //!ERROR
        }
        const rol = roles.filter((rol: { id_rol: number }) => rol.id_rol === 1)
        if (rol?.length <= 0) {
            return res.status(400).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }) //!ERROR
        }

        //VALIDACIONES CON LIBRERIA ZOD
        // const result: any = ModulosSchema.safeParse(req.body)
        // if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
        //     return res.status(400).json({ error: true, message: result.error.issues }) //!ERROR
        // }

        try {
            const _ModuloService = new ModuloService()
            const modulo = await _ModuloService.Editar_Modulo(+id_modulo, req.body, usuario.usuario, roles)

            if (modulo?.error) {
                return res.status(400).json({ error: true, message: modulo.message }) //!ERROR
            }

            const moduloEditado = await _ModuloService.Buscar_Modulo(+id_modulo)
            if (moduloEditado.error) {
                return res.status(400).json({ error: true, message: 'No se ha podido encontrar el modulo' }) //!ERROR             
            }
            return res.status(200).json(moduloEditado) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el modulo' }) //!ERROR             
        }
    }

    public async Cambiar_Estado_Modulo(req: Request, res: Response) {
        const { id_modulo } = req.params
        const { usuario } = req
        const { estado } = req.query as { estado: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el modulo' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()

            const respuesta = await _ModuloService.Cambiar_Estado_Modulo(+id_modulo, +estado)
            if (respuesta.error) {
                return res.status(400).json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json({ error: false, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el modulo' : 'Se ha desactivado el modulo' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el modulo' : 'Error al desactivar del modulo' }) //!ERROR
        }
    }
}