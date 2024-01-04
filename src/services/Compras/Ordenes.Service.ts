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

        doc.addImage(imageData, 'PNG', 6.5, 10, 30, 13.5) // (dataImage, format, x, y, ancho, alto)

        return doc.output('datauristring');

    }
}