"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CentroCostoEmpresa_Service_1 = require("../../services/Opciones_Basicas/CentroCostoEmpresa.Service");
const constants_1 = require("../../helpers/constants");
const OpcionesBasicas_Zod_1 = require("../../validations/OpcionesBasicas.Zod");
class CentroCostoEmpresa {
    Obtener_Centros_Costo_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado, empresa, proceso } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            if (!empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }); //!ERROR
            }
            try {
                const centro_costo_service = new CentroCostoEmpresa_Service_1.CentroCostoEmpresaService();
                if (proceso != undefined) {
                    const respuesta = yield centro_costo_service.Obtener_Centros_Costo_Empresa(+estado, +empresa, 'proceso', proceso);
                    if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                        return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                    }
                    return res.status(200).json(respuesta);
                }
                else {
                    const respuesta = yield centro_costo_service.Obtener_Centros_Costo_Empresa(+estado, +empresa, '', 0);
                    if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                        return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                    }
                    return res.status(200).json(respuesta);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los centros de costos' }); //!ERROR
            }
        });
    }
    Insertar_Centros_Costo_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_empresa, id_proceso, codigo, centro_costo, correo_responsable } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!id_proceso) {
                return res.status(400).json({ error: true, message: 'Debe seleccionar un proceso' }); //!ERROR
            }
            if (!codigo) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un código para el centro' }); //!ERROR
            }
            if (!centro_costo) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el centro' }); //!ERROR
            }
            if (!correo_responsable) {
                return res.status(400).json({ error: true, message: 'El centro debe tener un responsable' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.CentroEmpresaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const centro_costo_service = new CentroCostoEmpresa_Service_1.CentroCostoEmpresaService();
                const respuesta = yield centro_costo_service.Insertar_Centro_Costo_Empresa(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el proceso' }); //!ERROR
            }
        });
    }
    Buscar_Centro_Costo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_centro_costo } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_centro_costo) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el centro de costo' }); //!ERROR
            }
            try {
                const centro_costo_service = new CentroCostoEmpresa_Service_1.CentroCostoEmpresaService();
                const respuesta = yield centro_costo_service.Buscar_Centro_Costo(+id_centro_costo);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar el centro de costo' }); //!ERROR
            }
        });
    }
    Editar_Centro_Costo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_centro_costo } = req.params;
            const { id_empresa, id_proceso, codigo, centro_costo, correo_responsable } = req.body;
            console.log('editando centro...', req.body);
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!id_centro_costo) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el centro de costo' }); //!ERROR
            }
            if (!id_proceso) {
                return res.status(400).json({ error: true, message: 'Debe seleccionar un proceso' }); //!ERROR
            }
            if (!codigo) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un código para el proceso' }); //!ERROR
            }
            if (!centro_costo) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el centro' }); //!ERROR
            }
            if (!correo_responsable) {
                return res.status(400).json({ error: true, message: 'El centro debe tener un responsable' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.CentroEmpresaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const centro_costo_service = new CentroCostoEmpresa_Service_1.CentroCostoEmpresaService();
                const respuesta = yield centro_costo_service.Editar_Centro_Costo(+id_centro_costo, req.body);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield centro_costo_service.Buscar_Centro_Costo(+id_centro_costo);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar el centro' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el centro' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Centro(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_centro_costo } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_centro_costo) {
                return res.status(400).json({ error: true, message: 'No se ha definido el centro' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }); //!ERROR
            }
            try {
                const centro_costo_service = new CentroCostoEmpresa_Service_1.CentroCostoEmpresaService();
                const centro_cambio_estado = yield centro_costo_service.Cambiar_Estado_Centro(+id_centro_costo, +estado);
                if (centro_cambio_estado.error) {
                    return res.status(400).json({ error: true, message: centro_cambio_estado.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado == constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el centro de costo' : 'Se ha desactivado el centro de costo' });
            }
            catch (error) {
                console.log(error);
                return res.status(200).json({ error: false, message: +estado == constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el centro de costo' : 'Error al desactivar el centro de costo' }); //!ERROR
            }
        });
    }
}
exports.default = CentroCostoEmpresa;
