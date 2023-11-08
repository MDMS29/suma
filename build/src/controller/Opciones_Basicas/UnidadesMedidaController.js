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
const UnidadesMedida_Service_1 = require("../../services/Opciones_Basicas/UnidadesMedida.Service");
const OpcionesBasicas_Zod_1 = require("../../validations/Zod/OpcionesBasicas.Zod");
class UnidadesMedidaController {
    Obtener_Unidades_Medida(req, res) {
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
                const unidades_medidas_service = new UnidadesMedida_Service_1.UnidadesMedidaService();
                const respuesta = yield unidades_medidas_service.Obtener_Unidades_Medida(+estado, +empresa);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener las unidades de medida' }); //!ERROR
            }
        });
    }
    Insertar_Unidad_Medida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            // const { id_modulo } = req.params
            const { id_empresa, unidad } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }); //!ERROR
            }
            if (!unidad) {
                return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.UnidadMedidaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const menu_service = new UnidadesMedida_Service_1.UnidadesMedidaService();
                const respuesta = yield menu_service.Insertar_Unidad_Medida(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta);
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el menu' }); //!ERROR
            }
        });
    }
    Buscar_Unidad_Medida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_unidad } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_unidad) {
                return res.json({ error: true, message: 'No se ha encontrado la unidad de medida' }); //!ERROR
            }
            try {
                const menu_service = new UnidadesMedida_Service_1.UnidadesMedidaService();
                const respuesta = yield menu_service.Buscar_Unidad_Medida(+id_unidad);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar la unidad de medida' }); //!ERROR
            }
        });
    }
    Editar_Unidad_Medida(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_unidad } = req.params;
            const { id_empresa, unidad } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa' }); //!ERROR
            }
            if (!unidad) {
                return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al menu' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.UnidadMedidaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const menu_service = new UnidadesMedida_Service_1.UnidadesMedidaService();
                const respuesta = yield menu_service.Editar_Unidad_Medida(+id_unidad, req.body);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield menu_service.Buscar_Unidad_Medida(+id_unidad);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar la unidad de medida' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar la unidad de medida' }); //!ERROR
            }
        });
    }
}
exports.default = UnidadesMedidaController;
