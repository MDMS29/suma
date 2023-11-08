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
const utils_1 = require("../../utils");
const Requisiciones_Service_1 = require("../../services/Compras/Requisiciones.Service");
const Requisiciones_Zod_1 = require("../../validations/Zod/Requisiciones.Zod");
class RequisicionesController {
    Obtener_Requisiciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado, empresa } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const requisiciones_service = new Requisiciones_Service_1.RequisicionesService();
                const respuesta = yield requisiciones_service.Obtener_Requisiciones(+estado, +empresa);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener las requisiciones' }); //!ERROR
            }
        });
    }
    Insertar_Requisicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            // VALIDACION DE DATOS
            const result = Requisiciones_Zod_1.RequisicionesSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const familias_producto_service = new Requisiciones_Service_1.RequisicionesService();
                const respuesta = yield familias_producto_service.Insertar_Requisicion(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: `Error al crear la requisicion ${req.body.consecutivo}` }); //!ERROR
            }
        });
    }
    Buscar_Requisicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_requisicion } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_requisicion) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la requisicion' }); //!ERROR
            }
            try {
                const requisiciones_service = new Requisiciones_Service_1.RequisicionesService();
                const respuesta = yield requisiciones_service.Buscar_Requisicion(+id_requisicion);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar la requisicion' }); //!ERROR
            }
        });
    }
    Editar_Requisicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_requisicion } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_requisicion) {
                return res.status(404).json({ error: true, message: 'No se ha encontrado la requisicion' }); //!ERROR
            }
            // VALIDACION DE DATOS
            const result = Requisiciones_Zod_1.RequisicionesSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const requisiciones_service = new Requisiciones_Service_1.RequisicionesService();
                const respuesta = yield requisiciones_service.Editar_Requisicion(+id_requisicion, req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield requisiciones_service.Buscar_Requisicion(+id_requisicion);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar la familia' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar la familia' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Requisicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_requisicion } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_requisicion) {
                return res.status(400).json({ error: true, message: 'No se ha definido la requisicion' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }); //!ERROR
            }
            try {
                const requisiciones_service = new Requisiciones_Service_1.RequisicionesService();
                const familia_estado = yield requisiciones_service.Cambiar_Estado_Requisicion(+id_requisicion, +estado);
                if (familia_estado.error) {
                    return res.status(400).json({ error: true, message: familia_estado.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado == utils_1.EstadosTablas.ESTADO_APROBADO ? 'Se ha aprobado la requisicion' : 'Se ha anulado la requisicion' });
            }
            catch (error) {
                console.log(error);
                return res.status(200).json({ error: false, message: +estado == utils_1.EstadosTablas.ESTADO_APROBADO ? 'Error al aprobar la requisicion' : 'Error al anular la requisicion' }); //!ERROR
            }
        });
    }
    Generar_PDF_Requisicion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_requisicion } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_requisicion) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la requisicion' }); //!ERROR
            }
            try {
                const requisiciones_service = new Requisiciones_Service_1.RequisicionesService();
                const pdf = yield requisiciones_service.Generar_PDF_Requisicion(+id_requisicion);
                if (pdf.error) {
                    return res.json({ error: true, message: pdf.message }); //!ERROR
                }
                // Configurar encabezados para el navegador
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=ejemplo.pdf');
                return res.send(pdf);
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al generar el documento' }); //!ERROR
            }
        });
    }
}
exports.default = RequisicionesController;
