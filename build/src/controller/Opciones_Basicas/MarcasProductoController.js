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
const MarcaProducto_Service_1 = require("../../services/Opciones_Basicas/MarcaProducto.Service");
const OpcionesBasicas_Zod_1 = require("../../validations/Zod/OpcionesBasicas.Zod");
class MarcasProductoController {
    Obtener_Marcas_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            try {
                const marcas_producto_service = new MarcaProducto_Service_1.MarcaProductoService();
                const respuesta = yield marcas_producto_service.Obtener_Marcas_Producto();
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener las marcas' }); //!ERROR
            }
        });
    }
    Insertar_Marca_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            // const { id_modulo } = req.params
            const { marca } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!marca) {
                return res.status(400).json({ error: true, message: 'Debe asignarle un nombre a la marca' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.MarcaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const tipos_producto_service = new MarcaProducto_Service_1.MarcaProductoService();
                const respuesta = yield tipos_producto_service.Insertar_Marca_Producto(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.usuario);
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
    Buscar_Marca_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_marca_producto } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!id_marca_producto) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado la marca' }); //!ERROR
            }
            try {
                const marcas_producto_service = new MarcaProducto_Service_1.MarcaProductoService();
                const respuesta = yield marcas_producto_service.Buscar_Marca_Producto(+id_marca_producto);
                if (respuesta.error) {
                    return res.json({ error: true, message: respuesta.message }); //!ERROR
                }
                return res.json(respuesta); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar la marca' }); //!ERROR
            }
        });
    }
    Editar_Marca_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_marca_producto } = req.params;
            const { marca } = req.body;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesion para continuar' }); //!ERROR
            }
            if (!marca) {
                return res.status(400).json({ error: true, message: 'Debe ingresar el nombre de la marca' }); //!ERROR
            }
            const result = OpcionesBasicas_Zod_1.MarcaSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const marcas_producto_service = new MarcaProducto_Service_1.MarcaProductoService();
                const respuesta = yield marcas_producto_service.Editar_Marca_Producto(+id_marca_producto, req.body);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield marcas_producto_service.Buscar_Marca_Producto(+id_marca_producto);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar la marca' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar la marca' }); //!ERROR
            }
        });
    }
}
exports.default = MarcasProductoController;
