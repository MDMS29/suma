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
const ProductosEmpresa_Service_1 = require("../../services/Opciones_Basicas/ProductosEmpresa.Service");
const OpcionesBasicas_Zod_1 = require("../../validations/OpcionesBasicas.Zod");
const constants_1 = require("../../helpers/constants");
class ProductosEmpresaController {
    Obtener_Productos_Empresa(req, res) {
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
                const producto_empresa_service = new ProductosEmpresa_Service_1.ProductosEmpresaService();
                const respuesta = yield producto_empresa_service.Obtener_Productos_Empresa(+estado, +empresa);
                if (respuesta === null || respuesta === void 0 ? void 0 : respuesta.error) {
                    return res.status(400).json({ error: true, message: respuesta === null || respuesta === void 0 ? void 0 : respuesta.message }); //!ERROR
                }
                return res.status(200).json(respuesta);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al obtener los productos de la empresa' }); //!ERROR
            }
        });
    }
    Insertar_Producto_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            console.log(req.body);
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!req.body.foto) {
                req.body.foto = constants_1._Foto_Default;
            }
            const result = OpcionesBasicas_Zod_1.ProductosSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const producto_empresa_service = new ProductosEmpresa_Service_1.ProductosEmpresaService();
                const respuesta = yield producto_empresa_service.Insertar_Producto_Empresa(req.body, usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario);
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
    Buscar_Producto_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req;
            const { id_producto } = req.params;
            const { tipo } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(400).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_producto) {
                return res.status(400).json({ error: true, message: 'No se ha encontrado el producto' }); //!ERROR
            }
            try {
                const producto_empresa_service = new ProductosEmpresa_Service_1.ProductosEmpresaService();
                if (tipo) {
                    const respuesta = yield producto_empresa_service.Buscar_Producto_Filtro('tipo_producto', +tipo, usuario.id_empresa);
                    if (respuesta.error) {
                        return res.json({ error: true, message: respuesta.message }); //!ERROR
                    }
                    return res.json(respuesta); //*SUCCESSFUL
                }
                else {
                    const respuesta = yield producto_empresa_service.Buscar_Producto_Empresa(+id_producto);
                    if (respuesta.error) {
                        return res.json({ error: true, message: respuesta.message }); //!ERROR
                    }
                    return res.json(respuesta); //*SUCCESSFUL
                }
            }
            catch (error) {
                console.log(error);
                return res.json({ error: true, message: 'Error al encontrar el producto' }); //!ERROR
            }
        });
    }
    Editar_Producto_Empresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_producto } = req.params;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!req.body.foto) {
                req.body.foto = constants_1._Foto_Default;
            }
            const result = OpcionesBasicas_Zod_1.ProductosSchema.safeParse(req.body); //VALIDAR QUE LOS TIPOS DE DATOS SEAN CORRECTOS
            if (!result.success) { //VALIDAR SI LA INFORMACION ESTA INCORRECTA
                return res.status(400).json({ error: true, message: result.error.issues[0].message }); //!ERROR
            }
            try {
                const producto_empresa_service = new ProductosEmpresa_Service_1.ProductosEmpresaService();
                const respuesta = yield producto_empresa_service.Editar_Producto_Empresa(+id_producto, result.data, usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario);
                if (respuesta.error) {
                    return res.status(400).json({ error: respuesta.error, message: respuesta.message });
                }
                const response = yield producto_empresa_service.Buscar_Producto_Empresa(+id_producto);
                if (!response) {
                    return res.status(400).json({ error: true, message: 'Error al editar el producto' }); //!ERROR
                }
                return res.status(200).json(response); //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error: true, message: 'Error al editar el producto' }); //!ERROR
            }
        });
    }
    Cambiar_Estado_Producto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario } = req; //OBTENER LA INFORMACION DEL USUARIO LOGUEADO
            const { id_producto } = req.params;
            const { estado } = req.query;
            if (!(usuario === null || usuario === void 0 ? void 0 : usuario.id_usuario)) { //VALIDACIONES DE QUE ESTE LOGUEADO
                return res.status(401).json({ error: true, message: 'Inicie sesión para continuar' }); //!ERROR
            }
            if (!id_producto) {
                return res.status(400).json({ error: true, message: 'No se ha definido el producto' }); //!ERROR
            }
            if (!estado) {
                return res.status(400).json({ error: true, message: 'No se ha definido un estado a cambiar' }); //!ERROR
            }
            try {
                const producto_empresa_service = new ProductosEmpresa_Service_1.ProductosEmpresaService();
                const producto = yield producto_empresa_service.Cambiar_Estado_Producto(+id_producto, +estado);
                if (producto.error) {
                    return res.status(400).json({ error: true, message: producto.message }); //!ERROR
                }
                return res.status(200).json({ error: false, message: +estado == constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Se ha activado el producto' : 'Se ha desactivado el producto' });
            }
            catch (error) {
                console.log(error);
                return res.status(200).json({ error: false, message: +estado == constants_1.EstadosTablas.ESTADO_ACTIVO ? 'Error al activar el producto' : 'Error al desactivar el producto' }); //!ERROR
            }
        });
    }
}
exports.default = ProductosEmpresaController;
