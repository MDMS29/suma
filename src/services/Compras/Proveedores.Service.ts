import { Tercero } from '../../Interfaces/Compras/ICompras'
import { EstadosTablas } from '../../helpers/constants';
import QueryProveedores from "../../querys/Compras/QueryProveedores";
import Querys from '../../querys/Querys';



export class ProveedoresService {
    private _Querys: Querys;
    private _Query_Proveedores: QueryProveedores;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Querys = new Querys();
        this._Query_Proveedores = new QueryProveedores();
    }

    private ReduceProveedores(result: Tercero[], proveedores: Tercero[]) {
        proveedores?.forEach((proveedor: any) => {
            const esProveedor = result.find((existe: any) => existe.id_tercero === proveedor.id_tercero);
            if (!esProveedor) {
                result.push(proveedor);
            }
        });
        return result;
    }

    private ReduceSuministros(result: Tercero[], proveedor: Tercero) {
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
            let proveedores = await this._Query_Proveedores.Obtener_Proveedores(estado, empresa)
            if (proveedores?.length <= 0) {
                return { error: false, message: 'No se han encontrado proveedores' } //!ERROR
            }

            //GUARDAR LOS SUMINISTROS DE CADA UNO DE LOS PROVEEDORES
            let array_suministros = []
            for (let proveedor of proveedores) {
                array_suministros.push({
                    id_suministro: proveedor.id_suministro,
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
            return { error: true, message: 'Error al cargar los proveedores' } //!ERROR
        }
    }

    public async Insertar_Proveedor(proveedor_request: Tercero, usuario_creacion: string) {
        try {
            const documento_proveedor_filtro: any = await this._Query_Proveedores.Buscar_Proveedor_Documento(proveedor_request)
            if (documento_proveedor_filtro?.length > 0) {
                return { error: true, message: 'Ya existe este numero de documento' } //!ERROR
            }

            const correo_proveedor_filtro: any = await this._Query_Proveedores.Buscar_Proveedor_Correo(proveedor_request)
            if (correo_proveedor_filtro?.length > 0) {
                return { error: true, message: 'Ya existe este correo' } //!ERROR
            }

            const direccion_insertada = await this._Querys.Insertar_Direccion(proveedor_request.direccion)
            if (direccion_insertada.length <= 0) {
                return { error: true, message: 'Error al insertar la dirección' } //!ERROR
            }

            proveedor_request.direccion = direccion_insertada[0].id_direccion

            // INSERTAR EL PROVEEDOR
            const proveedor_insert = await this._Query_Proveedores.Insertar_Proveedor(proveedor_request, usuario_creacion)
            if (!proveedor_insert) {
                return { error: true, message: 'No se ha podido crear el proveedor' } //!ERROR
            }

            // INSERTAR SUMINISTROS PARA EL PROVEEDOR
            if (proveedor_request.suministros) {
                for (let suministro of proveedor_request.suministros) {
                    const suministro_editado = await this._Query_Proveedores.Insertar_Sumnistro(suministro, proveedor_insert[0].id_tercero)
                    if (!suministro_editado) {
                        return { error: true, message: `Error al guardar el suministro` } //!ERROR
                    }
                }
            } else {
                return { error: true, message: `Error al crear el proveedor` } //!ERROR
            }

            //BUSCAR EL PROVEEDOR CREADO
            let proveedor = await this._Query_Proveedores.Buscar_Proveedor_ID(proveedor_insert[0].id_tercero)
            if (!proveedor) {
                return { error: true, message: 'No se ha encontrado el proveedor' } //!ERROR
            }

            //GUARDAR LOS SUMINISTROS DEL PROVEEDOR
            let array_suministros = []
            for (let proveedor_s of proveedor) {
                array_suministros.push({
                    id_suministro: proveedor_s.id_suministro,
                    id_tercero: proveedor_s.id_tercero_suministro,
                    id_tipo_producto: proveedor_s.id_tipo_producto,
                    tipo_producto: proveedor_s.tipo_producto
                })
                proveedor_s.suministros = array_suministros
            }
            //REDUCIR LOS PROVEEDORES PARA IGNORAR LOS REPETIDOS
            proveedor = this.ReduceProveedores([], proveedor)

            return proveedor
        } catch (error) {
            console.log(error)
            return { error: true, message: `Error al crear el proveedor` } //!ERROR
        }
    }

    public async Buscar_Proveedor(id_proveedor: number): Promise<any> {
        try {
            let proveedor = await this._Query_Proveedores.Buscar_Proveedor_ID(id_proveedor)
            if (!proveedor) {
                return { error: true, message: 'No se ha encontrado el proveedor' } //!ERROR
            }

            //GUARDAR LOS SUMINISTROS DEL PROVEEDORES
            let array_suministros = []
            for (let proveedor_s of proveedor) {
                array_suministros.push({
                    id_suministro: proveedor_s.id_suministro,
                    id_tercero: proveedor_s.id_tercero_suministro,
                    id_estado: proveedor_s.estado_suministro,
                    id_tipo_producto: proveedor_s.id_tipo_producto,
                    tipo_producto: proveedor_s.tipo_producto
                })
                proveedor_s.suministros = array_suministros
            }
            //REDUCIR LOS PROVEEDORES PARA IGNORAR LOS REPETIDOS
            proveedor = this.ReduceProveedores([], proveedor)

            return proveedor[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el proveedor' }
        }
    }

    public async Editar_Proveedor(id_proveedor: number, proveedor_request: Tercero) {
        try {
            const correo_proveedor_filtro: any = await this._Query_Proveedores.Buscar_Proveedor_Correo(proveedor_request)
            if (correo_proveedor_filtro?.length > 0 && correo_proveedor_filtro.filter((correo: any) => correo.id_tercero !== id_proveedor).length > 0) {
                return { error: true, message: 'Este correo ya existe' } //!ERROR
            }

            const direccion_editada = await this._Querys.Editar_Direccion(proveedor_request.direccion.id_direccion ?? 0, proveedor_request.direccion)
            if (direccion_editada !== 1) {
                return { error: true, message: 'Error al editar la dirección' } //!ERROR
            }

            const proveedor_editado = await this._Query_Proveedores.Editar_Proveedor(id_proveedor, proveedor_request)
            if (proveedor_editado?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el proveedor' } //!ERROR
            }

            if (proveedor_request.suministros) {
                for (let suministro of proveedor_request.suministros) {
                    const suministro_encontrado = await this._Query_Proveedores.Buscar_Suministro_Proveedor(suministro, id_proveedor)
                    if (suministro_encontrado) {
                        // EDITAR DETALLE
                        const requisicion_det = await this._Query_Proveedores.Editar_Suministro_Proveedor(suministro_encontrado.id_suministro, suministro)
                        if (!requisicion_det) {
                            return { error: true, message: `Error al editar el suministro` } //!ERROR
                        }
                    } else {
                        // INSERTAR DETALLE
                        const nuevo_suministro = await this._Query_Proveedores.Insertar_Sumnistro(suministro, id_proveedor)
                        if (!nuevo_suministro) {
                            return { error: true, message: `Error al crear el suministro` } //!ERROR
                        }
                    }
                }
            } else {
                return { error: true, message: `Error al editar el proveedor` } //!ERROR
            }

            //BUSCAR EL PROVEEDOR CREADO
            let proveedor = await this._Query_Proveedores.Buscar_Proveedor_ID(id_proveedor)
            if (!proveedor) {
                return { error: true, message: 'No se ha encontrado el proveedor' } //!ERROR
            }

            //GUARDAR LOS SUMINISTROS DEL PROVEEDOR
            let array_suministros = []
            for (let proveedor_s of proveedor) {
                array_suministros.push({
                    id_suministro: proveedor_s.id_suministro,
                    id_tercero: proveedor_s.id_tercero_suministro,
                    id_tipo_producto: proveedor_s.id_tipo_producto,
                    tipo_producto: proveedor_s.tipo_producto
                })
                proveedor_s.suministros = array_suministros
            }
            //REDUCIR LOS PROVEEDORES PARA IGNORAR LOS REPETIDOS
            proveedor = this.ReduceProveedores([], proveedor)

            return proveedor
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el proveedor' } //!ERROR
        }
    }

    public async Cambiar_Estado_Proveedor(id_proveedor: number, estado: number) {
        try {
            const proveedor_filtradp: any = await this._Query_Proveedores.Buscar_Proveedor_ID(id_proveedor)
            if (proveedor_filtradp?.length <= 0) {
                return { error: true, message: 'No se ha encontrado este proveedor' } //!ERROR
            }

            const requisicion = await this._Query_Proveedores.Cambiar_Estado_Proveedor(id_proveedor, estado)
            if (requisicion?.rowCount != 1) {
                return { error: true, message: 'Error al cambiar el estado del proveedor' } //!ERROR
            }

            return { error: false, message: +estado == EstadosTablas.ESTADO_ACTIVO ? `Se ha restaurado el proveedor '${proveedor_filtradp[0].nombre}'` : `Se ha inactivado el proveedor '${proveedor_filtradp[0].nombre}'` }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado del proveedor' } //!ERROR
        }
    }

}
