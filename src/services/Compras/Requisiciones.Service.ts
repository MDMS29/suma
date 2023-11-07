import QueryRequisiciones from "../../querys/Compras/QueryRequisiciones";
import { Requisicion_Det, Requisicion_Enc } from "../../validations/Types";

import { jsPDF } from "jspdf"

export class RequisicionesService {
    private _Query_Requisiciones: QueryRequisiciones;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Requisiciones = new QueryRequisiciones();
    }

    public async Obtener_Requisiciones(estado: number, empresa: number): Promise<any> {
        try {
            const requisiciones = await this._Query_Requisiciones.Obtener_Requisiciones_Enc(estado, empresa)
            if (requisiciones?.length <= 0) {
                return { error: false, message: 'No se han encontrado las requisicion' } //!ERROR
            }

            for (let requisicion_enc of requisiciones) {
                const det_requisicion = await this._Query_Requisiciones.Buscar_Detalle_Requisicion(requisicion_enc.id_requisicion)
                if (!det_requisicion) {
                    return { error: true, message: `Error al cargar los detalles de la requisicion ${requisicion_enc.requisicion}` } //!ERROR
                }

                requisicion_enc.det_requisicion = det_requisicion
            }

            return requisiciones
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las requisiciones' } //!ERROR
        }
    }

    public async Insertar_Requisicion(requisicion_request: Requisicion_Enc, usuario_creacion: string) {
        try {
            //TODO: ARREGLAR VALIDACION DE DATOS
            const requisicion_filtrada: any = await this._Query_Requisiciones.Buscar_Requisicion_Consecutivo(requisicion_request)
            if (requisicion_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe este consecutivo' } //!ERROR
            }

            // INSERTAR ENCABEZADO DE LA REQUISICION
            const requisicion_enc = await this._Query_Requisiciones.Insertar_Requisicion_Enc(requisicion_request, usuario_creacion)
            if (!requisicion_enc) {
                return { error: true, message: 'No se ha podido crear la requisicion' } //!ERROR
            }

            // INSERTAR DETALLES DE LA REQUISICION
            const { det_requisicion } = requisicion_request
            if (det_requisicion) {
                let detalle: Requisicion_Det
                for (detalle of det_requisicion) {
                    const requisicion_det = await this._Query_Requisiciones.Insertar_Requisicion_Det(detalle, requisicion_enc[0].id_requisicion, usuario_creacion)
                    if (!requisicion_det) {
                        return { error: true, message: `Error al insertar el producto ${detalle.id_producto}` } //!ERROR
                    }
                }
            } else {
                return { error: true, message: `Error al crear la requisicion ${requisicion_request.consecutivo}` } //!ERROR
            }

            // EN ESTE ESPACIO DE LINEA SE EJECUTA UN TRIGGER PARA AUMENTAR EL CONSECUTIVO DEL CENTRO UTILIZADO

            const nueva_requisicion = await this._Query_Requisiciones.Buscar_Requisicion_ID(requisicion_enc[0].id_requisicion)
            if (!nueva_requisicion) {
                return { error: true, message: 'No se ha encontrado la requisicion' } //!ERROR
            }

            return nueva_requisicion
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al crear la requisicion ${requisicion_request.consecutivo}` } //!ERROR
        }
    }

    public async Buscar_Requisicion(id_requisicion: number): Promise<any> {
        try {
            const requisicion = await this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion)
            if (!requisicion) {
                return { error: true, message: 'No se ha encontrado la requisicion' } //!ERROR
            }
            return requisicion
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la requisicion' }
        }
    }

    public async Editar_Requisicion(id_requisicion: number, requisicion_request: Requisicion_Enc, usuario_modificacion: string) {
        try {
            const respuesta: any = await this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion)

            if (!respuesta) {
                return { error: true, message: 'No se ha encontrado la requisicion' } //!ERROR
            }

            const req_enc = await this._Query_Requisiciones.Editar_Requisicion_Enc(id_requisicion, requisicion_request)
            if (req_enc?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar la requisicion' } //!ERROR
            }

            const { det_requisicion } = requisicion_request
            if (det_requisicion) {
                let detalle: Requisicion_Det
                for (detalle of det_requisicion) {
                    if (detalle.id_detalle) {
                        // EDITAR DETALLE
                        const requisicion_det = await this._Query_Requisiciones.Editar_Requisicion_Det(detalle, usuario_modificacion)
                        if (!requisicion_det) {
                            return { error: true, message: `Error al editar el detalle ${detalle.id_producto}` } //!ERROR
                        }
                    } else {
                        // INSERTAR DETALLE
                        const requisicion_det = await this._Query_Requisiciones.Insertar_Requisicion_Det(detalle, id_requisicion, usuario_modificacion)
                        if (!requisicion_det) {
                            return { error: true, message: `Error al crear el detalle ${detalle.id_producto}` } //!ERROR
                        }
                    }
                }
            } else {
                return { error: true, message: `Error al editar la requisicion ${requisicion_request.consecutivo}` } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar la requisicion' } //!ERROR
        }
    }
    public async Cambiar_Estado_Requisicion(id_requisicion: number, estado: number) {
        try {
            const requisicion_filtrada: any = await this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion)
            if (requisicion_filtrada?.length <= 0) {
                return { error: true, message: 'No se ha encontrado esta la requisicion' } //!ERROR
            }

            const requisicion = await this._Query_Requisiciones.Cambiar_Estado_Requisicion(id_requisicion, estado)
            if (requisicion?.rowCount != 1) {
                return { error: true, message: 'Error al cambiar el estado de la requisicion' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado de la requisicion' } //!ERROR
        }
    }


    public async Generar_PDF_Requisicion(id_requisicion: number) {

        try {
            const requisicion = await this._Query_Requisiciones.Buscar_Requisicion_ID(id_requisicion)
            if (!requisicion) {
                return { error: true, message: "No se ha encontrado la requisicion" }
            }

            // GENERAR PDFs
            const doc = new jsPDF();

            // CABERZERA DOCUMENTO
            doc.setFontSize(12)

            doc.rect(5, 5, 200, 30); // (x, y, ancho, alto)

            doc.text(`${requisicion.razon_social}`, 10, 10); // (texto, x, y)
            doc.text(`${requisicion.requisicion}`, 90, 10); // (texto, x, y)
            doc.text(`${requisicion.fecha_requisicion.toLocaleString().split(',')[0]}`, 150, 10); // (texto, x, y)

            doc.text(`${requisicion.proceso}`, 10, 30); // (texto, x, y)
            doc.text(`${requisicion.centro_costo}`, 90, 30); // (texto, x, y)


            doc.rect(150, 26, 5, 5, `${requisicion.id_tipo_producto === 1 ? 'F' : 'S'}`) // (x, y, ancho, alto)
            doc.text('Material', 156, 30); // (texto, x, y)

            doc.rect(180, 26, 5, 5, `${requisicion.id_tipo_producto === 2 ? 'F' : 'S'}`) // (x, y, ancho, alto)
            doc.text(`Servicio`, 186, 30); // (texto, x, y)

            // DETALLES DE LA REQUISICION
            let Y_Init = 12
            doc.rect(5, 37, 200, Y_Init); // (x, y, ancho, alto)
            doc.text('Detalles Requisicion', 83, 41.5)
            
            doc.line(5, 43, 205, 43) // (x1, y1, x2, y2)
            
            doc.text('Item', 6, 47)
            doc.line(15, 43, 15, 49) // (x1, y1, x2, y2)
            
            doc.text('Cod. Producto', 17.5, 47)
            doc.line(48, 43, 48, 49) // (x1, y1, x2, y2)
            
            doc.text('Nombre', 65, 47)
            doc.line(100, 43, 100, 49) // (x1, y1, x2, y2)
            
            doc.text('Cantidad', 102, 47)
            doc.line(121, 43, 121, 49) // (x1, y1, x2, y2)
            
            doc.text('Unid. Medida', 122, 47)
            doc.line(148, 43, 148, 49) // (x1, y1, x2, y2)
            
            doc.text('Justificación', 165, 47)
            
            if(requisicion.det_requisicion.length <= 0){
                doc.text('No hay productos en la requisición', 82, 43)
            }else{
                // for(let detalle of requisicion.det_requisicion){
                //     doc.text(`${detalle.nombre_producto}`, 71, 47)
                // }
            }



            const pdfBase64 = doc.output('datauristring');
            return pdfBase64

        } catch (error) {
            console.log(error)
            return
        }
    }
}