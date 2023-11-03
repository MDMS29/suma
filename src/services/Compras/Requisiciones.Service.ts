import QueryRequisiciones from "../../querys/Compras/QueryRequisiciones";

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

    // public async Insertar_Familia_Producto(familia_producto_request: Familia_Producto, usuario_creacion: string) {
    //     try {
    //         //TODO: ARREGLAR VALIDACION DE DATOS
    //         const familia_filtrada: any = await this._Query_Requisiciones.Buscar_Familia_Producto(familia_producto_request)
    //         if (familia_filtrada?.length > 0) {
    //             return { error: true, message: 'Ya existe esta familia de producto' } //!ERROR
    //         }

    //         const respuesta = await this._Query_Requisiciones.Insertar_Familia_Producto(familia_producto_request, usuario_creacion)

    //         if (!respuesta) {
    //             return { error: true, message: 'No se ha podido crear la familia de productos' } //!ERROR
    //         }

    //         const familia_producto = await this._Query_Requisiciones.Buscar_Familia_Producto_ID(respuesta[0].id_familia)
    //         if (!familia_producto) {
    //             return { error: true, message: 'No se ha encontrado la familia de productos' } //!ERROR
    //         }

    //         return familia_producto[0]
    //     } catch (error) {
    //         console.log(error)
    //         return { error: true, message: 'Error al crear la familia de productos' } //!ERROR
    //     }
    // }

    // public async Buscar_Familia_Producto(id_familia_producto: number): Promise<any> {
    //     try {
    //         const familia_producto = await this._Query_Requisiciones.Buscar_Familia_Producto_ID(id_familia_producto)
    //         if (!familia_producto) {
    //             return { error: true, message: 'No se ha encontrado la familia' } //!ERROR
    //         }
    //         return familia_producto[0]
    //     } catch (error) {
    //         console.log(error)
    //         return { error: true, message: 'Error al encontrar la familia' }
    //     }
    // }

    // public async Editar_Familia_Producto(id_familia_producto: number, familia_producto_request: Familia_Producto) {
    //     try {
    //         const respuesta: any = await this._Query_Requisiciones.Buscar_Familia_Producto_ID(id_familia_producto)

    //         const familia_filtrada_referencia: any = await this._Query_Requisiciones.Buscar_Familia_Producto(familia_producto_request)
    //         if (familia_filtrada_referencia?.length > 0 && familia_filtrada_referencia[0].referencia !== respuesta[0].referencia && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
    //             return { error: true, message: 'Ya existe esta referencia' } //!ERROR
    //         }

    //         const familia_filtrada_descripcion: any = await this._Query_Requisiciones.Buscar_Familia_Descripcion(familia_producto_request)
    //         if (familia_filtrada_descripcion?.length > 0 && familia_filtrada_descripcion[0].descripcion !== respuesta[0].descripcion && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
    //             return { error: true, message: 'Ya existe este nombre de familia' } //!ERROR
    //         }

    //         familia_producto_request.referencia = respuesta[0]?.referencia === familia_producto_request.referencia ? respuesta[0]?.referencia : familia_producto_request.referencia
    //         familia_producto_request.descripcion = respuesta[0]?.descripcion === familia_producto_request.descripcion ? respuesta[0]?.descripcion : familia_producto_request.descripcion

    //         const res = await this._Query_Requisiciones.Editar_Familia_Producto(id_familia_producto, familia_producto_request)
    //         if (res?.rowCount != 1) {
    //             return { error: true, message: 'Error al actualizar la familia' } //!ERROR
    //         }

    //         return { error: false, message: '' } //*SUCCESSFUL
    //     } catch (error) {
    //         console.log(error)
    //         return { error: true, message: 'Error al editar la familia' } //!ERROR
    //     }
    // }

    // public async Cambiar_Estado_Familia(id_familia_producto: number, estado: number) {
    //     try {
    //         const familia_filtrada: any = await this._Query_Requisiciones.Buscar_Familia_Producto_ID(id_familia_producto)
    //         if (familia_filtrada?.length <= 0) {
    //             return { error: true, message: 'No se ha encontrado esta la familia' } //!ERROR
    //         }

    //         const familia_cambiada = await this._Query_Requisiciones.Cambiar_Estado_Familia(id_familia_producto, estado)
    //         if (familia_cambiada?.rowCount != 1) {
    //             return { error: true, message: 'Error al cambiar el estado de la familia' } //!ERROR
    //         }

    //         return { error: false, message: '' } //*SUCCESSFUL
    //     } catch (error) {
    //         console.log(error)
    //         return { error: true, message: 'Error al cambiar el estado de la familia' } //!ERROR
    //     }
    // }
}