import { Request, Response } from "express";
import ModuloService from "../services/Modulo.service";
import { ModulosSchema } from "../validations/ValidacionesZod";
import { EstadosTablas } from "../validations/utils";

export class _ModuloController {
    public async ObtenerModulos(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!estado) {
            return res.status(404).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const respuesta = await _ModuloService.ObtenerModulos(+estado)
            if (respuesta?.error) {
                return res.status(404).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }

    public async InsertarModulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { cod_modulo, nombre_modulo, icono, roles } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!nombre_modulo) {
            return res.status(404).json({ error: true, message: 'Debe ingresar un nombre para el modulo' }) //!ERROR
        }
        if (!cod_modulo) {
            return res.status(404).json({ error: true, message: 'Debe ingresar un codigo para el modulo' }) //!ERROR
        }
        if (!icono) {
            return res.status(404).json({ error: true, message: 'Debe ingresar un icono para el modulo' }) //!ERROR
        }
        if (roles.length <= 0) {
            return res.status(404).json({ error: true, message: 'El modulo debe tener por lo menos un rol' }) //!ERROR
        }
        const rol  = roles.filter((rol: { id_rol: number }) => rol.id_rol === 1)
        if(rol?.length <= 0){
            return res.status(404).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }) //!ERROR
        }

        const result = ModulosSchema.safeParse(req.body)
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(404).json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            console.log('61 - controller', req.body)
            const respuesta = await _ModuloService.InsertarModulo(cod_modulo, nombre_modulo, icono, usuario?.usuario, roles)
            if (respuesta?.error) {
                return res.status(404).json({ error: true, message: respuesta?.message }) //!ERROR
            }
            
            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los modulos' }) //!ERROR
        }
    }

    public async BuscarModulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params //EXTRAER LA INFORMACION DEL MODULO A CREAR
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo || !+id_modulo) {
            return res.status(404).json({ error: true, message: 'No se ha definido el modulo' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const modulo = await _ModuloService.BuscarModulo(+id_modulo)
            if (modulo?.error) {
                return res.status(404).json({ error: true, message: modulo.message }) //!ERROR
            }

            return res.status(200).json(modulo)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al encontrar el modulo' }) //!ERROR
        }
    }

    public async EditarModulo(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params
        const { cod_modulo, nombre_modulo, icono, roles } = req.body //EXTRAER LA INFORMACION DEL MODULO A CREAR
        
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.status(404).json({ error: true, message: 'No se ha encontrado el modulo' }) //!ERROR
        }
        if (!cod_modulo) {
            return res.status(404).json({ error: true, message: 'No se ha definido el codigo del modulo' }) //!ERROR
        }
        if (!nombre_modulo) {
            return res.status(404).json({ error: true, message: 'No se ha definido el nombre del modulo' }) //!ERROR
        }
        if (!icono) {
            return res.status(404).json({ error: true, message: 'No se ha definido el icono del modulo' }) //!ERROR
        }
        if (roles.length <= 0) {
            return res.status(404).json({ error: true, message: 'El modulo debe tener por lo menos un rol' }) //!ERROR
        }
        const rol  = roles.filter((rol: { id_rol: number }) => rol.id_rol === 1)
        if(rol?.length <= 0){
            return res.status(404).json({ error: true, message: "Para realizar una accion diferente debe seleccionar 'consultar'" }) //!ERROR
        }

        //VALIDACIONES CON LIBRERIA ZOD
        const result = ModulosSchema.safeParse(req.body)
        if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
            return res.status(404).json({ error: true, message: result.error.issues }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()
            const modulo = await _ModuloService.EditarModulo(+id_modulo, req.body, usuario.usuario, roles)

            if (modulo?.error) {
                return res.status(404).json({ error: true, message: modulo.message }) //!ERROR
            }

            const moduloEditado = await _ModuloService.BuscarModulo(+id_modulo)
            if (moduloEditado.error) {
                return res.status(404).json({ error: true, message: 'No se ha podido encontrar el modulo' }) //!ERROR             
            }
            return res.status(200).json(moduloEditado) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el modulo' }) //!ERROR             
        }
    }

    public async CambiarEstadoModulo(req: Request, res: Response) {
        const { id_modulo } = req.params
        const { usuario } = req
        const { estado } = req.query as { estado: string }

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.status(404).json({ error: true, message: 'No se ha encontrado el modulo' }) //!ERROR
        }
        if (!estado) {
            return res.status(404).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const _ModuloService = new ModuloService()

            const respuesta = await _ModuloService.CambiarEstadoModulo(+id_modulo, +estado)
            if (respuesta.error) {
                return res.status(404).json({ error: true, message: respuesta.message }) //!ERROR
            }

            return res.status(200).json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el modulo' : 'Se ha desactivado el modulo' }) //*SUCCESSFUL

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el modulo' : 'Error al desactivar del modulo' }) //!ERROR
        }
    }
}