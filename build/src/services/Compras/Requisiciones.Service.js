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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequisicionesService = void 0;
const QueryRequisiciones_1 = __importDefault(require("../../querys/Compras/QueryRequisiciones"));
const jspdf_1 = require("jspdf");
const fs_1 = __importDefault(require("fs"));
class RequisicionesService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Requisiciones = new QueryRequisiciones_1.default();
    }
    Obtener_Requisiciones(estado, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisiciones = yield this._Query_Requisiciones.Obtener_Requisiciones_Enc(estado, empresa);
                if ((requisiciones === null || requisiciones === void 0 ? void 0 : requisiciones.length) <= 0) {
                    return { error: false, message: 'No se han encontrado las requisicion' }; //!ERROR
                }
                for (let requisicion_enc of requisiciones) {
                    const det_requisicion = yield this._Query_Requisiciones.Buscar_Detalle_Requisicion(requisicion_enc.id_requisicion);
                    if (!det_requisicion) {
                        return { error: true, message: `Error al cargar los detalles de la requisicion ${requisicion_enc.requisicion}` }; //!ERROR
                    }
                    requisicion_enc.det_requisicion = det_requisicion;
                }
                return requisiciones;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cargar las requisiciones' }; //!ERROR
            }
        });
    }
    Insertar_Requisicion(requisicion_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //TODO: ARREGLAR VALIDACION DE DATOS
                const requisicion_filtrada = yield this._Query_Requisiciones.Buscar_Requisicion_Consecutivo(requisicion_request);
                if ((requisicion_filtrada === null || requisicion_filtrada === void 0 ? void 0 : requisicion_filtrada.length) > 0) {
                    return { error: true, message: 'Ya existe este consecutivo' }; //!ERROR
                }
                // INSERTAR ENCABEZADO DE LA REQUISICION
                const requisicion_enc = yield this._Query_Requisiciones.Insertar_Requisicion_Enc(requisicion_request, usuario_creacion);
                if (!requisicion_enc) {
                    return { error: true, message: 'No se ha podido crear la requisicion' }; //!ERROR
                }
                // INSERTAR DETALLES DE LA REQUISICION
                const { det_requisicion } = requisicion_request;
                if (det_requisicion) {
                    let detalle;
                    for (detalle of det_requisicion) {
                        const requisicion_det = yield this._Query_Requisiciones.Insertar_Requisicion_Det(detalle, requisicion_enc[0].id_requisicion, usuario_creacion);
                        if (!requisicion_det) {
                            return { error: true, message: `Error al insertar el producto ${detalle.id_producto}` }; //!ERROR
                        }
                    }
                }
                else {
                    return { error: true, message: `Error al crear la requisicion ${requisicion_request.consecutivo}` }; //!ERROR
                }
                // EN ESTE ESPACIO DE LINEA SE EJECUTA UN TRIGGER PARA AUMENTAR EL CONSECUTIVO DEL CENTRO UTILIZADO
                const nueva_requisicion = yield this._Query_Requisiciones.Buscar_Requisicion_ID(requisicion_enc[0].id_requisicion);
                if (!nueva_requisicion) {
                    return { error: true, message: 'No se ha encontrado la requisicion' }; //!ERROR
                }
                return nueva_requisicion;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: `Error al crear la requisicion ${requisicion_request.consecutivo}` }; //!ERROR
            }
        });
    }
    Buscar_Requisicion(id_requisicion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisicion = yield this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion);
                if (!requisicion) {
                    return { error: true, message: 'No se ha encontrado la requisicion' }; //!ERROR
                }
                return requisicion;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al encontrar la requisicion' };
            }
        });
    }
    Editar_Requisicion(id_requisicion, requisicion_request, usuario_modificacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const respuesta = yield this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion);
                if (!respuesta) {
                    return { error: true, message: 'No se ha encontrado la requisicion' }; //!ERROR
                }
                const req_enc = yield this._Query_Requisiciones.Editar_Requisicion_Enc(id_requisicion, requisicion_request);
                if ((req_enc === null || req_enc === void 0 ? void 0 : req_enc.rowCount) != 1) {
                    return { error: true, message: 'Error al actualizar la requisicion' }; //!ERROR
                }
                const { det_requisicion } = requisicion_request;
                if (det_requisicion) {
                    let detalle;
                    for (detalle of det_requisicion) {
                        if (detalle.id_detalle) {
                            // EDITAR DETALLE
                            const requisicion_det = yield this._Query_Requisiciones.Editar_Requisicion_Det(detalle, usuario_modificacion);
                            if (!requisicion_det) {
                                return { error: true, message: `Error al editar el detalle ${detalle.id_producto}` }; //!ERROR
                            }
                        }
                        else {
                            // INSERTAR DETALLE
                            const requisicion_det = yield this._Query_Requisiciones.Insertar_Requisicion_Det(detalle, id_requisicion, usuario_modificacion);
                            if (!requisicion_det) {
                                return { error: true, message: `Error al crear el detalle ${detalle.id_producto}` }; //!ERROR
                            }
                        }
                    }
                }
                else {
                    return { error: true, message: `Error al editar la requisicion ${requisicion_request.consecutivo}` }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al editar la requisicion' }; //!ERROR
            }
        });
    }
    Cambiar_Estado_Requisicion(id_requisicion, estado) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisicion_filtrada = yield this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion);
                if ((requisicion_filtrada === null || requisicion_filtrada === void 0 ? void 0 : requisicion_filtrada.length) <= 0) {
                    return { error: true, message: 'No se ha encontrado esta la requisicion' }; //!ERROR
                }
                const requisicion = yield this._Query_Requisiciones.Cambiar_Estado_Requisicion(id_requisicion, estado);
                if ((requisicion === null || requisicion === void 0 ? void 0 : requisicion.rowCount) != 1) {
                    return { error: true, message: 'Error al cambiar el estado de la requisicion' }; //!ERROR
                }
                return { error: false, message: '' }; //*SUCCESSFUL
            }
            catch (error) {
                console.log(error);
                return { error: true, message: 'Error al cambiar el estado de la requisicion' }; //!ERROR
            }
        });
    }
    Generar_PDF_Requisicion(id_requisicion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisicion = yield this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion);
                if (!requisicion) {
                    return { error: true, message: "No se ha encontrado la requisicion" };
                }
                // GENERAR PDFs
                const doc = new jspdf_1.jsPDF();
                // CABERZERA DOCUMENTO
                doc.setFontSize(12);
                doc.setFont('Arial', 'normal', 'normal');
                doc.rect(5, 5, 200, 30); // (x, y, ancho, alto)
                const imageData = fs_1.default.readFileSync('src/helpers/logo_empresa.png');
                doc.addImage(imageData, 'PNG', 5, 7, 53, 11);
                doc.line(59, 5, 59, 35);
                doc.setFont('Arial', 'normal', 'bold');
                doc.text('REQUISICIÓN DE COMPRA', 60, 10); // (texto, x, y)
                doc.setFont('Arial', 'normal', 'normal');
                doc.text(`${requisicion.requisicion}`, 90, 10); // (texto, x, y)
                doc.text(`${requisicion.fecha_requisicion.toLocaleString().split(',')[0]}`, 10, 30); // (texto, x, y)
                doc.text(`${requisicion.proceso}`, 10, 30); // (texto, x, y)
                doc.text(`${requisicion.centro_costo}`, 90, 30); // (texto, x, y)
                doc.rect(150, 26, 5, 5, `${requisicion.id_tipo_producto === 1 ? 'F' : 'S'}`); // (x, y, ancho, alto)
                doc.text('Material', 156, 30); // (texto, x, y)
                doc.rect(180, 26, 5, 5, `${requisicion.id_tipo_producto === 2 ? 'F' : 'S'}`); // (x, y, ancho, alto)
                doc.text(`Servicio`, 186, 30); // (texto, x, y)
                // DETALLES DE LA REQUISICION
                let Y_Init = 12;
                doc.rect(5, 37, 200, Y_Init); // (x, y, ancho, alto)
                doc.text('Detalles Requisicion', 83, 41.5);
                doc.line(5, 43, 205, 43); // (x1, y1, x2, y2)
                doc.text('Item', 6, 47);
                doc.line(15, 43, 15, 49); // (x1, y1, x2, y2)
                doc.text('Cod. Producto', 17.5, 47);
                doc.line(48, 43, 48, 49); // (x1, y1, x2, y2)
                doc.text('Nombre', 65, 47);
                doc.line(100, 43, 100, 49); // (x1, y1, x2, y2)
                doc.text('Cantidad', 102, 47);
                doc.line(121, 43, 121, 49); // (x1, y1, x2, y2)
                doc.text('Unid. Medida', 122, 47);
                doc.line(148, 43, 148, 49); // (x1, y1, x2, y2)
                doc.text('Justificación', 165, 47);
                if (requisicion.det_requisicion.length <= 0) {
                    doc.text('No hay productos en la requisición', 82, 43);
                }
                else {
                    // for(let detalle of requisicion.det_requisicion){
                    //     doc.text(`${detalle.nombre_producto}`, 71, 47)
                    // }
                }
                const pdfBase64 = doc.output('datauristring');
                return pdfBase64;
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.RequisicionesService = RequisicionesService;
