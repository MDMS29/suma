import { Request, Response } from "express";
import { EstadosTablas } from "../../helpers/constants";
import { MenuService } from "../../services/Configuracion/Menu.service";
import { MenuSchema } from "../../validations/Configuracion.Zod";

export default class _MenuController {

    public async Obtener_Menus(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params
        const { estado } = req.query as { estado: string } //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.status(400).json({ error: true, message: 'No se ha definido el modulo a consultar' }) //!ERROR
        }
        if (!estado) {
            return res.status(400).json({ error: true, message: 'No se ha definido el estado' }) //!ERROR
        }

        try {
            const menu_service = new MenuService()
            const respuesta = await menu_service.Obtener_Menus(+estado, +id_modulo)
            if (respuesta?.error) {
                return res.status(400).json({ error: true, message: respuesta?.message }) //!ERROR
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al obtener los menus del modulo' }) //!ERROR
        }
    }

    public async Insertar_Menu(req: Request, res: Response) {
        const { usuario } = req //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
        const { id_modulo } = req.params
        const { nombre_menu, link_menu } = req.body

        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_modulo) {
            return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }) //!ERROR
        }
        if (!nombre_menu || nombre_menu === "") {
            return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }) //!ERROR
        }
        if (!link_menu || link_menu === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar una url para el menu' }) //!ERROR
        }

        const result: any = MenuSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const menu_service = new MenuService()
            const respuesta = await menu_service.Insertar_Menu(nombre_menu, link_menu, id_modulo, usuario?.usuario)
            if (respuesta?.error) {
                return res.json(respuesta)
            }

            return res.status(200).json(respuesta)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al crear el menu' }) //!ERROR
        }
    }

    public async Buscar_Menu(req: Request, res: Response) {
        const { id_menu } = req.params
        const { usuario } = req
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_menu) {
            return res.json({ error: true, message: 'No se ha encontrado el menu' }) //!ERROR
        }
        try {
            const menu_service = new MenuService()

            const respuesta = await menu_service.Buscar_Menu(+id_menu)
            if (respuesta.error) {
                return res.json({ error: true, message: respuesta.message }) //!ERROR
            }
            return res.json(respuesta) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.json({ error: true, message: 'Error al encontrar el menu' }) //!ERROR
        }
    }

    public async Editar_Menu(req: Request, res: Response) {
        const { usuario } = req
        const { id_menu } = req.params
        const { nombre_menu, link_menu } = req.body
        if (!usuario?.id_usuario) {//VALIDACIONES DE QUE ESTE LOGUEADO
            return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }) //!ERROR
        }
        if (!id_menu) {
            return res.status(400).json({ error: true, message: 'No se ha encontrado el rol' }) //!ERROR
        }
        if (!nombre_menu || nombre_menu === "") {
            return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }) //!ERROR
        }
        if (!link_menu || link_menu === "") {
            return res.status(400).json({ error: true, message: 'Debe ingresar una url para el menu' }) //!ERROR
        }

        const result: any = MenuSchema.safeParse(req.body)
        if (!result.success) {
            return res.status(400).json({ error: true, message: result.error.issues[0].message }) //!ERROR
        }

        try {
            const menu_service = new MenuService()

            const respuesta = await menu_service.Editar_menu(+id_menu, nombre_menu, link_menu, usuario.usuario)
            if (respuesta.error) {
                return res.status(400).json({ error: respuesta.error, message: respuesta.message })
            }

            const response = await menu_service.Buscar_Menu(+id_menu)
            if (!response) {
                return res.status(400).json({ error: true, message: 'Error al editar el rol' }) //!ERROR
            }
            return res.status(200).json(response) //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: true, message: 'Error al editar el rol' }) //!ERROR
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
            const menu_service = new MenuService()
            const respuesta = await menu_service.Cambiar_Estado_Menu(+id_menu, +estado)
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