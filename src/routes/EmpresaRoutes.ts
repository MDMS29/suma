import { Router } from "express";
import { _Autorizacion } from "../middleware/Autorizacion";
import _EmpresaController from "../controller/EmpresaController";

//INICIALIZAR RUTAS PARA LAS EMPRESAS
export const _EmpresasRouter = Router()

//INICIALIZAR CONTROLADOR DE EMPRESA
const EmpresaController = new _EmpresaController()

_EmpresasRouter.route('/')
    .get(_Autorizacion, EmpresaController.Obtener_Empresas) //OBTENER TODOS LAS EMPRESAS
    .post(_Autorizacion, EmpresaController.Insertar_Empresa) //CREAR EMPRESA

    _EmpresasRouter.route('/:id_empresa')
    .get(_Autorizacion, EmpresaController.Buscar_Empresa) //BUSCAR UNA EMPRESA SEGUN SU ID
    .patch(_Autorizacion, EmpresaController.Editar_Empresa) //EDITAR SEGUN SU ID
    // .delete(_Autorizacion, MenuController.Cambiar_Estado_Menu) //CAMBIAR ESTADO DEL PERFIL POR ID

