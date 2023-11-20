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
const TipoProducto_Service_1 = require("../../services/Opciones_Basicas/TipoProducto.Service");
const OpcionesBasicas_Zod_1 = require("../../validations/OpcionesBasicas.Zod");
class TipoProductoController {
    Obtener_Tipos_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { empresa } = req.query; //EXTRAER EL ESTADO DESDE LA INFO QUE MANDA EL USUARIO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido la empresa a consultar' }); //!ERROR
            }
            try {
                const tipos_producto_service = new TipoProducto_Service_1.TiposProductoService();
                const respuesta = yield tipos_producto_service.Obtener_Tipos_Producto(+empresa);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los tipos de producto' }); //!ERROR
            }
        });
    }
    Insertar_Tipo_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            // const { id_modulo } = req.params
            const { id_empresa, descripcion } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }); //!ERROR
            }
            if (!descripcion) {
                return res.status(400).json({ error: true, message: 'Debe asignarle un nombre al tipo de producto' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.TipoProductoSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const tipos_producto_service = new TipoProducto_Service_1.TiposProductoService();
                const respuesta = yield tipos_producto_service.Insertar_Tipo_Producto(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json(respuesta); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al crear el tipo de producto' }); //!ERROR
            }
        });
    }
    Buscar_Tipo_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_tipo_producto } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_tipo_producto) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el tipo de producto' }); //!ERROR
            }
            try {
                const tipos_producto_service = new TipoProducto_Service_1.TiposProductoService();
                const respuesta = yield tipos_producto_service.Buscar_Tipo_Producto(+id_tipo_producto);
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
    Editar_Tipo_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_tipo_producto } = req.params;
            const { id_empresa, descripcion } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_empresa) {
                return res.status(400).json({ error: true, message: 'No se ha definido el modulo' }); //!ERROR
            }
            if (!descripcion) {
                return res.status(400).json({ error: true, message: 'Debe asignarle una descripcion al tipo de producto' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.TipoProductoSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const tipos_producto_service = new TipoProducto_Service_1.TiposProductoService();
                const respuesta = yield tipos_producto_service.Editar_Tipo_Producto(+id_tipo_producto, req.body);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield tipos_producto_service.Buscar_Tipo_Producto(+id_tipo_producto);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar el tipo de producto' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el tipo de producto' }); //!ERROR
            }
        });
    }
}
exports.default = TipoProductoController;
