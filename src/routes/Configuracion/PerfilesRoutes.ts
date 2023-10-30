import { Router } from "express";
import { _Autorizacion } from "../../middleware/Autorizacion";
import { _PerfilController } from "../../controller/Configuracion/PerfilController";

//INICIALIZAR RUTAS PARA PERFILES
export const _PerfilesRouter = Router()

//INICIALIZAR CONTROLADOR DE PERFIL
const PerfilController = new _PerfilController()


_PerfilesRouter.route('/')
    .get(_Autorizacion, PerfilController.Obtener_Perfiles) //OBTENER TODOS LOS PERFILES
    .post(_Autorizacion, PerfilController.Insertar_Perfil) //INSERTAR PERFIL

_PerfilesRouter.post('/modulos', _Autorizacion, PerfilController.Obtener_Modulos_Perfiles)// OBTENER LOS MODULOS DE LOS PERFILES

_PerfilesRouter.route('/:id_perfil')
.get(_Autorizacion, PerfilController.Buscar_Perfil)
    .patch (_Autorizacion, PerfilController.Editar_Perfil) //EDITAR PERFIL SEGUN SU ID
    .delete(_Autorizacion, PerfilController.Cambiar_Estado_Perfil) //CAMBIAR ESTADO DEL PERFIL POR ID
