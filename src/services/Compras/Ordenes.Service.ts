import { jsPDF as JSPDF } from "jspdf";
import {
    Detalle_Orden,
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
                    <p>Total de la Orden: <strong> $${formatear_cantidad(orden.total_orden ?? 0)} </strong></p>
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
            const [orden] = await this._Query_Ordenes.Buscar_Encabezado_Doc(id_orden, id_empresa);
            if (!orden) {
                return { error: true, message: "No se ha encontrado la orden" }; //!ERROR
            }

            const dellate_orden = await this._Query_Ordenes.Buscar_Detalle_Orden_Doc(id_orden);
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
            correo_empresa,
            direccion_empresa,

            orden,
            tipo_orden,
            cotizacion,

            nombre_proveedor,
            nit_proveedor,
            forma_pago,

            fecha_orden,
            direccion_proveedor,
            observaciones,

            telefono_empresa,
            fecha_entrega,

            detalle_orden,
            usuario_aprobador
        } = orden_completa;

        // INICIALIZAR LA LIBRERIA PARA CREAR EL PDF
        const doc = new JSPDF({ orientation: "l" });

        // CABECERA DOCUMENTO


        //!ENCABEZADO DOCUMENTO

        // console.log("------------------ORDEN ----------------\n", orden_completa);

        // CABECERA - IZQUIERDA
        const imageData = fs.readFileSync("resources/logo_empresa_short.png");
        let HRectCabePie = 16
        let JumLine = 44
        let JumLineCabe = 40
        let proveedor = `${nombre_proveedor} - NIT. ${nit_proveedor}`;

        //TITULO DE LA ORDEN
        doc.setFontSize(12); // (size)
        doc.setFont("helvetica", "normal", "bold");

        doc.addImage(imageData, "PNG", 14, 10, 30, 13.5);
        doc.text(`${razon_social}`.toLocaleUpperCase(), 115, 17);

        doc.setFontSize(9); // (size)
        doc.setFont("helvetica", "normal", "normal");
        doc.text(`NIT. ${nit_empresa}`, 130, 20);

        doc.text(`${direccion_empresa}`, 100, 23);

        doc.text(`Teléfono: ${telefono_empresa}  Correo: ${correo_empresa}`, 110, 26);

        doc.setFontSize(11); // (size)

        doc.setFont("helvetica", "normal", "bold");


        // ------PRIMER RECUADRO DE CABECERA ------
        //NO. ORDEN
        doc.text("No. Orden", 21, 36.5); // (texto, x, y)
        doc.text(`${orden}`, 44, 36.5);
        doc.line(60, 30, 60, 40);//(x1, y1, x2, y2)

        // TIPO DE ORDEN
        doc.text(`${tipo_orden.toLocaleUpperCase()}`, 122, 36.5); //(text, x, y, options)
        doc.line(20, 40, 280, 40); //(x1, y1, x2, y2)

        //NO. COTIZACION
        doc.line(240, 30, 240, 40);//(x1, y1, x2, y2)
        doc.text("COT.#", 242, 36.5)
        doc.text(`${cotizacion ?? ""}`, 255, 36.5);


        // SEGUNDA FILA DE LA CABECERA
        doc.text("Proveedor:", 21, JumLine); // (texto, x, y)
        doc.text("Forma de pago:", 177, JumLine); // (texto, x, y)

        const textProveeedor = doc.splitTextToSize(proveedor ?? "", 100);
        const textFormaPago = doc.splitTextToSize(forma_pago ?? "", 30);

        // ULTIMA COORDENADA DONDE EMPEZARA EL A IMPRIMIR EL TEXTO
        let lastY = JumLine
        if (textProveeedor.length > textFormaPago.length) {
            for (let line of textProveeedor) {
                doc.text(line, 44, JumLine);
                if (textProveeedor.length > 1) {
                    JumLineCabe += 4

                } else {
                    JumLineCabe += 4.5
                }
                JumLine += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                HRectCabePie += 1; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
            }

            for (let line of textFormaPago) {
                doc.text(line, 260, lastY, { align: 'center' });
                lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
            }
        } else {
            for (let line of textProveeedor) {
                doc.text(line, 44, lastY);
                lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
            }

            for (let line of textFormaPago) {
                doc.text(line, 260, JumLine, { align: 'center' });
                if (textFormaPago.length > 1) {
                    JumLineCabe += 4
                    HRectCabePie += 2; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA

                } else {
                    JumLineCabe += 4.5
                    HRectCabePie += 1; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                }
                JumLine += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
            }
        }

        // LINEA DIVISORA DE SEGUNDA LINEA CON TERCERA
        doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)

        JumLine += 1

        // TERCER FILA DE LA CABECERA
        doc.text("Dirección:", 21, JumLine);
        doc.text("Fecha de compra:", 177, JumLine);

        // FECHA DE ORDEN
        doc.text(`${fecha_orden}`, 260, JumLine, { align: 'center' });

        // DIRECCION
        const textDireccion = doc.splitTextToSize(`${direccion_proveedor ?? ""}`, 100);
        for (let line of textDireccion) {
            doc.text(line, 44, JumLine);
            if (textDireccion.length > 1) {
                JumLineCabe += 4.3 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 
                HRectCabePie += 3; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
            } else {
                JumLineCabe += 4.5 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 
                HRectCabePie += 2; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
            }
            JumLine += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
        }

        JumLine += 1

        // LINEA DIVISORA DE TERCERA LINEA CON CUARTA
        doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)

        // CUARTA FILA DE LA CABECERA
        doc.text("Teléfono:", 21, JumLine);
        doc.text("Fecha de entrega", 177, JumLine);

        // TELÉFONO
        doc.text(`${telefono_empresa}`, 44, JumLine);

        // FECHA ENTREGA
        doc.text(`${fecha_entrega}`, 260, JumLine, { align: 'center' });

        JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
        HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
        JumLineCabe += 5 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 

        // LINEA DIVISORA DE CUARTA LINEA CON QUINTA
        doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)


        // QUINTA FILA DE LA CABECERA
        // Con base en la cotizacion presentada por su empresa DEVITECH, sírvase remitir los bienes o servicios que a continuación se detallan
        doc.text("", 23, JumLine);

        let lastJumpLine = JumLine + 1
        JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
        HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA

        JumLineCabe += 4.5 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 

        // LINEA DIVISORA DE QUINTA LINEA CON CUERPO DEL DOCUMENTO
        doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)

        //  ----- CABECERA DEL CUERPO DEL DOCUMENTO -----
        doc.text("Requisición", 21, JumLine);
        doc.line(45, lastJumpLine, 45, JumLine + 1);

        doc.text("Item", 50, JumLine);
        doc.line(63, lastJumpLine, 63, JumLine + 1);

        doc.text("Descripcion", 90, JumLine);
        doc.line(135, lastJumpLine, 135, JumLine + 1);

        doc.text("Criti.", 137, JumLine);
        doc.line(147, lastJumpLine, 147, JumLine + 1);

        doc.text("Ficha", 148, JumLine);
        doc.line(159, lastJumpLine, 159, JumLine + 1);

        doc.text("Unidad", 160, JumLine);
        doc.line(174, lastJumpLine, 174, JumLine + 1);

        doc.text("Cant.", 175, JumLine);
        doc.line(186, lastJumpLine, 186, JumLine + 1);

        doc.text("Precio Unit.", 187, JumLine);
        doc.line(210, lastJumpLine, 210, JumLine + 1);

        doc.text("Descuento", 211, JumLine);
        doc.line(232, lastJumpLine, 232, JumLine + 1);

        doc.text("IVA", 240, JumLine);
        doc.line(255, lastJumpLine, 255, JumLine + 1);

        doc.text("Precio Total", 257, JumLine);

        HRectCabePie += 5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA

        //RECUADRO PARA CABECERA DE LA ORDEN
        doc.rect(20, 30, 260, HRectCabePie); //(x, y, ancho, alto)
        let JumpLineBody = JumLine
        let item = 0

        if (!detalle_orden) {
            doc.text("NO HAY DETALLES EN LA ORDEN", 257, JumpLineBody);
        } else {
            let firstLineBody = JumpLineBody
            let detalle: Detalle_Orden

            let total_bruto = 0
            let descuento_orden = 0
            let iva_orden = 0
            let subtotal_orden = 0
            // let keyJumps: any = []
            for (detalle of detalle_orden) {
                const { requisicion, codigo_producto, nombre_producto, porcentaje, descuento, ficha, precio_compra, critico, cantidad, unidad } = detalle

                item += 1
                if (item > 1) {
                    // INSERTAR LA LINEA DIVISORA ENTRE CADA FILA
                    doc.line(20, JumpLineBody, 280, JumpLineBody); // LINEA
                }

                let subtotal_local = cantidad * precio_compra;
                let iva_local = subtotal_local * (porcentaje / 100);
                let total_local = subtotal_local + iva_local;

                total_bruto += precio_compra
                subtotal_orden += subtotal_local
                descuento_orden += descuento
                iva_orden += iva_local


                doc.setFont("helvetica", "normal", "normal");
                doc.text(`${requisicion}`, 22, JumpLineBody + 5); //NUMERO DE REQUISICIÓN

                doc.text(`${codigo_producto}`, 52, JumpLineBody + 5); //ID DEL PRODUCTO

                doc.text(critico == true ? 'X' : '', 140, JumpLineBody + 5); //PRECIO UNITARIO

                doc.text(ficha == true ? 'X' : '', 152, JumpLineBody + 5); //PRECIO UNITARIO

                doc.text(`${cantidad}`, 184.5, JumpLineBody + 5, { align: 'right' }); // CANTIDAD

                doc.setFontSize(10); // (size)
                doc.text(`$${formatear_cantidad(precio_compra)}`, 210.5, JumpLineBody + 5, { align: 'right' }); //PRECIO UNITARIO

                doc.text(`$${formatear_cantidad(descuento)}`, 232.5, JumpLineBody + 5, { align: 'right' }); //DESCUENTO POR PRODUCTO

                doc.text(`$${formatear_cantidad(Math.round(iva_local))}`, 255.5, JumpLineBody + 5, { align: 'right' }); //IVA POR PRODUCTO

                doc.text(`$${formatear_cantidad(Math.round(total_local))}`, 280.5, JumpLineBody + 5, { align: 'right' }); //PRECIO TOTAL POR PRODUCTO

                doc.setFontSize(11); // (size)


                let lastJumBody = JumpLineBody

                // UNIDAD
                const txtUnidad = doc.splitTextToSize(`${unidad?.slice(0, 4) ?? ""}`, 14);
                for (let line of txtUnidad) {
                    doc.text(`${line}.`, 173, lastJumBody + 5, { align: 'right' }); //NOMBRE DEL PRODUCTO
                    if (txtUnidad.length > 1) {
                        lastJumBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                    }
                }

                // NOMBRE PRODUCTO
                const txtNombreProducto = doc.splitTextToSize(`${nombre_producto ?? ""}`, 70);
                for (let line of txtNombreProducto) {
                    doc.text(`${line}`, 65, JumpLineBody + 5); //NOMBRE DEL PRODUCTO
                    // if (txtNombreProducto.length > 1) {
                    // }
                    JumpLineBody += 5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                }

                // SALTO DE LINEA PARA EL SIGUIENTE DETALLE
                JumpLineBody += 5

                doc.line(20, firstLineBody, 20, JumpLineBody);
                doc.line(45, firstLineBody, 45, JumpLineBody);
                doc.line(63, firstLineBody, 63, JumpLineBody);
                doc.line(135, firstLineBody, 135, JumpLineBody);
                doc.line(147, firstLineBody, 147, JumpLineBody);
                doc.line(159, firstLineBody, 159, JumpLineBody);
                doc.line(174, firstLineBody, 174, JumpLineBody);
                doc.line(186, firstLineBody, 186, JumpLineBody);
                doc.line(210, firstLineBody, 210, JumpLineBody);
                doc.line(232, firstLineBody, 232, JumpLineBody);
                doc.line(255, firstLineBody, 255, JumpLineBody);
                doc.line(280, firstLineBody, 280, JumpLineBody);
                doc.line(20, JumpLineBody, 280, JumpLineBody);

                // let lastJumLineBody = JumpLineBody 
                let limitePag = 120

                if (limitePag < JumpLineBody) {
                    doc.addPage()
                    limitePag += limitePag


                    doc.setFont("helvetica", "normal", "bold");
                    // CABECERA - IZQUIERDA

                    // CABECERA - IZQUIERDA
                    const imageData = fs.readFileSync("resources/logo_empresa_short.png");
                    HRectCabePie = 16
                    JumLine = 44
                    JumLineCabe = 40
                    proveedor = `${nombre_proveedor} - NIT. ${nit_proveedor}`;

                    //TITULO DE LA ORDEN
                    doc.setFontSize(12); // (size)
                    doc.setFont("helvetica", "normal", "bold");

                    doc.addImage(imageData, "PNG", 14, 10, 30, 13.5);
                    doc.text(`${razon_social}`.toLocaleUpperCase(), 115, 17);

                    doc.setFontSize(9); // (size)
                    doc.setFont("helvetica", "normal", "normal");
                    doc.text(`NIT. ${nit_empresa}`, 130, 20);

                    doc.text(`${direccion_empresa}`, 100, 23);

                    doc.text(`Teléfono: ${telefono_empresa}  Correo: ${correo_empresa}`, 110, 26);

                    doc.setFontSize(11); // (size)

                    doc.setFont("helvetica", "normal", "bold");


                    // ------PRIMER RECUADRO DE CABECERA ------
                    //NO. ORDEN
                    doc.text("No. Orden", 21, 36.5); // (texto, x, y)
                    doc.text(`${orden}`, 44, 36.5);
                    doc.line(60, 30, 60, 40);//(x1, y1, x2, y2)

                    // TIPO DE ORDEN
                    doc.text(`${tipo_orden.toLocaleUpperCase()}`, 122, 36.5); //(text, x, y, options)
                    doc.line(20, 40, 280, 40); //(x1, y1, x2, y2)

                    //NO. COTIZACION
                    doc.line(240, 30, 240, 40);//(x1, y1, x2, y2)
                    doc.text("COT.#", 242, 36.5)
                    doc.text(`${cotizacion ?? ""}`, 255, 36.5);


                    // SEGUNDA FILA DE LA CABECERA
                    doc.text("Proveedor:", 21, JumLine); // (texto, x, y)
                    doc.text("Forma de pago:", 177, JumLine); // (texto, x, y)

                    const textProveeedor = doc.splitTextToSize(proveedor ?? "", 100);
                    const textFormaPago = doc.splitTextToSize(forma_pago ?? "", 30);

                    // ULTIMA COORDENADA DONDE EMPEZARA EL A IMPRIMIR EL TEXTO
                    let lastY = JumLine
                    if (textProveeedor.length > textFormaPago.length) {
                        for (let line of textProveeedor) {
                            doc.text(line, 44, JumLine);
                            if (textProveeedor.length > 1) {
                                JumLineCabe += 4

                            } else {
                                JumLineCabe += 4.5
                            }
                            JumLine += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                            HRectCabePie += 1; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                        }

                        for (let line of textFormaPago) {
                            doc.text(line, 260, lastY, { align: 'center' });
                            lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                        }
                    } else {
                        for (let line of textProveeedor) {
                            doc.text(line, 44, lastY);
                            lastY += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                        }

                        for (let line of textFormaPago) {
                            doc.text(line, 260, JumLine, { align: 'center' });
                            if (textFormaPago.length > 1) {
                                JumLineCabe += 4
                                HRectCabePie += 2; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA

                            } else {
                                JumLineCabe += 4.5
                                HRectCabePie += 1; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABECERA
                            }
                            JumLine += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                        }
                    }

                    // LINEA DIVISORA DE SEGUNDA LINEA CON TERCERA
                    doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)

                    JumLine += 1

                    // TERCER FILA DE LA CABECERA
                    doc.text("Dirección:", 21, JumLine);
                    doc.text("Fecha de compra:", 177, JumLine);

                    // FECHA DE ORDEN
                    doc.text(`${fecha_orden}`, 260, JumLine, { align: 'center' });

                    // DIRECCION
                    const textDireccion = doc.splitTextToSize(`${direccion_proveedor ?? ""}`, 100);
                    for (let line of textDireccion) {
                        doc.text(line, 44, JumLine);
                        if (textDireccion.length > 1) {
                            JumLineCabe += 4.3 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 
                            HRectCabePie += 3; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                        } else {
                            JumLineCabe += 4.5 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 
                            HRectCabePie += 2; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                        }
                        JumLine += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                    }

                    JumLine += 1

                    // LINEA DIVISORA DE TERCERA LINEA CON CUARTA
                    doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)

                    // CUARTA FILA DE LA CABECERA
                    doc.text("Teléfono:", 21, JumLine);
                    doc.text("Fecha de entrega", 177, JumLine);

                    // TELÉFONO
                    doc.text(`${telefono_empresa}`, 44, JumLine);

                    // FECHA ENTREGA
                    doc.text(`${fecha_entrega}`, 260, JumLine, { align: 'center' });

                    JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                    HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                    JumLineCabe += 5 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 

                    // LINEA DIVISORA DE CUARTA LINEA CON QUINTA
                    doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)


                    // QUINTA FILA DE LA CABECERA
                    // Con base en la cotizacion presentada por su empresa DEVITECH, sírvase remitir los bienes o servicios que a continuación se detallan
                    doc.text("", 23, JumLine);

                    lastJumpLine = JumLine + 1
                    JumLine += 4.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
                    HRectCabePie += 4.5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA
                    // JumLineCabe += 5

                    //LÍNEA VERTICAL QUE DIVIDE LA CABECERA EN DOS
                    // doc.line(150, 40, 150, JumLine);//(x1, y1, x2, y2)

                    // JumLine += 5.5
                    // HRectCabePie += 11
                    JumLineCabe += 4.5 //AUMENTAR LA ALTURA DE LAS LINEAS DIVISORAS DE CADA FILA 


                    // LINEA DIVISORA DE QUINTA LINEA CON CUERPO DEL DOCUMENTO
                    doc.line(20, JumLineCabe, 280, JumLineCabe);//(x1, y1, x2, y2)

                    //  ----- CABECERA DEL CUERPO DEL DOCUMENTO -----
                    doc.text("Requisición", 21, JumLine);
                    doc.line(45, lastJumpLine, 45, JumLine + 1);

                    doc.text("Item", 50, JumLine);
                    doc.line(63, lastJumpLine, 63, JumLine + 1);

                    doc.text("Descripcion", 90, JumLine);
                    doc.line(135, lastJumpLine, 135, JumLine + 1);

                    doc.text("Criti.", 137, JumLine);
                    doc.line(147, lastJumpLine, 147, JumLine + 1);

                    doc.text("Ficha", 148, JumLine);
                    doc.line(159, lastJumpLine, 159, JumLine + 1);

                    doc.text("Unidad", 160, JumLine);
                    doc.line(174, lastJumpLine, 174, JumLine + 1);

                    doc.text("Cant.", 175, JumLine);
                    doc.line(186, lastJumpLine, 186, JumLine + 1);

                    doc.text("Precio Unit.", 187, JumLine);
                    doc.line(210, lastJumpLine, 210, JumLine + 1);

                    doc.text("Descuento", 211, JumLine);
                    // doc.line(200, lastJumpLine, 200, JumLine + 1);

                    // // doc.text("Subtotal", 218, JumLine);
                    doc.line(232, lastJumpLine, 232, JumLine + 1);

                    doc.text("IVA", 240, JumLine);
                    doc.line(255, lastJumpLine, 255, JumLine + 1);

                    doc.text("Precio Total", 257, JumLine);

                    HRectCabePie += 5; // AUMENTAR LA ALTURA DEL CUADRADO DE LA CABEZERA

                    JumpLineBody = JumLine + 5
                    // lastJumBody = JumpLineBody
                    item = 0
                    doc.rect(20, 30, 260, HRectCabePie); //(x, y, ancho, alto)
                }
            }


            doc.rect(20, JumpLineBody, 260, 35); //(x, y, ancho, alto)

            // LINEAS DIVISORA PARA TOTALES DE ORDEN
            doc.line(232, JumpLineBody, 232, JumpLineBody + 35);
            doc.line(255, JumpLineBody, 255, JumpLineBody + 35);


            let JumpObservaciones = JumpLineBody + 5
            const txtObservaciones = doc.splitTextToSize(`${observaciones ?? ""}`, 200);
            for (let line of txtObservaciones) {
                doc.text(line, 21, JumpObservaciones);
                JumpObservaciones += 3.5; // AUMENTO DE LA POSICION DEL SALTO DE LINEA
            }
            // doc.text(`${observaciones}`, 21, JumpLineBody);//(text, x, y, options)

            JumpLineBody += 5
            doc.setFontSize(9)
            doc.text("TOTAL BRUTO", 232.5, JumpLineBody);//(text, x, y, options)
            doc.line(232, JumpLineBody + 3, 280, JumpLineBody + 3);
            doc.text(`$${formatear_cantidad(total_bruto)}`, 280.5, JumpLineBody, { align: 'right' });//(text, x, y, options)


            JumpLineBody += 5
            doc.text("DESCUENTOS", 232.5, JumpLineBody + 2);//(text, x, y, options)
            doc.line(232, JumpLineBody + 5, 280, JumpLineBody + 5);
            doc.text(`$${formatear_cantidad(descuento_orden)}`, 280.5, JumpLineBody + 2, { align: 'right' });//(text, x, y, options)


            JumpLineBody += 5
            doc.text("SUBTOTAL", 232.5, JumpLineBody + 4.5);//(text, x, y, options)
            doc.line(232, JumpLineBody + 7, 280, JumpLineBody + 7);
            doc.text(`$${formatear_cantidad(subtotal_orden)}`, 280.5, JumpLineBody + 4.5, { align: 'right' });//(text, x, y, options)

            JumpLineBody += 5
            doc.text("IVA", 232.5, JumpLineBody + 6);//(text, x, y, options)
            doc.line(232, JumpLineBody + 9, 280, JumpLineBody + 9);
            doc.text(`$${formatear_cantidad(iva_orden)}`, 280.5, JumpLineBody + 6, { align: 'right' });//(text, x, y, options)

            JumpLineBody += 5
            doc.text("TOTAL", 232.5, JumpLineBody + 8);//(text, x, y, options)
            doc.text(`$${formatear_cantidad(subtotal_orden + iva_orden - descuento_orden)}`, 280.5, JumpLineBody + 8, { align: 'right' });//(text, x, y, options)


            doc.setFontSize(11)

            // CUADRO DE PIE DE PAGINA
            doc.rect(20, JumpLineBody + 10, 260, 35); //(x, y, ancho, alto)
            JumpLineBody += 10

            doc.text("FIRMA Y SELLO:", 21, JumpLineBody + 5);//(text, x, y, options)

            doc.line(20, JumpLineBody + 7, 280, JumpLineBody + 7);//(x1, y1, x2, y2)
            doc.text("AUTORIZADO POR:", 21, JumpLineBody + 11);//(text, x, y, options)
            doc.setFontSize(12)
            doc.text(`${usuario_aprobador ? usuario_aprobador.toLocaleUpperCase() : ''}`, 58, JumpLineBody + 11); // (texto, x, y)

            doc.line(20, JumpLineBody + 14, 280, JumpLineBody + 14);//(x1, y1, x2, y2)
            doc.text("GERENTE DE OPERACIONES:", 21, JumpLineBody + 18);//(text, x, y, options)

            doc.line(150, JumpLineBody + 14, 150, JumpLineBody + 35);//(x1, y1, x2, y2)
            doc.text("GERENTE GENERAL:", 151, JumpLineBody + 18);//(text, x, y, options)
        }

        return doc.output("datauristring");
    }
}
