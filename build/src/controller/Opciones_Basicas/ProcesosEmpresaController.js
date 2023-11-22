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
const ProcesosEmpresa_Service_1 = require("../../services/Opciones_Basicas/ProcesosEmpresa.Service");
const OpcionesBasicas_Zod_1 = require("../../validations/OpcionesBasicas.Zod");
class ProcesosEmpresaController {
    Obtener_Procesos_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { empresa } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }); //!ERROR
            }
            try {
                const proceso_empresa_service = new ProcesosEmpresa_Service_1.ProcesosEmpresaService();
                const respuesta = yield proceso_empresa_service.Obtener_Procesos_Empresa(+empresa);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los procesos' }); //!ERROR
            }
        });
    }
    Insertar_Procesos_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            // const { id_familia_producto } = req.params
            const { id_empresa, codigo, proceso } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!codigo) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un código para el proceso' }); //!ERROR
            }
            if (!proceso) {
                return res.status(400).json({ error: true, message: 'Debe ingresar el nombre del proceso' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.ProcesoEmpresaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const proceso_empresa_service = new ProcesosEmpresa_Service_1.ProcesosEmpresaService();
                const respuesta = yield proceso_empresa_service.Insertar_Procesos_Empresa(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
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
    Buscar_Proceso_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_proceso } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_proceso) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el proceso' }); //!ERROR
            }
            try {
                const proceso_empresa_service = new ProcesosEmpresa_Service_1.ProcesosEmpresaService();
                const respuesta = yield proceso_empresa_service.Buscar_Proceso_Empresa(+id_proceso);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar el proceso' }); //!ERROR
            }
        });
    }
    Editar_Proceso_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_proceso } = req.params;
            const { id_empresa, codigo, proceso } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!id_proceso) {
                return res.status(400).json({ error: true, message: 'No se ha definido el proceso' }); //!ERROR
            }
            if (!codigo) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un código para el proceso' }); //!ERROR
            }
            if (!proceso) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para el proceso' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.ProcesoEmpresaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const proceso_empresa_service = new ProcesosEmpresa_Service_1.ProcesosEmpresaService();
                const respuesta = yield proceso_empresa_service.Editar_Proceso_Empresa(+id_proceso, req.body);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield proceso_empresa_service.Buscar_Proceso_Empresa(+id_proceso);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar el proceso' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el proceso' }); //!ERROR
            }
        });
    }
}
exports.default = ProcesosEmpresaController;
