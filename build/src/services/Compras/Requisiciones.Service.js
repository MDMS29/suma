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
const mailer_1 = require("../../../config/mailer");
const constants_1 = require("../../helpers/constants");
const QuerysUsuario_1 = __importDefault(require("../../querys/Configuracion/QuerysUsuario"));
class RequisicionesService {
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Requisiciones = new QueryRequisiciones_1.default();
        this._Query_Usuarios = new QuerysUsuario_1.default();
    }
    Obtener_Requisiciones(estado, empresa, usuario, tipoFiltro, valor) {
        return __awaiter(this, void 0, void 0, function* () {
            const TIPOS_CONSULTA = {
                requisicion: 'requisicion'
            };
            try {
                let requisiciones;
                if (TIPOS_CONSULTA[tipoFiltro] == tipoFiltro) {
                    requisiciones = yield this._Query_Requisiciones.Requisiciones_Filtro_Change(estado, empresa, usuario, tipoFiltro, valor);
                }
                else {
                    requisiciones = yield this._Query_Requisiciones.Obtener_Requisiciones_Enc(estado, empresa, usuario);
                }
                if ((requisiciones === null || requisiciones === void 0 ? void 0 : requisiciones.length) <= 0) {
                    return { error: false, message: 'No se han encontrado las requisiciones' }; //!ERROR
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
    Obtener_Requisiciones_Filtro(estado, empresa, usuario, filtros) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.keys(filtros)) {
                    return { error: true, message: "No hay existen filtros a realizar" };
                }
                const requisiciones = yield this._Query_Requisiciones.Obtener_Requisiciones_Filtro(estado, empresa, usuario, filtros);
                if ((requisiciones === null || requisiciones === void 0 ? void 0 : requisiciones.length) === 0 || !requisiciones) {
                    return { error: true, message: "No se han encontrado las requisiciones" };
                }
                return requisiciones;
            }
            catch (error) {
                console.log(error);
                return { error: true, message: "Error al filtrar las requisiciones" };
            }
        });
    }
    Insertar_Requisicion(requisicion_request, usuario_creacion) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                //ENVIAR CORREO ELECTRONICO AL RESPONSABLE DEL CENTRO
                const correo_confir = yield mailer_1.transporter.sendMail({
                    from: '"SUMA" <mazomoises@gmail.com>',
                    to: nueva_requisicion.correo_responsable,
                    subject: `Nueva requisición ${nueva_requisicion.requisicion}`,
                    html: `
                        <div>
                            <p>Cordial saludo, ${nueva_requisicion.correo_responsable}!</p>
                            <br />
                            <p>Atentamente nos permitimos comunicarle que se ha creado una requisición dentro del Sistema Unificado de Mejora y Autogestión - <b>SUMA</b></p>
                            <p>Consecutivo: <strong> ${nueva_requisicion.requisicion} </strong></p>
                            <p>Fecha Creación: <strong> ${nueva_requisicion.fecha_creacion.toLocaleString().split(',')[0]} </strong></p>
                            <br />
                            <p>Puede revisar esta requisicion ingresando en nuestro Sistema <a href=${process.env.FRONT_END_URL}>por este link</a></p>
                            <p>Cordialmente,</p>
                            <br />
                            <img src="https://devitech.com.co/wp-content/uploads/2019/07/logo_completo.png" alt="Logo Empresa" />
                        </div>
                    `,
                });
                if (!correo_confir.accepted) {
                    return { error: true, message: 'Error al enviar correo de confirmación' }; //!ERROR
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
                        if (typeof detalle.id_detalle !== 'string') {
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
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const requisicion = yield this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion);
                if (!requisicion) {
                    return { error: true, message: "No se ha encontrado la requisicion" };
                }
                // INICIALIZAR LA LIBRERIA PARA CREAR EL PDF
                const doc = new jspdf_1.jsPDF({ orientation: 'l' });
                // CABECERA DOCUMENTO
                doc.setFontSize(12); // (size)
                doc.setFont('helvetica', 'normal', 'normal');
                // PIE DE CABEZA - CENTRO
                let HRectCabePie = 7; //ALTURA INICIAL DEL CUADRADO DE LA CABECERA
                let JumLine = 40; //POSICION INICIAL DEL SALTO DE LINEA
                let LineasDivCabe = 42; //POSICION INICIAL DEL SALTO DE LINEA
                //!ENCABEZADO DOCUMENTO
                // this.Generar_Cabecera_PDF(doc, requisicion, { HRectCabePie, JumLine, LineasDivCabe })
                const { fecha_requisicion, fecha_revision, usuario_revision, usuario_creacion, comentarios } = requisicion;
                //OBTENER EL USUARIO CREADOR Y EL QUE VERIFICO LA REQUISICION
                const usuario_r = yield this._Query_Usuarios.Buscar_Usuario_ID(usuario_revision);
                const usuario_c = yield this._Query_Usuarios.Buscar_Usuario_ID(usuario_creacion);
                // RECUADRO PARA LA CABECERA
                doc.rect(5, 5, 288, 30); // (x, y, ancho, alto)
                // CABECERA - IZQUIERDA
                const imageData = fs_1.default.readFileSync('src/helpers/imgs/logo_empresa.png');
                doc.addImage(imageData, 'PNG', 6.5, 10, 95, 13.5); // (dataImage, format, x, y, ancho, alto)
                doc.line(105, 5, 105, 42); //(x1, y1, x2, y2)
                // CABECERA - CENTRO
                doc.setFont('helvetica', 'normal', 'bold');
                doc.text('REQUISICIÓN DE COMPRA', 130, 22); // (texto, x, y)
                doc.line(215, 5, 215, 35); //(x1, y1, x2, y2)
                // CABECERA - DERECHA
                doc.setFont('helvetica', 'normal', 'normal');
                doc.text('Código:', 217, 10.2); // (texto, x, y)
                doc.line(215, 13, 293, 13); //(x1, y1, x2, y2)
                doc.setFont('helvetica', 'normal', 'normal');
                doc.text('Versión:', 217, 18); // (texto, x, y)
                doc.line(215, 20, 293, 20.5); //(x1, y1, x2, y2)
                doc.setFont('helvetica', 'normal', 'normal');
                doc.text('Fecha:', 217, 25); // (texto, x, y)
                doc.text(`${fecha_revision ? (_a = requisicion === null || requisicion === void 0 ? void 0 : requisicion.fecha_revision) === null || _a === void 0 ? void 0 : _a.toLocaleString().split(',')[0] : ''}`, 232, 25); // (texto, x, y)
                doc.line(215, 27, 293, 27.5); //(x1, y1, x2, y2)
                doc.setFont('helvetica', 'normal', 'normal');
                doc.text('Aprobado por:', 217, 32.5); // (texto, x, y)
                doc.text(`${usuario_r ? (_b = usuario_r[0]) === null || _b === void 0 ? void 0 : _b.nombre_completo : ''}`, 246, 32.5); // (texto, x, y)
                // PIE DE CABEZA - IZQUIERDA
                doc.text('Fecha', 7.5, 40); // (texto, x, y)
                doc.text(`${fecha_requisicion ? (_c = requisicion === null || requisicion === void 0 ? void 0 : requisicion.fecha_requisicion) === null || _c === void 0 ? void 0 : _c.toLocaleString().split(',')[0] : ''} -`, 24, 40); // (texto, x, y)
                doc.setFont('helvetica', 'normal', 'bold');
                doc.text(`${requisicion.requisicion}`, 48.5, 40); // (texto, x, y)
                doc.setFont('helvetica', 'normal', 'normal');
                doc.setFontSize(10);
                const textLines = doc.splitTextToSize(comentarios ? requisicion === null || requisicion === void 0 ? void 0 : requisicion.comentarios : '', 180);
                for (let line of textLines) {
                    doc.text(line, 109, JumLine);
                    if (textLines.length > 1) {
                        HRectCabePie += 3; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                        JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                        LineasDivCabe += 3; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                    }
                }
                doc.setFontSize(12); // (size)
                doc.rect(5, 35, 288, HRectCabePie); // (x, y, ancho, alto)
                doc.line(22, 35, 22, LineasDivCabe); //(x1, y1, x2, y2)
                doc.line(105, 35, 105, LineasDivCabe); //(x1, y1, x2, y2)
                // return doc
                // CUERPO DOCUMENTO - DETALLES REQUISICION
                let HRectCabePie2 = 16; //ALTURA INICIAL DEL CUADRADO DE LA CABECERA
                let LineasDivCuerpo = LineasDivCabe; //POSICION INICIAL DEL SALTO DE LINEA
                //!CABECERA CUERPO
                // this.Generar_Cuerpo_PDF(doc, { LineasDivCuerpo })
                doc.setFont('helvetica', 'normal', 'bold');
                doc.line(5, LineasDivCuerpo, 5, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Item', 9, LineasDivCuerpo + 7); // (texto, x, y)
                doc.line(22, LineasDivCuerpo, 22, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Referencia', 27, LineasDivCuerpo + 7);
                doc.line(54, LineasDivCuerpo, 54, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Nombre', 70, LineasDivCuerpo + 7);
                doc.line(105, LineasDivCuerpo, 105, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Cantidad', 107.5, LineasDivCuerpo + 7);
                doc.line(128, LineasDivCuerpo, 128, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Unidad', 131, LineasDivCuerpo + 7);
                doc.line(148, LineasDivCuerpo, 148, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Justificación', 168, LineasDivCuerpo + 7);
                doc.line(215, LineasDivCuerpo, 215, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('Aprobado', 224, LineasDivCuerpo + 4.5);
                doc.line(250, LineasDivCuerpo, 250, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.line(215, LineasDivCuerpo + 6, 250, LineasDivCuerpo + 6); // (x1, y1, x2, y2) LINEA DIVISIORA ( SI - NO )
                doc.text('Si', 223, LineasDivCuerpo + 10.5);
                doc.line(233, LineasDivCuerpo + 6, 233, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.text('No', 239, LineasDivCuerpo + 10.5);
                doc.text('No. Orden', 261, LineasDivCuerpo + 7);
                doc.line(293, LineasDivCuerpo, 293, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                doc.line(5, LineasDivCuerpo + 11.5, 293, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2) LINEA DIVISIORA
                doc.setFont('helvetica', 'normal', 'normal');
                let Y = LineasDivCuerpo + 16; // Inicializa la posición vertical
                let LinesH = LineasDivCuerpo;
                const lineHeight = 4; // Altura de línea estimada
                let item = 0;
                let limitePag = 180;
                //! FILAS DINAMICAS DE CADA UNO DE LOS DETALLES 
                // this.Generar_Filas_Dinamicas_PDF(doc, requisicion, { Y, LinesH, lineHeight, item, limitePag, HRectCabePie2, LineasDivCuerpo })
                if (requisicion.det_requisicion.length <= 0) {
                    doc.text('No hay productos en la requisición', 82, 43);
                }
                else {
                    for (let detalle of requisicion.det_requisicion) {
                        item += 1;
                        if (item > 1) {
                            // INSERTAR LA LINEA DIVISORA ENTRE CADA FILA
                            doc.line(5, Y, 293, Y); // LINEA
                            Y += 5;
                            HRectCabePie2 += 5;
                        }
                        doc.setFontSize(10);
                        doc.text(`${item} `, 11.5, Y);
                        doc.text(`${detalle.referencia} `, 30, Y);
                        doc.text(`${detalle.cantidad} `, 115, Y);
                        doc.text(`${detalle.unidad} `, 129, Y);
                        switch (detalle.id_estado) {
                            case 4:
                                doc.text('X', 223, Y + 2);
                                break;
                            case 5:
                                doc.text('X', 240, Y + 2);
                                break;
                            default:
                                console.log('estado indefinido');
                                break;
                        }
                        const textLinesNombre = doc.splitTextToSize(detalle.nombre_producto, 45);
                        const textLinesJustifi = doc.splitTextToSize(detalle.justificacion, 70);
                        let lastY = Y;
                        if (textLinesJustifi.length < textLinesNombre.length) {
                            for (let line of textLinesNombre) {
                                doc.text(line, 57, Y);
                                Y += lineHeight; // Aumenta la posición vertical para la siguiente línea
                                HRectCabePie2 += lineHeight; //AUMENTA EL TAMAÑO DEL CUADRO DEL CUERPO
                            }
                            for (let line of textLinesJustifi) {
                                doc.setFontSize(10);
                                doc.text(line, 149, lastY);
                                lastY += lineHeight;
                                doc.setFontSize(12);
                            }
                        }
                        else {
                            for (let line of textLinesNombre) {
                                doc.text(line, 57, lastY);
                                lastY += lineHeight;
                            }
                            for (let line of textLinesJustifi) {
                                doc.text(line, 149, Y);
                                Y += lineHeight; // Aumenta la posición vertical para la siguiente línea
                                HRectCabePie2 += lineHeight; //AUMENTA EL TAMAÑO DEL CUADRO DEL CUERPO
                            }
                        }
                        doc.setFontSize(12);
                        doc.line(5, LinesH, 5, Y); // (x1, y1, x2, y2)
                        doc.line(22, LinesH, 22, Y); // (x1, y1, x2, y2)
                        doc.line(54, LinesH, 54, Y); // (x1, y1, x2, y2)
                        doc.line(105, LinesH, 105, Y); // (x1, y1, x2, y2)
                        doc.line(128, LinesH, 128, Y); // (x1, y1, x2, y2)
                        doc.line(148, LinesH, 148, Y); // (x1, y1, x2, y2)
                        doc.line(215, LinesH, 215, Y); // (x1, y1, x2, y2)
                        doc.line(233, LinesH + 6.5, 233, Y); // (x1, y1, x2, y2)
                        doc.line(250, LinesH, 250, Y); // (x1, y1, x2, y2)
                        doc.line(293, LinesH, 293, Y); // (x1, y1, x2, y2)
                        doc.line(5, Y, 293, Y); // (x1, y1, x2, y2)
                        if (limitePag < Y) {
                            doc.addPage();
                            limitePag += limitePag;
                            Y = LineasDivCuerpo + 11; // Inicializa la posición vertical
                            // LinesH = LineasDivCuerpo
                            // doc.line(5, LinesH, 5, Y) // (x1, y1, x2, y2)
                            // doc.line(22, LinesH, 22, Y) // (x1, y1, x2, y2)
                            // doc.line(54, LinesH, 54, Y) // (x1, y1, x2, y2)
                            // doc.line(105, LinesH, 105, Y) // (x1, y1, x2, y2)
                            // doc.line(128, LinesH, 128, Y) // (x1, y1, x2, y2)
                            // doc.line(148, LinesH, 148, Y) // (x1, y1, x2, y2)
                            // doc.line(215, LinesH, 215, Y) // (x1, y1, x2, y2)
                            // doc.line(250, LinesH, 250, Y) // (x1, y1, x2, y2)
                            // doc.line(233, LinesH + 6.5, 233, Y) // (x1, y1, x2, y2)
                            // PIE DE CABEZA - CENTRO
                            HRectCabePie = 7; //ALTURA INICIAL DEL CUADRADO DE LA CABECERA
                            JumLine = 40; //POSICION INICIAL DEL SALTO DE LINEA
                            LineasDivCabe = 42; //POSICION INICIAL DEL SALTO DE LINEA
                            //!ENCABEZADO DOCUMENTO
                            // this.Generar_Cabecera_PDF(doc, requisicion, { HRectCabePie, JumLine, LineasDivCabe })
                            // RECUADRO PARA LA CABECERA
                            doc.rect(5, 5, 288, 30); // (x, y, ancho, alto)
                            // CABECERA - IZQUIERDA
                            const imageData = fs_1.default.readFileSync('src/helpers/imgs/logo_empresa.png');
                            doc.addImage(imageData, 'PNG', 6.5, 10, 95, 13.5); // (dataImage, format, x, y, ancho, alto)
                            doc.line(105, 5, 105, 42); //(x1, y1, x2, y2)
                            // CABECERA - CENTRO
                            doc.setFont('helvetica', 'normal', 'bold');
                            doc.text('REQUISICIÓN DE COMPRA', 130, 22); // (texto, x, y)
                            doc.line(215, 5, 215, 35); //(x1, y1, x2, y2)
                            // CABECERA - DERECHA
                            doc.setFont('helvetica', 'normal', 'normal');
                            doc.text('Código:', 217, 10.2); // (texto, x, y)
                            doc.line(215, 13, 293, 13); //(x1, y1, x2, y2)
                            doc.setFont('helvetica', 'normal', 'normal');
                            doc.text('Versión:', 217, 18); // (texto, x, y)
                            doc.line(215, 20, 293, 20.5); //(x1, y1, x2, y2)
                            doc.setFont('helvetica', 'normal', 'normal');
                            doc.text('Fecha:', 217, 25); // (texto, x, y)
                            doc.text(`${fecha_revision ? (_d = requisicion === null || requisicion === void 0 ? void 0 : requisicion.fecha_revision) === null || _d === void 0 ? void 0 : _d.toLocaleString().split(',')[0] : ''}`, 232, 25); // (texto, x, y)
                            doc.line(215, 27, 293, 27.5); //(x1, y1, x2, y2)
                            doc.setFont('helvetica', 'normal', 'normal');
                            doc.text('Aprobado por:', 217, 32.5); // (texto, x, y)
                            doc.text(`${usuario_r ? usuario_r === null || usuario_r === void 0 ? void 0 : usuario_r.nombre_completo : ''}`, 246, 32.5); // (texto, x, y)
                            // PIE DE CABEZA - IZQUIERDA
                            doc.text('Fecha', 7.5, 40); // (texto, x, y)
                            doc.text(`${fecha_requisicion ? (_e = requisicion === null || requisicion === void 0 ? void 0 : requisicion.fecha_requisicion) === null || _e === void 0 ? void 0 : _e.toLocaleString().split(',')[0] : ''} -`, 24, 40); // (texto, x, y)
                            doc.setFont('helvetica', 'normal', 'bold');
                            doc.text(`${requisicion.requisicion}`, 48.5, 40); // (texto, x, y)
                            doc.setFont('helvetica', 'normal', 'normal');
                            doc.setFontSize(10);
                            const textLines = doc.splitTextToSize(comentarios ? requisicion === null || requisicion === void 0 ? void 0 : requisicion.comentarios : '', 180);
                            for (let line of textLines) {
                                doc.text(line, 109, JumLine);
                                if (textLines.length > 1) {
                                    HRectCabePie += 3; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                                    JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                                    LineasDivCabe += 3; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                                }
                            }
                            doc.setFontSize(12); // (size)
                            doc.rect(5, 35, 288, HRectCabePie); // (x, y, ancho, alto)
                            doc.line(22, 35, 22, LineasDivCabe); //(x1, y1, x2, y2)
                            doc.line(105, 35, 105, LineasDivCabe); //(x1, y1, x2, y2)
                            // CUERPO DOCUMENTO - DETALLES REQUISICION
                            HRectCabePie2 = 16; //ALTURA INICIAL DEL CUADRADO DE LA CABECERA
                            LineasDivCuerpo = LineasDivCabe; //POSICION INICIAL DEL SALTO DE LINEA
                            //!CABERCERA CUERPO
                            // this.Generar_Cuerpo_PDF(doc, { LineasDivCuerpo })
                            doc.setFont('helvetica', 'normal', 'bold');
                            doc.line(5, LineasDivCuerpo, 5, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Item', 9, LineasDivCuerpo + 7); // (texto, x, y)
                            doc.line(22, LineasDivCuerpo, 22, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Referencia', 27, LineasDivCuerpo + 7);
                            doc.line(54, LineasDivCuerpo, 54, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Nombre', 70, LineasDivCuerpo + 7);
                            doc.line(105, LineasDivCuerpo, 105, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Cantidad', 107.5, LineasDivCuerpo + 7);
                            doc.line(128, LineasDivCuerpo, 128, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Unidad', 131, LineasDivCuerpo + 7);
                            doc.line(148, LineasDivCuerpo, 148, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Justificación', 168, LineasDivCuerpo + 7);
                            doc.line(215, LineasDivCuerpo, 215, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('Aprobado', 224, LineasDivCuerpo + 4.5);
                            doc.line(250, LineasDivCuerpo, 250, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.line(215, LineasDivCuerpo + 6, 250, LineasDivCuerpo + 6); // (x1, y1, x2, y2) LINEA DIVISIORA ( SI - NO )
                            doc.text('Si', 223, LineasDivCuerpo + 10.5);
                            doc.line(233, LineasDivCuerpo + 6, 233, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            doc.text('No', 239, LineasDivCuerpo + 10.5);
                            doc.text('No. Orden', 261, LineasDivCuerpo + 7);
                            doc.line(293, LineasDivCuerpo, 293, LineasDivCuerpo + 11.5); // (x1, y1, x2, y2)
                            // doc.line(5, LineasDivCuerpo + 11.5, 293, LineasDivCuerpo + 11.5) // (x1, y1, x2, y2) LINEA DIVISIORA
                            doc.setFont('helvetica', 'normal', 'normal');
                        }
                    }
                }
                doc.text('APROBADO POR: ____________________________________', 149, 190);
                doc.text(`${usuario_r[0] ? (_f = usuario_r[0]) === null || _f === void 0 ? void 0 : _f.nombre_completo : ''}`, 187, 190); // (texto, x, y)
                doc.text('ELABORADO POR: ____________________________________', 5, 190);
                doc.text(`${usuario_c[0] ? (_g = usuario_c[0]) === null || _g === void 0 ? void 0 : _g.nombre_completo : ''}`, 45, 190); // (texto, x, y)
                const pdfBase64 = doc.output('datauristring');
                return { data: pdfBase64, nombre: requisicion.requisicion };
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
    Aprobar_Desaprobar_Detalle(id_requisicion, detalles, usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const estados_det_requi = { '3': true, '4': true, '5': true };
            try {
                const requisicion = yield this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion);
                if (!requisicion.id_requisicion) {
                    return { error: true, message: 'No se ha encontrado esta requisicion' };
                }
                if (!usuario) {
                    return { error: true, message: 'No se ha podido encontrar el usuario' };
                }
                // EDITAR EL USUARIO QUE REVISA LA REQUISICION
                const requisicion_edit = yield this._Query_Requisiciones.Editar_Usuario_Revi_Requisicion(id_requisicion, usuario.id_usuario);
                if ((requisicion_edit === null || requisicion_edit === void 0 ? void 0 : requisicion_edit.rowCount) !== 1) {
                    return { error: true, message: 'Error al editar el usuario que califica la requisicion' };
                }
                // CALIFICAR DETALLES
                for (let detalle of detalles) {
                    // VERIFICAR SI EL DETALLE PERTENECE A LA REQUISICION
                    const detalle_verifi = yield this._Query_Requisiciones.Buscar_Detalle_ID(detalle.id_detalle);
                    if (detalle_verifi.id_requisicion !== id_requisicion) {
                        return { error: true, message: `El detalle ${detalle.id_detalle} no pertenece a la requisicion` };
                    }
                    // VERIFICAR SI EL ESTADO ESTA PARAMETRIZADO
                    if (!estados_det_requi[detalle.id_estado]) {
                        return { error: true, message: `El estado del detalle ${detalle.id_detalle} no es aceptable` };
                    }
                    const detalle_cam = yield this._Query_Requisiciones.Aprobar_Desaprobar_Detalle(detalle);
                    if ((detalle_cam === null || detalle_cam === void 0 ? void 0 : detalle_cam.rowCount) !== 1) {
                        return { error: true, message: `Error al cambiar el estado del detalle ${detalle.id_detalle}` };
                    }
                }
                const requisicion_verificada = yield this._Query_Requisiciones.Cambiar_Estado_Requisicion(id_requisicion, constants_1.EstadosTablas.ESTADO_VERIFICADO);
                if ((requisicion_verificada === null || requisicion_verificada === void 0 ? void 0 : requisicion_verificada.rowCount) != 1) {
                    return { error: true, message: 'Error al cambiar el estado de la requisicion' };
                }
                return { error: false, message: 'Se han calificado los detalles' };
            }
            catch (error) {
                console.log(error);
                return;
            }
        });
    }
}
exports.RequisicionesService = RequisicionesService;
