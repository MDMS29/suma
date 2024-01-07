import { Tipo_Orden } from "../../../Interfaces/Opciones_Basicas/IOpcioBasic";
import _QueryTipoOrdenes from "../../../querys/Opciones_Basicas/Compras/QueryTipoOrdenes";
import Querys from "../../../querys/Querys";

export default class _TipoOrdenesService {
    _Query_Tipo_Ordenes: _QueryTipoOrdenes;
    _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Tipo_Ordenes = new _QueryTipoOrdenes();
        this._Querys = new Querys();
    }
    async Obtener_Tipos_Ordenes(empresa: number) {
        try {
            const respuesta: any = await this._Query_Tipo_Ordenes.Obtener_Tipos_Ordenes(empresa)
            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado los tipos de orden' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los tipos de orden' } //!ERROR
        }
    }

    async Insertar_Tipo_Orden(req_body: Tipo_Orden, usuario_creacion: string) {
        try {

            const tipo_nombre_filtrado = await this._Query_Tipo_Ordenes.Buscar_Nombre_Tipo(req_body)
            if (tipo_nombre_filtrado && tipo_nombre_filtrado?.length > 0) {
                return { error: true, message: `Ya existe este nombre de tipo ${req_body.tipo_orden}` } //!ERROR
            }

            try {
                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, req_body.ip, req_body?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                }

                const tipo_orden = await this._Query_Tipo_Ordenes.Insertar_Tipo_Orden(req_body)
                if (!tipo_orden) {
                    return { error: true, message: `Error al insertar el tipo de orden ${req_body.tipo_orden}` } //!ERROR
                }

                req_body.id_tipo_orden = tipo_orden[0].id_tipo_orden

                ///INSERTAR LOS TIPOS DE PRODUCTOS
                for (let tipo_producto of req_body.tipos_productos) {
                    // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                    const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, req_body.ip, req_body?.ubicacion)
                    if (log !== 1) {
                        console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                    }
                    const tipo_producto_orden = await this._Query_Tipo_Ordenes.Insertar_Tipo_Producto_Orden(tipo_producto, tipo_orden[0].id_tipo_orden)
                    if (tipo_producto_orden?.length == 0 && !tipo_producto_orden) {
                        return { error: true, message: 'Error al insertar el tipo de producto' } //!ERROR
                    }
                }

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
            const respuesta: any = await this._Query_Tipo_Ordenes.Buscar_Tipo_ID(id_tipo_orden)
            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado el tipo de orden' } //!ERROR
            }

            const tipo_producto = await this._Query_Tipo_Ordenes.Obtener_Tipo_Producto_Orden(respuesta[0])
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

    async Editar_Tipo_Orden(req_body: Tipo_Orden, id_tipo_orden: number, usuario_modi: string) {
        try {

            const tipo_nombre_filtrado = await this._Query_Tipo_Ordenes.Buscar_Nombre_Tipo(req_body)
            if (tipo_nombre_filtrado && tipo_nombre_filtrado?.length > 0 && id_tipo_orden !== tipo_nombre_filtrado[0].id_tipo_orden) {
                return { error: true, message: `Ya existe este nombre de tipo ${req_body.tipo_orden}` } //!ERROR
            }

            try {
                // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, req_body.ip, req_body?.ubicacion)
                if (log !== 1) {
                    console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                }

                const tipo_orden = await this._Query_Tipo_Ordenes.Editar_Tipo_Orden(req_body, id_tipo_orden)

                if (tipo_orden !== 1) {
                    return { error: true, message: `Error al editar el tipo de orden ${req_body.tipo_orden}` } //!ERROR
                }

                for (let tipo_producto of req_body.tipos_productos) {
                    // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
                    const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, req_body.ip, req_body?.ubicacion)
                    if (log !== 1) {
                        console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${req_body.ip}, UBICACIÓN: \n ${req_body?.ubicacion}`)
                    }

                    const existe_tipo_producto = await this._Query_Tipo_Ordenes.Buscar_Tipo_Producto_Orden(tipo_producto, id_tipo_orden)

                    if (existe_tipo_producto && existe_tipo_producto?.length > 0) {
                        // EDITAR
                        tipo_producto.id_tipo_producto_orden = existe_tipo_producto[0].id_tipo_producto_orden
                        const tipo_producto_editado = await this._Query_Tipo_Ordenes.Editar_Tipo_Producto_Orden(tipo_producto, id_tipo_orden)
                        if (tipo_producto_editado != 1) {
                            return { error: true, message: 'Error al editar el tipo de producto' } //!ERROR
                        }

                    } else {
                        // INSERTAR
                        const tipo_producto_orden = await this._Query_Tipo_Ordenes.Insertar_Tipo_Producto_Orden(tipo_producto, id_tipo_orden)
                        if (tipo_producto_orden?.length == 0 && !tipo_producto_orden) {
                            return { error: true, message: 'Error al insertar el tipo de producto' } //!ERROR
                        }

                    }
                }
                const tipo_orden_editada: any = await this._Query_Tipo_Ordenes.Buscar_Tipo_ID(id_tipo_orden)
                if (tipo_orden_editada?.length <= 0) {
                    return { error: true, message: 'No se han encontrado el tipo de orden' } //!ERROR
                }

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