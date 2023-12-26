import jsPDF from "jspdf";
import { Encabezado_Orden } from "../../Interfaces/Compras/ICompras";
import { EstadosTablas } from "../../helpers/constants";
import QueryOrdenes from "../../querys/Compras/QueryOrdenes";
import Querys from "../../querys/Querys";
import { RequisicionesService } from "./Requisiciones.Service";
import { transporter } from "../../config/mailer";

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

            //SUMAR LOS PREICOS DE COMPRA DE CADA DETALLE DE LA ORDEN
            // let total_orden = 0
            // let detalle: Detalle_Orden
            // for (detalle of req_body.detalles_orden) {
            //     total_orden = detalle.precio_compra + total_orden
            // }

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
                    // if(existe_detalle?.length <= 0 ){
                    //     return { error: true, message: `No hay detalles para la orden ${req_body.orden}` } //!ERROR
                    // }

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

    public async Aprobar_Orden(id_orden: number, empresa_id: number) {
        try {
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
                        return { error: true, message: `El producto "${detalle.nombre_producto}" no tiene pendientes` } //!ERROR
                    }

                    // VALIDAR QUE LA CANTIDAD NO PASE DE LOS PRODUCTOS PENDIENTES
                    const pendiente = productos_pendientes.filter((producto: TProductosPpendiente) => producto.id_producto === detalle.id_producto && producto.productos_pendientes < detalle.cantidad)
                    //LA CANTIDAD REQUEST ES MAYOR A LA CANTIDAD DE LOS PENDIENTES - DEVOLVER ERROR
                    if (pendiente.length > 0) {
                        return { error: true, message: `La cantidad del producto "${detalle.nombre_producto}" debe ser menor o igual a ${pendiente[0].productos_pendientes}` } //!ERROR
                    }
                    // --- FIN DE VALIDACIONES PARA LOS PRODUCTOS PENDIENTES ---

                    //APROBAR EL DETALLE DE LA ORDEN
                    const detalle_aprobado = await this._Query_Ordenes.Aprobar_Detalle(detalle.id_detalle, EstadosTablas.ESTADO_APROBADO)
                    if (detalle_aprobado !== 1) {
                        return { error: true, message: `Error al aprobar el detalle de la orden ${orden_aprobar.orden}` } //!ERROR
                    }
                }

                // APROBAR EL ENCABEZADO DE LA ORDEN
                const aprobar_encabezado_orden = await this._Query_Ordenes.Aprobar_Encabezado_Orden(id_orden, EstadosTablas.ESTADO_APROBADO)
                if (aprobar_encabezado_orden !== 1) {
                    return { error: true, message: `Error al aprobar la orden ${orden_aprobar.orden}` } //!ERROR
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

    public async Generar_Documento_Orden(id_orden: number, id_empresa: number) {
        try {
            const respuesta: any = await this._Query_Ordenes.Buscar_Orden_ID(id_orden, id_empresa)
            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se ha encontrado la orden' } //!ERROR
            }

            //ENVIAR CORREO ELECTRONICO AL RESPONSABLE DEL CENTRO
            const correo_confir = await transporter.sendMail({
                from: `"SUMA" <${process.env.MAILER_USER}>`,
                to: 'rosmypachon@gmail.com',
                subject: `Confirmación de Aprobación de Orden ${respuesta[0].orden}`,
                html: `
                    <div>
                            <p>Cordial saludo, ${respuesta[0].correo_responsable}!</p>
                            <br />
                            <p>Es un placer informarle que su orden ha sido revisada y aprobada con éxito. Nos complace confirmar que todos los detalles de la orden han sido verificados.</p>
                            <p>A continuación, se detallan los elementos clave de su orden:</p>
                            <p>Número de Orden: <strong> ${respuesta[0].orden} </strong></p>
                            <p>Fecha de Aprobacion: <strong> ${respuesta[0].fecha_entrega} </strong></p>
                            <p>Total de la Orden: <strong> ${respuesta[0].total_orden} </strong></p>
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
            });
            if (!correo_confir.accepted) {
                return { error: true, message: 'Error al enviar correo de confirmación' }; //!ERROR
            }


            // INICIALIZAR LA LIBRERIA PARA CREAR EL PDF
            const doc = new jsPDF();

            doc.text('TEXTO FORMADO', 10, 10)

            const pdfBase64 = doc.output('datauristring');
            return { data: pdfBase64, nombre: respuesta[0].orden }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al generar el documento de la orden' } //!ERROR
        }
    }

}