import { jsPDF as JSPDF } from "jspdf";
import {
    Detalle_Orden,
    // Detalle_Orden,
    Encabezado_Orden,
    Filtro_Ordenes,
} from "../../Interfaces/Compras/ICompras";
import { EstadosTablas } from "../../helpers/constants";
import QueryOrdenes from "../../querys/Compras/QueryOrdenes";
import Querys from "../../querys/Querys";
import { RequisicionesService } from "./Requisiciones.Service";
import { transporter } from "../../config/mailer";
import { MessageError } from "../../Interfaces/Configuracion/IConfig";
import { formatear_cantidad } from "../../helpers/utils";

import fs from "node:fs";

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

    private async Enviar_Correo(orden: Encabezado_Orden, correo_responsables: string[], pdf: string | undefined) {
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
                    path: pdf,
                },
            ],
        });
        if (!correo_confir.accepted) {
            return { error: true, message: "Error al enviar correo de confirmación" }; //!ERROR
        }
        return { error: false, message: '' }
    }

    private async Enviar_Correo_Proveedor(orden: Encabezado_Orden, correo_responsables: string[], pdf: string | undefined): Promise<MessageError> {
        const correo_confir = await transporter.sendMail({
            from: `"SUMA" <${process.env.MAILER_USER}>`,
            to: correo_responsables,
            subject: `Pedido ${orden.tipo_orden} - ${orden.orden}`,
            html: `
                <div>
                    <p>Cordial saludo, ${orden.nombre_proveedor}!</p>
                    
                    <p>Me pongo en contacto contigo en relación con un pedido que necesitamos realizar para <b>${orden.razon_social}</b>.</p>
                    <p>En el siguiente documento adjunto se detallan los productos/servicios que necesitamos, junto con las cantidades y cualquier otra información relevante:</p>

                    <p><b>Información de Envío:</b></p>
                    <p>Dirección de Envío: ${orden.lugar_entrega}</p>
                    <p>Fecha de entrega requerida: ${orden.fecha_entrega}</p>

                    <p><b>Información de Facturación:</b></p>
                    <p>Dirección de Facturación: ${orden.lugar_entrega}</p>
                    <p>Forma de Pago: ${orden.forma_pago}</p>

                    <p>Por favor, confírmanos la disponibilidad de los productos/servicios y la fecha de entrega estimada. Además, adjunto encontrarás la ${orden.tipo_orden}.</p>

                    <p>Agradecemos tu atención a este asunto y esperamos con interés recibir los productos/servicios a tiempo.</p>

                    <p>Quedamos a la espera de tu confirmación.</p>
                    
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

    public async Obtener_Ordenes(empresa: string, estado: string, inputs: string) {
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

    public async Insertar_Orden(req_body: Encabezado_Orden, usuario_creacion: any) {

        const { id_usuario, usuario } = usuario_creacion
        try {
            const numero_orden = await this._Query_Ordenes.Buscar_Numero_Orden(
                req_body
            );
            if (numero_orden && numero_orden?.length > 0) {
                return {
                    error: true,
                    message: `Ya existe el numero de orden ${req_body.orden}`,
                }; //!ERROR
            }

            try {
                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log = await this._QuerysG.Insertar_Log_Auditoria(usuario, req_body.ip, req_body?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                }

                const direccion_insertada = await this._QuerysG.Insertar_Direccion(req_body.lugar_entrega);
                if (direccion_insertada.length <= 0) {
                    return { error: true, message: "Error al insertar la dirección" }; //!ERROR
                }

                req_body.lugar_entrega = direccion_insertada[0].id_direccion;

                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log_2 = await this._QuerysG.Insertar_Log_Auditoria(usuario, req_body.ip, req_body?.ubicacion)
                if (log_2 !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                }
                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Insertar_Orden_Encabezado(req_body, 0, id_usuario);
                if (!orden) {
                    return {
                        error: true,
                        message: `Error al insertar la orden ${req_body.orden}`,
                    }; //!ERROR
                }

                ///INSERTAR DETALLES DE LA ORDEN
                for (let detalle of req_body.detalles_orden) {
                    // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                    const log = await this._QuerysG.Insertar_Log_Auditoria(usuario, req_body.ip, req_body?.ubicacion)
                    if (log !== 1) {
                        console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                    }

                    const orden_detalle = await this._Query_Ordenes.Insertar_Orden_Detalle(detalle, orden[0].id_orden);
                    if (orden_detalle?.length == 0 && !orden_detalle) {
                        return { error: true, message: "Error al insertar los detalles" }; //!ERROR
                    }
                }

                const orden_insertada: any = await this._Query_Ordenes.Buscar_Orden_ID(orden[0].id_orden, req_body.id_empresa);
                if (orden_insertada?.length <= 0) {
                    return { error: true, message: "No se ha encontrado la orden" }; //!ERROR
                }

                return orden_insertada[0];
            } catch (error) {
                console.log(error);
                return;
            }
        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: `Error al insertar la orden ${req_body.orden}`,
            }; //!ERROR
        }
    }

    public async Enviar_Correo_Aprobacion_Proveedor(orden_id: number, empresa_id: number) {
        try {
            const [orden_aprobar] = await this._Query_Ordenes.Buscar_Encabezado_Doc(orden_id, empresa_id)
            if (!orden_aprobar) {
                return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden_Doc(orden_id)
            if (dellate_orden && dellate_orden?.length <= 0) {
                return { error: true, message: `No se han encontrado los detalle de la orden ${orden_aprobar.orden}` } //!ERROR
            }

            orden_aprobar.detalles_orden = dellate_orden

            //? GENERAR PDF DE LA ORDEN PARA ENVIAR
            const pdf = await this.Generar_Documento_Orden(orden_id, empresa_id)
            if (!pdf) {
                return { error: true, message: `Error al generar documento` } //!ERROR
            }

            //?ENVIAR CORREO DE CONFIRMACIÓN AL PROVEEDOR
            const es_correo = await this.Enviar_Correo_Proveedor(orden_aprobar, [orden_aprobar.correo_proveedor], pdf.data)
            if (es_correo.error) {
                return es_correo
            }

            return { error: false, message: `Correo enviado al proveedor ${orden_aprobar.nombre_proveedor}` }

        } catch (error) {
            console.log(error)
            return { error: true, message: "Error al enviar correo de aprobación" } //!ERROR
        }
    }

    public async Buscar_Orden(id_orden: number, id_empresa: number) {
        try {
            const respuesta: any = await this._Query_Ordenes.Buscar_Orden_ID(
                id_orden,
                id_empresa
            );
            if (respuesta?.length <= 0) {
                return { error: true, message: "No se ha encontrado la orden" }; //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden(
                id_orden
            );
            if (dellate_orden && dellate_orden?.length <= 0) {
                return {
                    error: true,
                    message: "No se han encontrado los detalle de la orden",
                }; //!ERROR
            }

            respuesta[0].detalles_orden = dellate_orden;

            return respuesta[0];
        } catch (error) {
            console.log(error);
            return { error: true, message: "Error al encontrar la orden" }; //!ERROR
        }
    }

    public async Editar_Orden(req_body: Encabezado_Orden, id_orden: number, usuario_modi: string) {
        try {
            const numero_orden = await this._Query_Ordenes.Buscar_Numero_Orden(
                req_body
            );
            if (
                numero_orden && numero_orden?.length > 0 && id_orden !== numero_orden[0].id_orden) {
                return {
                    error: true,
                    message: `Ya existe el numero de orden ${req_body.orden}`,
                }; //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._QuerysG.Insertar_Log_Auditoria(usuario_modi, req_body.ip, req_body?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
            }
            const direccion_editada = await this._QuerysG.Editar_Direccion(req_body.lugar_entrega.id_lugar_entrega ?? 0, req_body.lugar_entrega);
            if (direccion_editada !== 1) {
                return { error: true, message: "Error al editar la dirección" }; //!ERROR
            }

            try {
                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log = await this._QuerysG.Insertar_Log_Auditoria(usuario_modi, req_body.ip, req_body?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                }
                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Editar_Orden_Encabezado(req_body, 0, id_orden);
                if (orden !== 1) {
                    return {
                        error: true,
                        message: `Error al editar la orden ${req_body.orden}`,
                    }; //!ERROR
                }

                ///INSERTAR DETALLES DE LA ORDEN
                for (let detalle of req_body.detalles_orden) {
                    // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                    const log = await this._QuerysG.Insertar_Log_Auditoria(usuario_modi, req_body.ip, req_body?.ubicacion)
                    if (log !== 1) {
                        console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                    }
                    // BUSCAR SI EL DETALLE DE LA ORDEN YA EXISTE
                    const existe_detalle = await this._Query_Ordenes.Buscar_Detalle_Orden(id_orden);

                    const esDetalle = existe_detalle.filter((ex_detalle) => ex_detalle.id_detalle == detalle.id_detalle);
                    if (esDetalle.length > 0) {
                        // SI EXISTE EL DETALLE EN LA ORDEN LO EDITARA
                        const orden_detalle = await this._Query_Ordenes.Editar_Detalle_Orden(detalle);
                        if (orden_detalle !== 1 && !orden_detalle) {
                            return {
                                error: true,
                                message: `Error al editar los detalles de la orden ${req_body.orden}`,
                            }; //!ERROR
                        }
                    } else {
                        // SI EL DETALLE NO EXISTE LO INSERTA
                        const orden_detalle = await this._Query_Ordenes.Insertar_Orden_Detalle(detalle, id_orden);
                        if (orden_detalle?.length == 0 && !orden_detalle) {
                            return { error: true, message: "Error al insertar los detalles" }; //!ERROR
                        }
                    }
                }

                const orden_editada: any = await this._Query_Ordenes.Buscar_Orden_ID(id_orden, req_body.id_empresa);
                if (orden_editada?.length <= 0) {
                    return { error: true, message: "No se ha encontrado la orden" }; //!ERROR
                }
                return orden_editada[0];
            } catch (error) {
                console.log(error);
                return;
            }
        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: `Error al insertar la orden ${req_body.orden}`,
            }; //!ERROR
        }
    }

    public async Eliminar_Restaurar_Orden(id_orden: number, id_estado: number, info_user: any, usuario: string) {
        try {
            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._QuerysG.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
            }
            const respuesta: any = await this._Query_Ordenes.Eliminar_Restaurar_Orden(id_orden, id_estado);
            if (respuesta != 1) {
                return {
                    error: true,
                    message: "Error al cambiar el estado de la orden",
                }; //!ERROR
            }

            return {
                error: true,
                message:
                    id_estado == EstadosTablas.ESTADO_ANULADO
                        ? "Se ha anulado la orden"
                        : "Se ha aprobado la orden",
            }; //!ERROR
        } catch (error) {
            console.log(error);
            return { error: true, message: "Error al cambiar el estado de la orden" }; //!ERROR
        }
    }

    public async Aprobar_Orden(id_orden: number, usuario_aprobar: any, info_user: any) {
        const { id_empresa, id_usuario, usuario } = usuario_aprobar
        try {
            let array_requisiciones: { id_requisicion: number; requisicion: string; }[] = [];

            const [orden_aprobar] = await this._Query_Ordenes.Buscar_Orden_ID(id_orden, id_empresa);
            if (!orden_aprobar) {
                return { error: true, message: "No se ha encontrado la orden" }; //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden_Pendientes(id_orden);
            if (dellate_orden && dellate_orden?.length <= 0) {
                return {
                    error: true,
                    message: `No se han encontrado los detalle de la orden ${orden_aprobar.orden}`,
                }; //!ERROR
            }

            orden_aprobar.detalles_orden = dellate_orden;

            try {
                for (let detalle of orden_aprobar.detalles_orden) {
                    type TProductosPpendiente = {
                        id_producto: number;
                        nombre_producto: string;
                        productos_pendientes: number;
                    };

                    // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                    const log = await this._QuerysG.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
                    if (log !== 1) {
                        console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
                    }

                    // --- COMPROBAR QUE LOS PRODUCTOS PENDIENTES SEA VALIDO CON RESPECTO A LOS DETALLES DE LA ORDEN ---
                    // ---BUSCAR LOS PRODUCTO PENDIENTES
                    const productos_pendientes = await this._Service_Requisicion.Buscar_Requisicion(detalle.id_requisicion, true);

                    // VALIDAR QUE EL PRODUCTO SI TENGA PENDIENTES
                    const producto_pendiente = productos_pendientes.filter((producto: TProductosPpendiente) => producto.id_producto == detalle.id_producto);
                    //EL PRODUCTO NO TIENE PENDIENTES - DEVOLVER ERROR
                    if (producto_pendiente.length <= 0) {
                        return {
                            error: true,
                            message: `El producto "${detalle.producto}" no tiene pendientes`,
                        }; //!ERROR
                    }

                    // VALIDAR QUE LA CANTIDAD NO PASE DE LOS PRODUCTOS PENDIENTES
                    const pendiente = productos_pendientes.filter((producto: TProductosPpendiente) => producto.id_producto === detalle.id_producto && producto.productos_pendientes < detalle.cantidad);
                    //LA CANTIDAD REQUEST ES MAYOR A LA CANTIDAD DE LOS PENDIENTES - DEVOLVER ERROR
                    if (pendiente.length > 0) {
                        return {
                            error: true,
                            message: `La cantidad del producto "${detalle.producto}" debe ser menor o igual a ${pendiente[0].productos_pendientes}`,
                        }; //!ERROR
                    }
                    // --- FIN DE VALIDACIONES PARA LOS PRODUCTOS PENDIENTES ---

                    //APROBAR EL DETALLE DE LA ORDEN
                    const detalle_aprobado = await this._Query_Ordenes.Aprobar_Detalle(detalle.id_detalle, EstadosTablas.ESTADO_APROBADO);
                    if (detalle_aprobado !== 1) {
                        return {
                            error: true,
                            message: `Error al aprobar el detalle de la orden ${orden_aprobar.orden}`,
                        }; //!ERROR
                    }

                    array_requisiciones.push({
                        id_requisicion: detalle.id_requisicion,
                        requisicion: detalle.requisicion,
                    });
                }

                const log = await this._QuerysG.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
                }

                // APROBAR EL ENCABEZADO DE LA ORDEN
                const aprobar_encabezado_orden = await this._Query_Ordenes.Aprobar_Encabezado_Orden(id_orden, EstadosTablas.ESTADO_APROBADO, id_usuario);
                if (aprobar_encabezado_orden !== 1) {
                    return {
                        error: true,
                        message: `Error al aprobar la orden ${orden_aprobar.orden}`,
                    }; //!ERROR
                }

                //? OBTENER LOS CORREOS DE LOS RESPONSABLES DE LOS CENTROS DE COSTO DE LAS REQUISICIONES
                const correo_responsables = await this._Service_Requisicion.Obtener_Correo_Responsables(array_requisiciones);
                if ("error" in correo_responsables) {
                    return correo_responsables;
                }

                //? GENERAR PDF DE LA ORDEN PARA ENVIAR
                const pdf = await this.Generar_Documento_Orden(id_orden, id_empresa);
                if (!pdf) {
                    return {
                        error: true,
                        message: `Error al generar documento - Orden ${orden_aprobar.orden}`,
                    }; //!ERROR
                }

                //?ENVIAR CORREO DE CONFIRMACIÓN
                const es_correo = await this.Enviar_Correo(orden_aprobar, correo_responsables, pdf.data);
                if (es_correo.error) {
                    return es_correo;
                }

                return {
                    error: false,
                    message: `Se ha aprobado la orden ${orden_aprobar.orden}`,
                };
            } catch (error) {
                console.log(error);
                return {
                    error: true,
                    message: `Error al aprobar la orden ${orden_aprobar.orden}`,
                }; //!ERROR
            }
        } catch (error) {
            console.log(error);
            return { error: true, message: `Error al aprobar la orden` }; //!ERROR
        }
    }

    //INVOCA EL PDF Y LO REUTILIZA
    public async Generar_Documento_Orden(id_orden: number, id_empresa: number) {
        try {
            const [orden] = await this._Query_Ordenes.Buscar_Encabezado_Doc(
                id_orden,
                id_empresa
            );
            if (!orden) {
                return { error: true, message: "No se ha encontrado la orden" }; //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden_Doc(
                id_orden
            );
            if (dellate_orden && dellate_orden?.length <= 0) {
                return {
                    error: true,
                    message: `No se han encontrado los detalle de la orden ${orden.orden}`,
                }; //!ERROR
            }

            let iva_total = 0;
            let descuento_total = 0;
            let subtotal = 0;
            for (let detalle of dellate_orden) {
                const { cantidad, precio_compra, porcentaje, descuento } = detalle;

                let subtotal_local = cantidad * precio_compra;
                let iva_local = subtotal_local * (porcentaje / 100);

                let total_local = subtotal_local + iva_local;

                // SUBTOTAL GLOBAL
                subtotal = subtotal_local + subtotal;

                // IVA GLOBAL
                iva_total = iva_total + iva_local;

                // DESCUENTO GLOBAL
                descuento_total = descuento + descuento_total;

                // AGREGAR AL DETALLE EL CALCULO LOCAL
                detalle.total_detalle = total_local;
            }

            orden.subtotal = subtotal;
            orden.descuento_total = descuento_total;
            orden.iva_total = iva_total;
            orden.detalle_orden = dellate_orden;

            const pdf = this.Generar_PDF_Orden(orden);
            if (!pdf) {
                return {
                    error: true,
                    message: `Error al generar documento - Orden ${orden.orden}`,
                }; //!ERROR
            }

            return { data: pdf, nombre: orden.orden };
        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: "Error al generar el documento de la orden",
            }; //!ERROR
        }
    }

    // GENERA EL PDF Y RETORNA EL BASE64
    private Generar_PDF_Orden(orden_completa: Encabezado_Orden) {
        const {
            nit_empresa,
            razon_social,

            orden,
            tipo_orden,
            cotizacion,

            nombre_proveedor,
            nit_proveedor,
            forma_pago,

            lugar_entrega,
            fecha_orden,

            telefono_empresa,
            fecha_entrega,

            detalle_orden
        } = orden_completa;

        // INICIALIZAR LA LIBRERIA PARA CREAR EL PDF
        const doc = new JSPDF({ orientation: "l" });

        // CABECERA DOCUMENTO
        doc.setFontSize(11); // (size)
        doc.setFont("helvetica", "normal", "bold");
        // doc.setFont("helvetica", "normal", "normal");

        //!ENCABEZADO DOCUMENTO

        console.log("------------------ORDEN ----------------\n", orden_completa);

        // CABECERA - IZQUIERDA
        const imageData = fs.readFileSync("resources/logo_empresa_short.png");
        let HRectCabePie = 15;
        let proveedor = `${nombre_proveedor} - ${nit_proveedor}`;

        //TITULO DE LA ORDEN
        doc.addImage(imageData, "PNG", 14, 10, 30, 13.5);
        doc.text(`${razon_social} - NIT. ${nit_empresa}`.toLocaleUpperCase(), 115, 20);

        let JumLine = 45

        // ------PRIMER RECUADRO DE CABECERA ------
        //NO. ORDEN
        doc.text("No. Orden", 21, 36); // (texto, x, y)
        doc.text(`${orden}`, 44, 36.5);
        doc.line(60, 30, 60, 40);//(x1, y1, x2, y2)

        // TIPO DE ORDEN
        doc.text(`${tipo_orden.toLocaleUpperCase()}`, 122, 36.5); //(text, x, y, options)
        doc.line(20, 40, 280, 40); //(x1, y1, x2, y2)

        //NO. COTIZACION
        doc.line(240, 30, 240, 40);//(x1, y1, x2, y2)
        doc.text("COT.#", 242, 36.5)
        doc.text(`${cotizacion ?? ""}`, 255, 36);


        // SEGUNDA FILA DE LA CABECERA
        doc.text("Proveedor:", 21, 45); // (texto, x, y)
        doc.text("Forma de pago:", 177, 45); // (texto, x, y)

        const textProveeedor = doc.splitTextToSize(proveedor ?? "", 100);
        const textFormaPago = doc.splitTextToSize(forma_pago ?? "", 30);


        let lastY = JumLine
        if (textProveeedor.length > textFormaPago.length) {
            for (let line of textProveeedor) {
                doc.text(line, 44, JumLine, { align: 'center' });
                if (textProveeedor.length > 1) {
                    HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                    JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                }
            }

            for (let line of textFormaPago) {
                doc.text(line, 260, lastY);
                if (textFormaPago.length > 1) {
                    // HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                    lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                }
            }
        } else {
            for (let line of textFormaPago) {
                doc.text(line, 260, JumLine, { align: 'center' });
                if (textFormaPago.length > 1) {
                    HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                    JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                }
            }

            for (let line of textProveeedor) {
                doc.text(line, 44, lastY);
                if (textProveeedor.length > 1) {
                    // HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                    lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                }
            }
        }
        JumLine += 1

        // LINEA DIVISORA DE SEGUNDA LINEA CON TERCERA
        doc.line(20, JumLine, 280, JumLine);//(x1, y1, x2, y2)

        // JumLine += 4.5

        // TERCER FILA DE LA CABECERA
        doc.text("Dirección:", 21, JumLine + 4.5);
        doc.text("Fecha de compra", 177, JumLine + 4.5);

        // FECHA DE ORDEN
        doc.text(`${fecha_orden}`, 248, JumLine + 4.5);

        // DIRECCION
        const textDireccion = doc.splitTextToSize(`${lugar_entrega}` ?? "", 100);
        for (let line of textDireccion) {
            doc.text(line, 44, JumLine + 4.5);
            if (textDireccion.length > 1) {
                HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
            }
        }
        JumLine += 2

        // LINEA DIVISORA DE TERCERA LINEA CON CUARTA
        doc.line(20, JumLine - 1, 280, JumLine - 1);//(x1, y1, x2, y2)

        // CUARTA FILA DE LA CABECERA
        doc.text("Teléfono:", 21, JumLine + 3.5);
        doc.text("Fecha de entrega", 177, JumLine + 3.5);

        // TELÉFONO
        doc.text(`${telefono_empresa}`, 44, JumLine + 3.5);

        // FECHA ENTREGA
        doc.text(`${fecha_entrega}`, 248, JumLine + 3.5);

        // SUMAR AL SALTO DE LINEA
        JumLine += 4.5

        // LINEA DIVISORA DE CUARTA LINEA CON QUINTA
        doc.line(20, JumLine, 280, JumLine);//(x1, y1, x2, y2)

        HRectCabePie += 5.5

        // QUINTA FILA DE LA CABECERA
        doc.text("Con base en la cotizacion presentada por su empresa DEVITECH, sírvase remitir los bienes o servicios que a continuación se detallan", 21, JumLine + 4);

        //LÍNEA VERTICAL QUE DIVIDE LA CABECERA EN DOS
        doc.line(150, 40, 150, JumLine);//(x1, y1, x2, y2)

        JumLine += 5.5
        HRectCabePie += 11

        //RECUADRO PARA CABECERA DE LA ORDEN
        doc.rect(20, 30, 260, HRectCabePie + 3.5); //(x, y, ancho, alto)

        // LINEA DIVISORA DE QUINTA LINEA CON CUERPO DEL DOCUMENTO
        doc.line(20, JumLine, 280, JumLine);//(x1, y1, x2, y2)


        //  ----- CABECERA DEL CUERPO DEL DOCUMENTO -----
        doc.text("Requisición", 22, JumLine + 4);
        doc.line(45, JumLine, 45, JumLine + 6);

        doc.text("Item", 53, JumLine + 4);
        doc.line(68, JumLine, 68, JumLine + 6);

        doc.text("Descripcion", 76, JumLine + 4);
        doc.line(103, JumLine, 103, JumLine + 6);

        doc.text("Unidad", 106, JumLine + 4);
        doc.line(121, JumLine, 121, JumLine + 6);

        doc.text("Cantidad", 123, JumLine + 4);
        doc.line(141, JumLine, 141, JumLine + 6);

        doc.text("Precio Unitario", 145, JumLine + 4);
        doc.line(178, JumLine, 178, JumLine + 6);

        doc.text("Descuento", 183, JumLine + 4);
        doc.line(206, JumLine, 206, JumLine + 6);

        doc.text("Subtotal", 212, JumLine + 4);
        doc.line(229, JumLine, 229, JumLine + 6);

        doc.text("IVA", 238, JumLine + 4);
        doc.line(255, JumLine, 255, JumLine + 6);

        doc.text("Precio Total", 257, JumLine + 4);

        let JumpLineBody = JumLine + 5
        let item = 0

        if (!detalle_orden) {
            doc.text("NO HAY DETALLES EN LA ORDEN", 257, JumpLineBody);
        } else {
            let firstLineBody = JumpLineBody
            let detalle: Detalle_Orden
            let keyJumps: any = []
            for (detalle of detalle_orden) {
                const { requisicion, codigo_producto, nombre_producto, unidad, cantidad, precio_compra, porcentaje, descuento } = detalle

                item += 1
                if (item > 1) {
                    // INSERTAR LA LINEA DIVISORA ENTRE CADA FILA
                    doc.line(20, JumpLineBody, 280, JumpLineBody); // LINEA
                }

                let subtotal_local = cantidad * precio_compra;
                let iva_local = subtotal_local * (porcentaje / 100);
                let total_local = subtotal_local + iva_local;

                doc.setFont("helvetica", "normal", "normal");
                doc.text(`${requisicion}`, 22, JumpLineBody + 5); //NUMERO DE REQUISICIÓN

                doc.text(`${codigo_producto}`, 52, JumpLineBody + 5); //ID DEL PRODUCTO

                doc.text(`${cantidad}`, 139, JumpLineBody + 5, { align: 'right' }); // CANTIDAD

                doc.text(`${precio_compra}`, 177, JumpLineBody + 5, { align: 'right' }); //PRECIO UNITARIO

                doc.text(`${descuento}`, 203, JumpLineBody + 5, { align: 'right' }); //DESCUENTO POR PRODUCTO

                doc.text(`${subtotal_local}`, 228, JumpLineBody + 5, { align: 'right' }); //SUBTOTAL POR PRODUCTO

                doc.text(`${Math.round(iva_local)}`, 254, JumpLineBody + 5, { align: 'right' }); //IVA POR PRODUCTO

                doc.text(`${Math.round(total_local)}`, 279, JumpLineBody + 5, { align: 'right' }); //PRECIO TOTAL POR PRODUCTO


                function imprimirTextoConSalto(doc: any, lines: any, x: any, y: any, incremento: any) {
                    for (let line of lines) {
                        doc.text(`${line}`, x, y, { align: 'right' });

                        if (lines.length > 1) {
                            y += incremento;
                        }
                    }

                    return y; // Devuelve la nueva posición del salto de línea
                }

                
                // // let lastJumBody = JumpLineBody

                const txtRequisicion = doc.splitTextToSize(`${requisicion}` ?? "", 20);
                keyJumps = [...keyJumps, { requisicion: txtRequisicion.length }]

                const txtCodigo = doc.splitTextToSize(`${codigo_producto}` ?? "", 20);
                keyJumps = [...keyJumps, { codigo: txtCodigo.length }]

                const txtCantidad = doc.splitTextToSize(`${cantidad}` ?? "", 20);
                keyJumps = [...keyJumps, { cantidad: txtCantidad.length }]

                const txtPrecioC = doc.splitTextToSize(`${precio_compra}` ?? "", 20);
                keyJumps = [...keyJumps, { precioC: txtPrecioC.length }]

                const txtDescuento = doc.splitTextToSize(`${descuento}` ?? "", 20);
                keyJumps = [...keyJumps, { descuento: txtDescuento.length }]

                const txtSubtotal = doc.splitTextToSize(`${subtotal_local}` ?? "", 20);
                keyJumps = [...keyJumps, { subtotal: txtSubtotal.length }]

                const txtIvaLocal = doc.splitTextToSize(`${iva_local}` ?? "", 20);
                keyJumps = [...keyJumps, { iva_local: txtIvaLocal.length }]

                const txtTotalLocal = doc.splitTextToSize(`${total_local}` ?? "", 20);
                keyJumps = [...keyJumps, { total_local: txtTotalLocal.length }]

                const txtUnidada = doc.splitTextToSize(`${unidad}` ?? "", 20);
                keyJumps = [...keyJumps, { unidad: txtUnidada.length }]

                const txtNombrePro = doc.splitTextToSize(`${nombre_producto}` ?? "", 20);
                keyJumps = [...keyJumps, { nombre_pro: txtNombrePro.length }]

                let maxNumber = -Infinity;
                let maxKey = '';

                for (let i = 0; i < keyJumps.length; i++) {
                    let obj = keyJumps[i];
                    for (let key in obj) {
                        if (obj[key] > maxNumber) {
                            maxNumber = obj[key];
                            maxKey = key;
                        }
                    }
                }

                let salto = JumpLineBody

                switch (maxKey) {
                    case 'requisicion':
                        JumpLineBody = imprimirTextoConSalto(doc, txtRequisicion, 22, salto + 5, 5);
                        console.log('requisicion')
                        break;
                    case 'codigo':
                        JumpLineBody = imprimirTextoConSalto(doc, txtCodigo, 52, salto + 5, 5);
                        console.log('codigo')
                        break;
                    case 'nombre_pro':
                        JumpLineBody = imprimirTextoConSalto(doc, txtNombrePro, 100, salto + 5, 5);
                        console.log('nombre')
                        break;
                    // ... (otros casos)
                
                    default:
                        console.log('NINGUNA')
                        break;
                }

                // salto = imprimirTextoConSalto(doc, lines, x, salto + 5, 5);

                // switch (maxKey) {
                //     case 'requisicion':
                //         for (let line of txtRequisicion) {
                //             doc.text(`${line}`, 22, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtRequisicion.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }

                //         for (let line of txtCodigo) {
                //             doc.text(`${line}`, 52, salto + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtCodigo.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 salto += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }

                //         console.log('requisicion')
                //         break;
                //     case 'codigo':
                //         for (let line of txtCodigo) {
                //             doc.text(`${line}`, 52, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtCodigo.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('codigo')
                //         break;
                //     case 'cantidad':
                //         for (let line of txtCantidad) {
                //             doc.text(`${line}`, 139, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtCantidad.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('cantidad')
                //         break;
                //     case 'precioC':
                //         for (let line of txtPrecioC) {
                //             doc.text(`${line}`, 177, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtPrecioC.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('precioC')
                //         break;
                //     case 'descuento':
                //         for (let line of txtDescuento) {
                //             doc.text(`${line}`, 203, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtDescuento.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('descuento')
                //         break;
                //     case 'subtotal':
                //         for (let line of txtSubtotal) {
                //             doc.text(`${line}`, 228, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtSubtotal.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('subtotal')
                //         break;
                //     case 'iva_local':
                //         for (let line of txtIvaLocal) {
                //             doc.text(`${line}`, 254, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtIvaLocal.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('iva_local')
                //         break;
                //     case 'total_local':
                //         for (let line of txtTotalLocal) {
                //             doc.text(`${line}`, 279, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtTotalLocal.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('total_local')
                //         break;
                //     case 'unidad':
                //         for (let line of txtUnidada) {
                //             doc.text(`${line}`, 119, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtUnidada.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('unidad')
                //         break;
                //     case 'nombre_pro':
                //         for (let line of txtNombrePro) {
                //             doc.text(`${line}`, 100, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtNombrePro.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }

                //         for (let line of txtUnidada) {
                //             doc.text(`${line}`, 119, salto + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //             if (txtUnidada.length > 1) {
                //                 // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //                 salto += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //             }
                //         }
                //         console.log('nombre_pro')
                //         break;

                //     default:
                //         console.log('NINGUNA')
                //         break;
                // }


                // UNIDAD
                // const txtUnidad = doc.splitTextToSize(`${unidad}` ?? "", 14);
                // for (let line of txtUnidad) {
                //     doc.text(`${line}`, 119, lastJumBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //     if (txtUnidad.length > 1) {
                //         // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //         lastJumBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //     }
                // }

                // // NOMBRE PRODUCTO
                // const txtNombreProducto = doc.splitTextToSize(`${nombre_producto}` ?? "", 25);
                // for (let line of txtNombreProducto) {
                //     doc.text(`${line}`, 100, JumpLineBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                //     if (txtNombreProducto.length > 1) {
                //         // HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                //         JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                //     }
                // }

                // SALTO DE LINEA PARA EL SIGUIENTE DETALLE
                JumpLineBody += 5

                doc.line(20, firstLineBody, 20, JumpLineBody);
                doc.line(45, firstLineBody, 45, JumpLineBody);
                doc.line(68, firstLineBody, 68, JumpLineBody);
                doc.line(103, firstLineBody, 103, JumpLineBody);
                doc.line(121, firstLineBody, 121, JumpLineBody);
                doc.line(141, firstLineBody, 141, JumpLineBody);
                doc.line(178, firstLineBody, 178, JumpLineBody);
                doc.line(206, firstLineBody, 206, JumpLineBody);
                doc.line(229, firstLineBody, 229, JumpLineBody);
                doc.line(255, firstLineBody, 255, JumpLineBody);
                doc.line(280, firstLineBody, 280, JumpLineBody);
                doc.line(20, JumpLineBody, 280, JumpLineBody);

                // let lastJumLineBody = JumpLineBody 
                let limitePag = 160
                if (limitePag < JumpLineBody) {
                    doc.addPage()
                    limitePag += limitePag


                    doc.setFont("helvetica", "normal", "bold");

                    // CABECERA - IZQUIERDA
                    const imageData = fs.readFileSync("resources/logo_empresa_short.png");
                    HRectCabePie = 15;
                    // let proveedor = `${nombre_proveedor} - ${nit_proveedor}`;

                    //TITULO DE LA ORDEN
                    doc.addImage(imageData, "PNG", 14, 10, 30, 13.5);
                    doc.text(`${razon_social} - NIT. ${nit_empresa}`.toLocaleUpperCase(), 115, 20);

                    JumLine = 45


                    // ------PRIMER RECUADRO DE CABECERA ------
                    //NO. ORDEN
                    doc.text("No. Orden", 21, 36); // (texto, x, y)
                    doc.text(`${orden}`, 44, 36.5);
                    doc.line(60, 30, 60, 40);//(x1, y1, x2, y2)

                    // TIPO DE ORDEN
                    doc.text(`${tipo_orden.toLocaleUpperCase()}`, 122, 36.5); //(text, x, y, options)
                    doc.line(20, 40, 280, 40); //(x1, y1, x2, y2)

                    //NO. COTIZACION
                    doc.line(240, 30, 240, 40);//(x1, y1, x2, y2)
                    doc.text("COT.#", 242, 36.5)
                    doc.text(`${cotizacion ?? ""}`, 255, 36);


                    // SEGUNDA FILA DE LA CABECERA
                    doc.text("Proveedor:", 21, 45); // (texto, x, y)
                    doc.text("Forma de pago:", 177, 45); // (texto, x, y)

                    const textProveeedor = doc.splitTextToSize(proveedor ?? "", 100);
                    const textFormaPago = doc.splitTextToSize(forma_pago ?? "", 30);


                    lastY = JumLine
                    if (textProveeedor.length > textFormaPago.length) {
                        for (let line of textProveeedor) {
                            doc.text(line, 44, JumLine, { align: 'center' });
                            if (textProveeedor.length > 1) {
                                HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                                JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                            }
                        }

                        for (let line of textFormaPago) {
                            doc.text(line, 260, lastY);
                            if (textFormaPago.length > 1) {
                                // HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                                lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                            }
                        }
                    } else {
                        for (let line of textFormaPago) {
                            doc.text(line, 260, JumLine, { align: 'center' });
                            if (textFormaPago.length > 1) {
                                HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                                JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                            }
                        }

                        for (let line of textProveeedor) {
                            doc.text(line, 44, lastY);
                            if (textProveeedor.length > 1) {
                                // HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                                lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                            }
                        }
                    }
                    JumLine += 1

                    // LINEA DIVISORA DE SEGUNDA LINEA CON TERCERA
                    doc.line(20, JumLine, 280, JumLine);//(x1, y1, x2, y2)

                    // JumLine += 4.5

                    // TERCER FILA DE LA CABECERA
                    doc.text("Dirección:", 21, JumLine + 4.5);
                    doc.text("Fecha de compra", 177, JumLine + 4.5);

                    // FECHA DE ORDEN
                    doc.text(`${fecha_orden}`, 248, JumLine + 4.5);

                    // DIRECCION
                    const textDireccion = doc.splitTextToSize(`${lugar_entrega}` ?? "", 100);
                    for (let line of textDireccion) {
                        doc.text(line, 44, JumLine + 4.5);
                        if (textDireccion.length > 1) {
                            HRectCabePie += 4; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                            JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                        }
                    }
                    JumLine += 2

                    // LINEA DIVISORA DE TERCERA LINEA CON CUARTA
                    doc.line(20, JumLine - 1, 280, JumLine - 1);//(x1, y1, x2, y2)

                    // CUARTA FILA DE LA CABECERA
                    doc.text("Teléfono:", 21, JumLine + 3.5);
                    doc.text("Fecha de entrega", 177, JumLine + 3.5);

                    // TELÉFONO
                    doc.text(`${telefono_empresa}`, 44, JumLine + 3.5);

                    // FECHA ENTREGA
                    doc.text(`${fecha_entrega}`, 248, JumLine + 3.5);

                    // SUMAR AL SALTO DE LINEA
                    JumLine += 4.5

                    // LINEA DIVISORA DE CUARTA LINEA CON QUINTA
                    doc.line(20, JumLine, 280, JumLine);//(x1, y1, x2, y2)

                    HRectCabePie += 5.5

                    // QUINTA FILA DE LA CABECERA
                    doc.text("Con base en la cotizacion presentada por su empresa DEVITECH, sírvase remitir los bienes o servicios que a continuación se detallan", 21, JumLine + 4);

                    //LÍNEA VERTICAL QUE DIVIDE LA CABECERA EN DOS
                    doc.line(150, 40, 150, JumLine);//(x1, y1, x2, y2)

                    JumLine += 5.5
                    HRectCabePie += 11

                    //RECUADRO PARA CABECERA DE LA ORDEN
                    doc.rect(20, 30, 260, HRectCabePie + 3.5); //(x, y, ancho, alto)

                    // LINEA DIVISORA DE QUINTA LINEA CON CUERPO DEL DOCUMENTO
                    doc.line(20, JumLine, 280, JumLine);//(x1, y1, x2, y2)


                    //  ----- CABECERA DEL CUERPO DEL DOCUMENTO -----
                    doc.text("Requisición", 22, JumLine + 4);
                    doc.line(45, JumLine, 45, JumLine + 6);

                    doc.text("Item", 53, JumLine + 4);
                    doc.line(68, JumLine, 68, JumLine + 6);

                    doc.text("Descripcion", 76, JumLine + 4);
                    doc.line(103, JumLine, 103, JumLine + 6);

                    doc.text("Unidad", 106, JumLine + 4);
                    doc.line(121, JumLine, 121, JumLine + 6);

                    doc.text("Cantidad", 123, JumLine + 4);
                    doc.line(141, JumLine, 141, JumLine + 6);

                    doc.text("Precio Unitario", 145, JumLine + 4);
                    doc.line(178, JumLine, 178, JumLine + 6);

                    doc.text("Descuento", 183, JumLine + 4);
                    doc.line(206, JumLine, 206, JumLine + 6);

                    doc.text("Subtotal", 212, JumLine + 4);
                    doc.line(229, JumLine, 229, JumLine + 6);

                    doc.text("IVA", 238, JumLine + 4);
                    doc.line(255, JumLine, 255, JumLine + 6);

                    doc.text("Precio Total", 257, JumLine + 4);

                    JumpLineBody = JumLine + 5
                    // lastJumBody = JumpLineBody
                    item = 0
                }
            }
            // LINEAS DE DIVISION ENTRE COLUMNAS DEL CUERPO
        }






        // RECUADRO PARA LA CABECERA DE DOCUMENTO
        // doc.rect(5, 35, 280, HRectCabePie); // (x, y, ancho, alto)


        // doc.line(20, HRectCabePie + 10, 280, HRectCabePie + 10);

        // doc.line(20, 54, 280, 54);

        // doc.text("No. Cotizacion", 174, 63);

        // doc.text("04/01/2024", 248, 45);
        // doc.text("04/01/2024", 248, 52);

        // doc.text("COT.# 890518", 246, 63);

        // doc.rect(20, 68, 260, 9);

        // doc.setFontSize(10);


        // doc.rect(20, 77, 260, 10);

        // //PRODUCTOS/SERVICIOS DE LA ORDEN



        // doc.rect(20, 87, 260, 20);

        // doc.line(45, 107, 45, 87);
        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("2704022 ", 22, 98); //NUMERO DE REQUISICIÓN

        // doc.line(68, 107, 68, 87);
        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("76381", 52, 98); //ID DEL PRODUCTO

        // doc.line(103, 107, 103, 87);
        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("Aire Acondicionado", 71, 98); //NOMBRE DEL PRODUCTO

        // doc.line(121, 107, 121, 87);
        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("Uni", 106, 98); //UNIDAD

        // doc.line(141, 107, 141, 87);
        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("1", 123, 98); // CANTIDAD

        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("258,817", 155, 98); //PRECIO UNITARIO

        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("0", 187, 98); //DESCUENTO POR PRODUCTO

        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("258,817", 215, 98); //SUBTOTAL POR PRODUCTO

        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("19", 244, 98); //iVA POR PRODUCTO

        // doc.setFont("helvetica", "normal", "normal");
        // doc.text("307,992", 265, 98); //PRECIO TOTAL POR PRODUCTO

        // doc.rect(20, 107, 260, 30);

        // doc.setFontSize(10);
        // doc.text("TOTAL BRUTO", 230, 111);
        // doc.line(280, 113, 229, 113); // horizontal TOTAL BRUTO
        // doc.text("DESCUENTOS", 230, 117);
        // doc.line(280, 119, 229, 119); // horizontal DESCUENTO
        // doc.text("SUBTOTAL", 235.5, 123);
        // doc.line(280, 125, 229, 125); // horizontal SUBTOTAL
        // doc.text("IVA", 248, 129);
        // doc.line(280, 131, 229, 131); // horizontal IVA
        // doc.text("TOTAL", 243, 136);

        // //RESUMEN DE ORDEN
        // doc.text("258,817", 265, 111); //RESULTADO DEL TOTAL BRUTO
        // doc.text("0", 275, 117); //RESULTADO DEL TOTAL DESCUENTOS
        // doc.text("258,817", 265, 123); //RESULTADO DEL TOTAL SUBTOTAL
        // doc.text("49,175", 267, 129); //RESULTADO DEL TOTAL IVA
        // doc.text("307,992", 265, 136); //RESULTADO DEL TOTAL IVA

        // //FIRMA Y SELLO
        // doc.rect(20, 137, 260, 10);
        // doc.setFontSize(10);
        // doc.text("FIRMA Y SELLO", 22, 141);

        // //AUTORIZADO POR
        // doc.rect(20, 147, 260, 10);
        // doc.text("AUTORIZADO POR", 22, 151);

        // //FINAL DE LA ORDEN
        // doc.rect(20, 157, 260, 20);

        // doc.line(103, 177, 103, 157);
        // doc.setFont("helvetica", "normal", "bold");
        // doc.text("DIRECTOR ADMINISTRATIVO", 104, 161);

        // doc.line(255, 177, 255, 157);
        // doc.text("DIRECTOR:", 258, 161);

        // (dataImage, format, x, y, ancho, alto)

        return doc.output("datauristring");
    }
}
