import { Detalle_Orden, Encabezado_Orden } from "../../Interfaces/Compras/ICompras";
import { Tipo_Orden } from "../../Interfaces/Opciones_Basicas/IOpcioBasic";
import { EstadosTablas } from "../../helpers/constants";
import QueryOrdenes from "../../querys/Compras/QueryOrdenes";

export class OrdenesService {
    _Query_Ordenes: QueryOrdenes;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Ordenes = new QueryOrdenes();
    }

    async Obtener_Ordenes(tipo: string, empresa: string, estado: string) {
        try {
            const respuesta: any = await this._Query_Ordenes.Obtener_Ordenes(tipo, empresa, estado)
            if (respuesta?.length <= 0) {
                return { error: true, message: +estado === EstadosTablas.ESTADO_ACTIVO ? 'No se han encontrado ordenes activas' : 'No se han encontrado ordenes inactivas' } //!ERROR
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
                //INSERTAR ENCABEZADO DE LA ORDEN
                const orden = await this._Query_Ordenes.Insertar_Orden_Encabezado(req_body, total_orden, usuario_id)
                if (!orden) {
                    return { error: true, message: `Error al insertar la orden ${req_body.orden}` } //!ERROR
                }

                req_body.id_orden = orden[0].id_orden

                ///INSERTAR DETALLES DE LA ORDEN
                for (detalle of req_body.detalles_orden) {

                    const orden_detalle = await this._Query_Ordenes.Insertar_Orden_Detalle(detalle, orden[0].id_orden)
                    if (orden_detalle?.length == 0 && !orden_detalle) {
                        return { error: true, message: 'Error al insertar los detalles' } //!ERROR
                    }
                }

                return req_body

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
            if (numero_orden && numero_orden?.length > 0 && req_body.id_orden === numero_orden[0].id_orden) {
                return { error: true, message: `Ya existe el numero de orden ${req_body.orden}` } //!ERROR
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

            return { error: true, message: id_estado == EstadosTablas.ESTADO_ACTIVO ? 'Se ha restablecido la orden' : 'Se ha eliminado la orden' } //!ERROR
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado de la orden' } //!ERROR
        }
    }


    //SERVICIO PARA LOS TIPOS DE ORDENES
    async Obtener_Tipos_Ordenes(empresa: number) {
        try {
            const respuesta: any = await this._Query_Ordenes.Obtener_Tipos_Ordenes(empresa)
            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado los tipos de orden' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los tipos de orden' } //!ERROR
        }
    }

    async Insertar_Tipo_Orden(req_body: Tipo_Orden) {
        try {

            const tipo_nombre_filtrado = await this._Query_Ordenes.Buscar_Nombre_Tipo(req_body)
            if (tipo_nombre_filtrado && tipo_nombre_filtrado?.length > 0) {
                return { error: true, message: `Ya existe este nombre de tipo ${req_body.tipo_orden}` } //!ERROR
            }

            try {
                const tipo_orden = await this._Query_Ordenes.Insertar_Tipo_Orden(req_body)
                if (!tipo_orden) {
                    return { error: true, message: `Error al insertar el tipo de orden ${req_body.tipo_orden}` } //!ERROR
                }

                req_body.id_tipo_orden = tipo_orden[0].id_tipo_orden

                ///INSERTAR LOS TIPOS DE PRODUCTOS
                for (let tipo_producto of req_body.tipos_productos) {
                    const tipo_producto_orden = await this._Query_Ordenes.Insertar_Tipo_Producto_Orden(tipo_producto, tipo_orden[0].id_tipo_orden)
                    if (tipo_producto_orden?.length == 0 && !tipo_producto_orden) {
                        return { error: true, message: 'Error al insertar el tipo de producto' } //!ERROR
                    }
                }

                let numeroOrden = tipo_orden[0].id_tipo_orden + String(+req_body.consecutivo+1).padStart(Math.max(0, 6 - String(tipo_orden[0].id_tipo_orden).length), '0');

                req_body.consecutivo = numeroOrden.slice(0, 6);

                return req_body

            } catch (error) {
                console.log(error)
                return
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al insertar la orden ${req_body.tipo_orden}` } //!ERROR
        }
    }

    async Buscar_Tipo_Orden(id_tipo_orden: number) {
        try {
            const respuesta: any = await this._Query_Ordenes.Buscar_Tipo_ID(id_tipo_orden)
            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado el tipo de orden' } //!ERROR
            }

            const tipo_producto = await this._Query_Ordenes.Obtener_Tipo_Producto_Orden(respuesta[0])
            if (tipo_producto && tipo_producto?.length <= 0) {
                return { error: true, message: `No se han encontrado los tipos de productos de ${respuesta[0].tipo_orden}` } //!ERROR
            }

            respuesta[0].tipos_productos = tipo_producto

            return respuesta[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar el tipo de orden' } //!ERROR
        }
    }

    async Editar_Tipo_Orden(req_body: Tipo_Orden, id_tipo_orden: number) {
        try {

            const tipo_nombre_filtrado = await this._Query_Ordenes.Buscar_Nombre_Tipo(req_body)
            if (tipo_nombre_filtrado && tipo_nombre_filtrado?.length > 0 && id_tipo_orden !== tipo_nombre_filtrado[0].id_tipo_orden) {
                return { error: true, message: `Ya existe este nombre de tipo ${req_body.tipo_orden}` } //!ERROR
            }

            try {
                const tipo_orden = await this._Query_Ordenes.Editar_Tipo_Orden(req_body, id_tipo_orden)

                if (tipo_orden !== 1) {
                    return { error: true, message: `Error al editar el tipo de orden ${req_body.tipo_orden}` } //!ERROR
                }

                for (let tipo_producto of req_body.tipos_productos) {

                    const existe_tipo_producto = await this._Query_Ordenes.Buscar_Tipo_Producto_Orden(tipo_producto, id_tipo_orden)

                    if (existe_tipo_producto && existe_tipo_producto?.length > 0) {
                        // EDITAR
                        tipo_producto.id_tipo_producto_orden = existe_tipo_producto[0].id_tipo_producto_orden
                        const tipo_producto_editado = await this._Query_Ordenes.Editar_Tipo_Producto_Orden(tipo_producto, id_tipo_orden)
                        if (tipo_producto_editado != 1) {
                            return { error: true, message: 'Error al editar el tipo de producto' } //!ERROR
                        }

                    } else {
                        // INSERTAR
                        const tipo_producto_orden = await this._Query_Ordenes.Insertar_Tipo_Producto_Orden(tipo_producto, id_tipo_orden)
                        if (tipo_producto_orden?.length == 0 && !tipo_producto_orden) {
                            return { error: true, message: 'Error al insertar el tipo de producto' } //!ERROR
                        }

                    }

                    
                }
                const tipo_orden_editada: any = await this._Query_Ordenes.Buscar_Tipo_ID(id_tipo_orden)
                if (tipo_orden_editada?.length <= 0) {
                    return { error: true, message: 'No se han encontrado el tipo de orden' } //!ERROR
                }

                let numeroOrden = id_tipo_orden + String(+req_body.consecutivo+1).padStart(Math.max(0, 6 - String(id_tipo_orden).length), '0');
                tipo_orden_editada[0].consecutivo = numeroOrden.slice(0, 6);

                return tipo_orden_editada[0]

            } catch (error) {
                console.log(error)
                return
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al insertar la orden ${req_body.tipo_orden}` } //!ERROR
        }
    }
}