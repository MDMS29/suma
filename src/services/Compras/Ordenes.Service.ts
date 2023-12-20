import { Detalle_Orden, Encabezado_Orden } from "../../Interfaces/Compras/ICompras";
import { EstadosTablas } from "../../helpers/constants";
import QueryOrdenes from "../../querys/Compras/QueryOrdenes";

export class OrdenesService {
    _Query_Ordenes: QueryOrdenes;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Ordenes = new QueryOrdenes();
    }

    async Obtener_Ordenes(empresa: string, estado: string, inputs: string) {
        try {
            const respuesta: any = await this._Query_Ordenes.Obtener_Ordenes(empresa, estado, inputs)
            if (respuesta?.length <= 0) {
                return { error: false, message:  'No se han encontrado ordenes' } //!ERROR
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
            let total_orden = 0
            let detalle: Detalle_Orden
            for (detalle of req_body.detalles_orden) {
                total_orden = detalle.precio_compra + total_orden
            }

            try {
                const direccion_insertada = await this._Query_Ordenes.Insertar_Direccion(req_body.lugar_entrega)
                if (direccion_insertada.length <= 0) {
                    return { error: true, message: 'Error al insertar la dirección' } //!ERROR
                }
    
                req_body.lugar_entrega = direccion_insertada[0].id_direccion

                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Insertar_Orden_Encabezado(req_body, total_orden, usuario_id)
                if (!orden) {
                    return { error: true, message: `Error al insertar la orden ${req_body.orden}` } //!ERROR
                }

                ///INSERTAR DETALLES DE LA ORDEN
                for (detalle of req_body.detalles_orden) {

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

            const direccion_editada = await this._Query_Ordenes.Editar_Direccion(req_body.lugar_entrega.id_lugar_entrega ?? 0, req_body.lugar_entrega)
            if (direccion_editada !== 1) {
                return { error: true, message: 'Error al editar la dirección' } //!ERROR
            }

            //SUMAR LOS PRECiOS DE COMPRA DE CADA DETALLE DE LA ORDEN
            let total_orden = 0
            let detalle: Detalle_Orden
            for (detalle of req_body.detalles_orden) {
                if (detalle.id_estado === EstadosTablas.ESTADO_ACTIVO) {
                    // SUMAR LOS PRECIOS DE COMPRA EN CASO EL DETALLE SEA ACTIVO
                    total_orden = detalle.precio_compra + total_orden
                }
                if (total_orden !== 0 && detalle.id_estado === EstadosTablas.ESTADO_INACTIVO) {
                    // RESTAR LOS PRECIOS DE COMPRA EN CASO EL DETALLE SEA INACTIVO
                    total_orden = detalle.precio_compra - total_orden
                }
            }


            try {
                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Editar_Orden_Encabezado(req_body, total_orden, id_orden)
                if (orden !== 1) {
                    return { error: true, message: `Error al editar la orden ${req_body.orden}` } //!ERROR
                }

                ///INSERTAR DETALLES DE LA ORDEN
                for (detalle of req_body.detalles_orden) {

                    const orden_detalle = await this._Query_Ordenes.Editar_Detalle_Orden(detalle)
                    if (orden_detalle !== 1 && !orden_detalle) {
                        return { error: true, message: `Error al editar los detalles de la orden ${req_body.orden}` } //!ERROR
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
}