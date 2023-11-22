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
const FamiliaProducto_Service_1 = require("../../services/Opciones_Basicas/FamiliaProducto.Service");
const constants_1 = require("../../helpers/constants");
const OpcionesBasicas_Zod_1 = require("../../validations/OpcionesBasicas.Zod");
class FamiliaProductoController {
    Obtener_Familias_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { estado, empresa } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido el estado' }); //!ERROR
            }
            try {
                const familias_producto_service = new FamiliaProducto_Service_1.FamiliaProductoService();
                const respuesta = yield familias_producto_service.Obtener_Familias_Producto(+estado, +empresa);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener las familias de los productos' }); //!ERROR
            }
        });
    }
    Insertar_Familia_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            // const { id_familia_producto } = req.params
            const { id_empresa, referencia, descripcion } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!referencia) {
                return res.status(400).json({ error: true, message: 'Debe ingresar una referencia para la familia' }); //!ERROR
            }
            if (!descripcion) {
                return res.status(400).json({ error: true, message: 'Debe ingresar una descripción para la familia' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.FamiliaProductoSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const familias_producto_service = new FamiliaProducto_Service_1.FamiliaProductoService();
                const respuesta = yield familias_producto_service.Insertar_Familia_Producto(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.json(respuesta); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear la marca' }); //!ERROR
            }
        });
    }
    Buscar_Familia_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_familia_producto } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_familia_producto) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la familia' }); //!ERROR
            }
            try {
                const familias_producto_service = new FamiliaProducto_Service_1.FamiliaProductoService();
                const respuesta = yield familias_producto_service.Buscar_Familia_Producto(+id_familia_producto);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar la familia' }); //!ERROR
            }
        });
    }
    Editar_Familia_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_familia_producto } = req.params;
            const { id_empresa, referencia, descripcion } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la empresa' }); //!ERROR
            }
            if (!id_familia_producto) {
                return res.status(400).json({ error: true, message: 'No se ha definido la familia' }); //!ERROR
            }
            if (!referencia) {
                return res.status(400).json({ error: true, message: 'Debe ingresar una referencia para la familia' }); //!ERROR
            }
            if (!descripcion) {
                return res.status(400).json({ error: true, message: 'Debe ingresar un nombre para la familia' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.FamiliaProductoSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const familia_producto_service = new FamiliaProducto_Service_1.FamiliaProductoService();
                const respuesta = yield familia_producto_service.Editar_Familia_Producto(+id_familia_producto, req.body);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield familia_producto_service.Buscar_Familia_Producto(+id_familia_producto);
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
    Cambiar_Estado_Familia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_familia_producto } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_familia_producto) {
                return res.status(400).json({ error: true, message: 'No se ha definido la familia' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }); //!ERROR
            }
            try {
                const familia_producto_service = new FamiliaProducto_Service_1.FamiliaProductoService();
                const familia_estado = yield familia_producto_service.Cambiar_Estado_Familia(+id_familia_producto, +estado);
                if (familia_estado.error) {
                    return res.status(400).json({ error: true, message: familia_estado.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado == constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado la familia' : 'Se ha desactivado la familia' });
            }
            catch (error) {
                console.log(error);
                return res.status(200).json({ error: false, message: +estado == constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar la familia' : 'Error al desactivar la familia' }); //!ERROR
            }
        });
    }
}
exports.default = FamiliaProductoController;
