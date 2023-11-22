import { Proveedor, Requisicion_Det, Requisicion_Enc } from '../../Interfaces/Compras/ICompras'
import QueryProveedores from "../../querys/Compras/QueryProveedores";



export class ProveedoresService {
    private _Query_Requisiciones: QueryProveedores;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Requisiciones = new QueryProveedores();
    }

    private ReduceProveedores(result: Proveedor[], proveedores: Proveedor[]) {
        proveedores?.forEach((proveedor: any) => {
            const esProveedor = result.find((existe: any) => existe.id_tercero === proveedor.id_tercero);
            if (!esProveedor) {
                result.push(proveedor);
            }
        });
        return result;
    }
    private ReduceSuministros(result: Proveedor[], proveedor: Proveedor) {
        proveedor.suministros?.forEach((suministro: any) => {
            const esSuministro = result.find((existe: any) => existe.id_tipo_producto === suministro.id_tipo_producto);
            if (!esSuministro && suministro.id_tercero == proveedor.id_tercero) {
                result.push(suministro);
            }
        });
        return result;
    }

    public async Obtener_Proveedores(estado: string, empresa: string): Promise<any> {
        try {
            let proveedores = await this._Query_Requisiciones.Obtener_Proveedores(estado, empresa)
            if (proveedores?.length <= 0) {
                return { error: false, message: 'No se han encontrado proveedores' } //!ERROR
            }

            //GUARDAR LOS SUMINISTROS DE CADA UNO DE LOS PROVEEDORES
            let array_suministros = []
            for (let proveedor of proveedores) {
                array_suministros.push({
                    id_tercero: proveedor.id_tercero_suministro,
                    id_tipo_producto: proveedor.id_tipo_producto,
                    tipo_producto: proveedor.tipo_producto
                })
                proveedor.suministros = array_suministros
            }
            //REDUCIR LOS PROVEEDORES PARA IGNORAR LOS REPETIDOS
            proveedores = this.ReduceProveedores([], proveedores)

            //REDUCIR LOS SUMINISTROS DE CADA UNO DE LOS PROVEEDORES
            for (let proveedor of proveedores) {
                let suministros_pro = this.ReduceSuministros([], proveedor)
                proveedor.suministros = suministros_pro
            }

            return proveedores
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las requisiciones' } //!ERROR
        }
    }

    public async Insertar_Requisicion(requisicion_request: Requisicion_Enc, usuario_creacion: string) {
        try {
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
                    if (typeof detalle.id_detalle !== 'string') {
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

}
