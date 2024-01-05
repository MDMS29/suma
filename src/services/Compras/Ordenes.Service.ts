import jsPDF from "jspdf";
import { Encabezado_Orden, Filtro_Ordenes } from "../../Interfaces/Compras/ICompras";
import { EstadosTablas } from "../../helpers/constants";
import QueryOrdenes from "../../querys/Compras/QueryOrdenes";
import Querys from "../../querys/Querys";
import { RequisicionesService } from "./Requisiciones.Service";
import { transporter } from "../../config/mailer";
import { MessageError } from "../../Interfaces/Configuracion/IConfig";
import { formatear_cantidad } from "../../helpers/utils";

import fs from "node:fs"

export class OrdenesService {
    _Query_Ordenes: QueryOrdenes;
    _QuerysG: Querys;
    _Service_Requisicion: RequisicionesService;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Ordenes = new QueryOrdenes();
        this._QuerysG = new Querys();
        this._Service_Requisicion = new RequisicionesService();
    }


    private async Enviar_Correo(orden: Encabezado_Orden, correo_responsables: string[], pdf: string): Promise<MessageError> {
        const correo_confir = await transporter.sendMail({
            from: `"SUMA" <${process.env.MAILER_USER}>`,
            to: correo_responsables,
            subject: `Confirmación de Aprobación de Orden ${orden.orden}`,
            html: `
                <div>
                    <p>Cordial saludo!</p>
                    <br />
                    <p>Es un placer informarle que su orden ha sido revisada y aprobada con éxito. Nos complace confirmar que todos los detalles de la orden han sido verificados.</p>
                    <p>A continuación, se detallan los elementos clave de su orden:</p>
                    <p>Número de Orden: <strong> ${orden.orden} </strong></p>
                    <p>Fecha de Aprobacion: <strong> ${orden.fecha_entrega} </strong></p>
                    <p>Total de la Orden: <strong> ${formatear_cantidad(orden.total_orden ?? 0)} </strong></p>
                    <p>Por favor, tenga en cuenta que este correo electrónico sirve como confirmación oficial de la aprobación de su orden.</p>
                    <p>Si tiene alguna pregunta o necesita más información, no dude en responder a este correo electrónico.</p>
                    <br />
                    
                    <p>Atentamente,</p>
                    <br />
                    <p><strong>SUMA</strong></p>
                    <p>Sistema Unificado de Mejora y Autogestión</p>
                    <p><strong>Devices & Technology</strong></p>
                    <p>proyecto.suma@devitech.com.co</p>

                    <img src="https://devitech.com.co/wp-content/uploads/2019/07/logo_completo.png" alt="Logo Empresa" />
                </div>
            `,
            attachments: [
                // ENVIAR ARCHIVOS
                {
                    filename: `Orden - ${orden.orden}`,
                    path: pdf
                }
            ]
        });
        if (!correo_confir.accepted) {
            return { error: true, message: 'Error al enviar correo de confirmación' }; //!ERROR
        }

        return { error: false, message: '' }
    }

    public async Obtener_Ordenes_Filtro(estado: string, empresa: number, usuario: string, filtros: Partial<Filtro_Ordenes>) {
        let ordenes
        try {
            if (!Object.keys(filtros)) {
                return { error: true, message: "No hay existen filtros a realizar" }
            }


            ordenes = await this._Query_Ordenes.Obtener_Ordenes_Filtro(estado, empresa, usuario, filtros)


            if (ordenes?.length === 0 || !ordenes) {
                return { error: true, message: "No se han encontrado ordenes con estos criterios" }
            }

            return ordenes

        } catch (error) {
            console.log(error)
            return { error: true, message: "Error al filtrar las ordenes" }
        }
    }

    async Obtener_Ordenes(empresa: string, estado: string, inputs: string) {
        try {
            const respuesta: any = await this._Query_Ordenes.Obtener_Ordenes(empresa, estado, inputs)
            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado ordenes' } //!ERROR
            }
            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las ordenes' } //!ERROR
        }
    }

    public async Insertar_Orden(req_body: Encabezado_Orden, usuario_id: string) {
        try {
            const numero_orden = await this._Query_Ordenes.Buscar_Numero_Orden(req_body)
            if (numero_orden && numero_orden?.length > 0) {
                return { error: true, message: `Ya existe el numero de orden ${req_body.orden}` } //!ERROR
            }

            try {
                const direccion_insertada = await this._QuerysG.Insertar_Direccion(req_body.lugar_entrega)
                if (direccion_insertada.length <= 0) {
                    return { error: true, message: 'Error al insertar la dirección' } //!ERROR
                }

                req_body.lugar_entrega = direccion_insertada[0].id_direccion

                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Insertar_Orden_Encabezado(req_body, 0, usuario_id)
                if (!orden) {
                    return { error: true, message: `Error al insertar la orden ${req_body.orden}` } //!ERROR
                }

                ///INSERTAR DETALLES DE LA ORDEN
                for (let detalle of req_body.detalles_orden) {

                    const orden_detalle = await this._Query_Ordenes.Insertar_Orden_Detalle(detalle, orden[0].id_orden)
                    if (orden_detalle?.length == 0 && !orden_detalle) {
                        return { error: true, message: 'Error al insertar los detalles' } //!ERROR
                    }
                }

                const orden_insertada: any = await this._Query_Ordenes.Buscar_Orden_ID(orden[0].id_orden, req_body.id_empresa)
                if (orden_insertada?.length <= 0) {
                    return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
                }

                return orden_insertada[0]

            } catch (error) {
                console.log(error)
                return
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al insertar la orden ${req_body.orden}` } //!ERROR
        }
    }

    public async Buscar_Orden(id_orden: number, id_empresa: number) {
        try {
            const respuesta: any = await this._Query_Ordenes.Buscar_Orden_ID(id_orden, id_empresa)
            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden(id_orden)
            if (dellate_orden && dellate_orden?.length <= 0) {
                return { error: true, message: 'No se han encontrado los detalle de la orden' } //!ERROR
            }

            respuesta[0].detalles_orden = dellate_orden

            return respuesta[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la orden' } //!ERROR
        }
    }

    public async Editar_Orden(req_body: Encabezado_Orden, id_orden: number) {
        try {
            const numero_orden = await this._Query_Ordenes.Buscar_Numero_Orden(req_body)
            if (numero_orden && numero_orden?.length > 0 && id_orden !== numero_orden[0].id_orden) {
                return { error: true, message: `Ya existe el numero de orden ${req_body.orden}` } //!ERROR
            }

            const direccion_editada = await this._QuerysG.Editar_Direccion(req_body.lugar_entrega.id_lugar_entrega ?? 0, req_body.lugar_entrega)
            if (direccion_editada !== 1) {
                return { error: true, message: 'Error al editar la dirección' } //!ERROR
            }


            try {
                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Editar_Orden_Encabezado(req_body, 0, id_orden)
                if (orden !== 1) {
                    return { error: true, message: `Error al editar la orden ${req_body.orden}` } //!ERROR
                }

                ///INSERTAR DETALLES DE LA ORDEN
                for (let detalle of req_body.detalles_orden) {
                    // BUSCAR SI EL DETALLE DE LA ORDEN YA EXISTE
                    const existe_detalle = await this._Query_Ordenes.Buscar_Detalle_Orden(id_orden)

                    const esDetalle = existe_detalle.filter(ex_detalle => ex_detalle.id_detalle == detalle.id_detalle)
                    if (esDetalle.length > 0) {
                        // SI EXISTE EL DETALLE EN LA ORDEN LO EDITARA
                        const orden_detalle = await this._Query_Ordenes.Editar_Detalle_Orden(detalle)
                        if (orden_detalle !== 1 && !orden_detalle) {
                            return { error: true, message: `Error al editar los detalles de la orden ${req_body.orden}` } //!ERROR
                        }
                    } else {
                        // SI EL DETALLE NO EXISTE LO INSERTA
                        const orden_detalle = await this._Query_Ordenes.Insertar_Orden_Detalle(detalle, id_orden)
                        if (orden_detalle?.length == 0 && !orden_detalle) {
                            return { error: true, message: 'Error al insertar los detalles' } //!ERROR
                        }
                    }

                }

                const orden_editada: any = await this._Query_Ordenes.Buscar_Orden_ID(id_orden, req_body.id_empresa)
                if (orden_editada?.length <= 0) {
                    return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
                }
                return orden_editada[0]

            } catch (error) {
                console.log(error)
                return
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al insertar la orden ${req_body.orden}` } //!ERROR
        }
    }

    public async Eliminar_Restaurar_Orden(id_orden: number, id_estado: number) {
        try {
            const respuesta: any = await this._Query_Ordenes.Eliminar_Restaurar_Orden(id_orden, id_estado)
            if (respuesta != 1) {
                return { error: true, message: 'Error al cambiar el estado de la orden' } //!ERROR
            }

            return { error: true, message: id_estado == EstadosTablas.ESTADO_ANULADO ? 'Se ha anulado la orden' : 'Se ha aprobado la orden' } //!ERROR
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado de la orden' } //!ERROR
        }
    }

    public async Aprobar_Orden(id_orden: number, empresa_id: number, usuario_id: number) {
        try {
            let array_requisiciones: { id_requisicion: number, requisicion: string }[] = []

            const [orden_aprobar] = await this._Query_Ordenes.Buscar_Orden_ID(id_orden, empresa_id)
            if (!orden_aprobar) {
                return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden_Pendientes(id_orden)
            if (dellate_orden && dellate_orden?.length <= 0) {
                return { error: true, message: `No se han encontrado los detalle de la orden ${orden_aprobar.orden}` } //!ERROR
            }

            orden_aprobar.detalles_orden = dellate_orden

            try {
                for (let detalle of orden_aprobar.detalles_orden) {
                    type TProductosPpendiente = {
                        id_producto: number;
                        nombre_producto: string;
                        productos_pendientes: number;
                    };

                    // --- COMPROBAR QUE LOS PRODUCTOS PENDIENTES SEA VALIDO CON RESPECTO A LOS DETALLES DE LA ORDEN ---
                    // ---BUSCAR LOS PRODUCTO PENDIENTES
                    const productos_pendientes = await this._Service_Requisicion.Buscar_Requisicion(detalle.id_requisicion, true)

                    // VALIDAR QUE EL PRODUCTO SI TENGA PENDIENTES
                    const producto_pendiente = productos_pendientes.filter((producto: TProductosPpendiente) => producto.id_producto == detalle.id_producto)
                    //EL PRODUCTO NO TIENE PENDIENTES - DEVOLVER ERROR
                    if (producto_pendiente.length <= 0) {
                        return { error: true, message: `El producto "${detalle.producto}" no tiene pendientes` } //!ERROR
                    }

                    // VALIDAR QUE LA CANTIDAD NO PASE DE LOS PRODUCTOS PENDIENTES
                    const pendiente = productos_pendientes.filter((producto: TProductosPpendiente) => producto.id_producto === detalle.id_producto && producto.productos_pendientes < detalle.cantidad)
                    //LA CANTIDAD REQUEST ES MAYOR A LA CANTIDAD DE LOS PENDIENTES - DEVOLVER ERROR
                    if (pendiente.length > 0) {
                        return { error: true, message: `La cantidad del producto "${detalle.producto}" debe ser menor o igual a ${pendiente[0].productos_pendientes}` } //!ERROR
                    }
                    // --- FIN DE VALIDACIONES PARA LOS PRODUCTOS PENDIENTES ---

                    //APROBAR EL DETALLE DE LA ORDEN
                    const detalle_aprobado = await this._Query_Ordenes.Aprobar_Detalle(detalle.id_detalle, EstadosTablas.ESTADO_APROBADO)
                    if (detalle_aprobado !== 1) {
                        return { error: true, message: `Error al aprobar el detalle de la orden ${orden_aprobar.orden}` } //!ERROR
                    }

                    array_requisiciones.push({ id_requisicion: detalle.id_requisicion, requisicion: detalle.requisicion })
                }

                // APROBAR EL ENCABEZADO DE LA ORDEN
                const aprobar_encabezado_orden = await this._Query_Ordenes.Aprobar_Encabezado_Orden(id_orden, EstadosTablas.ESTADO_APROBADO, usuario_id)
                if (aprobar_encabezado_orden !== 1) {
                    return { error: true, message: `Error al aprobar la orden ${orden_aprobar.orden}` } //!ERROR
                }

                //? OBTENER LOS CORREOS DE LOS RESPONSABLES DE LOS CENTROS DE COSTO DE LAS REQUISICIONES
                const correo_responsables = await this._Service_Requisicion.Obtener_Correo_Responsables(array_requisiciones)
                if ('error' in correo_responsables) {
                    return correo_responsables
                }

                //? GENERAR PDF DE LA ORDEN PARA ENVIAR
                const pdf = this.Generar_PDF_Orden(orden_aprobar)
                if (!pdf) {
                    return { error: true, message: `Error al generar documento - Orden ${orden_aprobar.orden}` } //!ERROR
                }

                //?ENVIAR CORREO DE CONFIRMACIÓN
                const es_correo = await this.Enviar_Correo(orden_aprobar, correo_responsables, pdf)
                if (es_correo.error) {
                    return es_correo
                }

                return { error: false, message: `Se ha aprobado la orden ${orden_aprobar.orden}` }

            } catch (error) {
                console.log(error)
                return { error: true, message: `Error al aprobar la orden ${orden_aprobar.orden}` } //!ERROR
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al aprobar la orden` } //!ERROR
        }
    }

    //INVOCA EL PDF Y LO REUTILIZA
    public async Generar_Documento_Orden(id_orden: number, id_empresa: number) {
        try {
            const [orden] = await this._Query_Ordenes.Buscar_Encabezado_Doc(id_orden, id_empresa)
            if (!orden) {
                return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden_Doc(id_orden)
            if (dellate_orden && dellate_orden?.length <= 0) {
                return { error: true, message: `No se han encontrado los detalle de la orden ${orden.orden}` } //!ERROR
            }

            let iva_total = 0
            let descuento_total = 0
            let subtotal = 0
            for (let detalle of dellate_orden) {
                const { cantidad, precio_compra, porcentaje, descuento } = detalle

                let subtotal_local = cantidad * precio_compra
                let iva_local = subtotal_local * (porcentaje / 100)

                let total_local = subtotal_local + iva_local

                // SUBTOTAL GLOBAL
                subtotal = subtotal_local + subtotal

                // IVA GLOBAL
                iva_total = iva_total + iva_local

                // DESCUENTO GLOBAL
                descuento_total = descuento + descuento_total

                // AGREGAR AL DETALLE EL CALCULO LOCAL
                detalle.total_detalle = total_local
            }


            orden.subtotal = subtotal
            orden.descuento_total = descuento_total
            orden.iva_total = iva_total
            orden.detalle_orden = dellate_orden

            const pdf = this.Generar_PDF_Orden(orden)
            if (!pdf) {
                return { error: true, message: `Error al generar documento - Orden ${orden.orden}` } //!ERROR
            }

            return { data: pdf, nombre: orden.orden }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al generar el documento de la orden' } //!ERROR
        }
    }

    // GENERA EL PDF Y RETORNA EL BASE64
    private Generar_PDF_Orden(orden: Encabezado_Orden) {

        // INICIALIZAR LA LIBRERIA PARA CREAR EL PDF
        const doc = new jsPDF({ orientation: 'l' });

        // CABECERA DOCUMENTO
        doc.setFontSize(12) // (size)
        doc.setFont('helvetica', 'normal', 'normal')

        //!ENCABEZADO DOCUMENTO

        console.log('------------------ORDEN ----------------\n', orden)
        // RECUADRO PARA LA CABECERA

        // CABECERA - IZQUIERDA
        const imageData = fs.readFileSync('resources/logo_empresa_short.png')

        doc.addImage(imageData, 'PNG', 14, 10, 30, 13.5)

        //TITULO DE LA ORDEN
        doc.setFont('helvetica', 'normal', 'bold')
        doc.text("ORDEN DE COMPRA", 120, 20);

        //CABECERA DE LA ORDEN
        doc.rect(20, 30, 260, 38);

        //doc.line(20, 30, 20, 200)  //vertical
        doc.line(150, 30, 150, 68)

        doc.text('Proveedor:', 21, 36); // (texto, x, y)
        doc.line(20, 38, 280, 38) // horizontal

        doc.text('Dirección:', 21, 44);
        doc.line(20, 46, 280, 46) // horizontal

        doc.text('Telefono:', 21, 52);
        doc.line(20, 54, 280, 54)

        doc.text('Lugar de entrega:', 21, 63);

        doc.line(240, 30, 240, 68)

        doc.text('Forma de pago:', 172, 36);

        doc.text('Fecha de compra', 170, 45);

        doc.text('Fecha de entrega', 170, 52);

        doc.text('No. Cotizacion', 174, 63);

        doc.text('Efectivo', 250, 36);

        doc.text('04/01/2024', 248, 45);
        doc.text('04/01/2024', 248, 52);

        doc.text('COT.# 890518', 246, 63);

        doc.rect(20, 68, 260, 9);

        doc.setFontSize(10)
        doc.text('Con base en la cotizacion presentada por su empresa DEVICES & TECHNOLOGY, sírvase remitir los bienes o servicios que a continuación se detallan', 21, 75);

        doc.rect(20, 77, 260, 10);

        //PRODUCTOS/SERVICIOS DE LA ORDEN

        doc.line(45, 77, 45, 87)
        doc.text('Requisición', 22, 83);

        doc.line(68, 77, 68, 87)
        doc.text('Item', 53, 83);

        doc.line(103, 77, 103, 87)
        doc.text('Descripcion', 76, 83);

        doc.line(121, 77, 121, 87)
        doc.text('Unidad', 106, 83);

        doc.line(141, 77, 141, 87)
        doc.text('Cantidad', 123, 83);

        doc.line(178, 77, 178, 107)
        doc.text('Precio Unitario', 148, 83);

        doc.line(206, 77, 206, 107)
        doc.text('Descuento', 183, 83);

        doc.line(229, 137, 229, 77)
        doc.text('Subtotal', 212, 83);

        doc.line(255, 137, 255, 77)
        doc.text('IVA', 238, 83);

        doc.text('Precio Total', 258, 83);

        doc.rect(20, 87, 260, 20)

        doc.line(45, 107, 45, 87)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('2704022 ', 22, 98); //NUMERO DE REQUISICIÓN


        doc.line(68, 107, 68, 87)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('76381', 52, 98); //ID DEL PRODUCTO

        doc.line(103, 107, 103, 87)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('Aire Acondicionado', 71, 98); //NOMBRE DEL PRODUCTO

        doc.line(121, 107, 121, 87)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('Uni', 106, 98); //UNIDAD

        doc.line(141, 107, 141, 87)
        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('1', 123, 98); // CANTIDAD

        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('258,817', 155, 98); //PRECIO UNITARIO

        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('0', 187, 98); //DESCUENTO POR PRODUCTO

        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('258,817', 215, 98); //SUBTOTAL POR PRODUCTO

        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('19', 244, 98); //iVA POR PRODUCTO

        doc.setFont('helvetica', 'normal', 'normal')
        doc.text('307,992', 265, 98); //PRECIO TOTAL POR PRODUCTO

        doc.rect(20, 107, 260, 30)

        doc.setFontSize(10)
        doc.text('TOTAL BRUTO', 230, 111);
        doc.line(280, 113, 229, 113) // horizontal TOTAL BRUTO
        doc.text('DESCUENTOS', 230, 117);
        doc.line(280, 119, 229, 119) // horizontal DESCUENTO
        doc.text('SUBTOTAL', 235.5, 123);
        doc.line(280, 125, 229, 125) // horizontal SUBTOTAL
        doc.text('IVA', 248, 129);
        doc.line(280, 131, 229, 131) // horizontal IVA
        doc.text('TOTAL', 243, 136);


        //RESUMEN DE ORDEN
        doc.text('258,817', 265, 111); //RESULTADO DEL TOTAL BRUTO
        doc.text('0', 275, 117); //RESULTADO DEL TOTAL DESCUENTOS
        doc.text('258,817', 265, 123); //RESULTADO DEL TOTAL SUBTOTAL
        doc.text('49,175', 267, 129); //RESULTADO DEL TOTAL IVA
        doc.text('307,992', 265, 136); //RESULTADO DEL TOTAL IVA

        //FIRMA Y SELLO
        doc.rect(20, 137, 260, 10);
        doc.setFontSize(10)
        doc.text('FIRMA Y SELLO', 22, 141);

        //AUTORIZADO POR
        doc.rect(20, 147, 260, 10);
        doc.text('AUTORIZADO POR', 22, 151);
        
        
        //FINAL DE LA ORDEN
        doc.rect(20, 157, 260, 20);

        doc.line(103, 177, 103, 157)
        doc.setFont('helvetica', 'normal', 'bold')
        doc.text('DIRECTOR ADMINISTRATIVO', 104, 161);

        doc.line(255, 177, 255, 157)
        doc.text('DIRECTOR:', 258, 161);










        // (dataImage, format, x, y, ancho, alto)

        return doc.output('datauristring');

    }
}