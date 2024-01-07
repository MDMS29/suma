import QueryFamiliaProducto from "../../querys/Opciones_Basicas/QueryFamiliaProducto";
import { Familia_Producto } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'
import Querys from "../../querys/Querys";

export class FamiliaProductoService {
    private _Query_Familia_Producto: QueryFamiliaProducto;
    private _Querys: Querys;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Familia_Producto = new QueryFamiliaProducto();
        this._Querys = new Querys();
    }

    public async Obtener_Familias_Producto(estado: number, empresa: number): Promise<any> {
        try {
            const respuesta = await this._Query_Familia_Producto.Obtener_Familias_Producto(estado, empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado familias de productos' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las familias de productos' } //!ERROR
        }
    }

    public async Insertar_Familia_Producto(familia_producto_request: Familia_Producto, usuario_creacion: string) {
        try {
            const familia_filtrada: any = await this._Query_Familia_Producto.Buscar_Familia_Producto(familia_producto_request)
            if (familia_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe esta familia de producto' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_creacion, familia_producto_request.ip, familia_producto_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_creacion}, IP: \n ${familia_producto_request.ip}, UBICACIÓN: \n ${familia_producto_request?.ubicacion}`)
            }

            const respuesta = await this._Query_Familia_Producto.Insertar_Familia_Producto(familia_producto_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear la familia de productos' } //!ERROR
            }

            const familia_producto = await this._Query_Familia_Producto.Buscar_Familia_Producto_ID(respuesta[0].id_familia)
            if (!familia_producto) {
                return { error: true, message: 'No se ha encontrado la familia de productos' } //!ERROR
            }

            return familia_producto[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear la familia de productos' } //!ERROR
        }
    }

    public async Buscar_Familia_Producto(id_familia_producto: number): Promise<any> {
        try {
            const familia_producto = await this._Query_Familia_Producto.Buscar_Familia_Producto_ID(id_familia_producto)
            if (!familia_producto) {
                return { error: true, message: 'No se ha encontrado la familia' } //!ERROR
            }
            return familia_producto[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la familia' }
        }
    }

    public async Editar_Familia_Producto(id_familia_producto: number, familia_producto_request: Familia_Producto, usuario_modi: string) {
        try {
            const respuesta: any = await this._Query_Familia_Producto.Buscar_Familia_Producto_ID(id_familia_producto)

            const familia_filtrada_referencia: any = await this._Query_Familia_Producto.Buscar_Familia_Producto(familia_producto_request)
            if (familia_filtrada_referencia?.length > 0 && familia_filtrada_referencia[0].referencia !== respuesta[0].referencia && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe esta referencia' } //!ERROR
            }

            const familia_filtrada_descripcion: any = await this._Query_Familia_Producto.Buscar_Familia_Descripcion(familia_producto_request)
            if (familia_filtrada_descripcion?.length > 0 && familia_filtrada_descripcion[0].descripcion !== respuesta[0].descripcion && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe este nombre de familia' } //!ERROR
            }

            familia_producto_request.referencia = respuesta[0]?.referencia === familia_producto_request.referencia ? respuesta[0]?.referencia : familia_producto_request.referencia
            familia_producto_request.descripcion = respuesta[0]?.descripcion === familia_producto_request.descripcion ? respuesta[0]?.descripcion : familia_producto_request.descripcion

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario_modi, familia_producto_request.ip, familia_producto_request?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario_modi}, IP: \n ${familia_producto_request.ip}, UBICACIÓN: \n ${familia_producto_request?.ubicacion}`)
            }

            const res = await this._Query_Familia_Producto.Editar_Familia_Producto(id_familia_producto, familia_producto_request)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar la familia' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar la familia' } //!ERROR
        }
    }

    public async Cambiar_Estado_Familia(id_familia_producto: number, estado: number, info_user: any, usuario: string) {
        try {
            const familia_filtrada: any = await this._Query_Familia_Producto.Buscar_Familia_Producto_ID(id_familia_producto)
            if (familia_filtrada?.length <= 0) {
                return { error: true, message: 'No se ha encontrado esta la familia' } //!ERROR
            }

            // AGREGAR INFORMACION DEL USUARIO PARA INSERTAR LOG DE AUDITORIA
            const log = await this._Querys.Insertar_Log_Auditoria(usuario, info_user.ip, info_user?.ubicacion)
            if (log !== 1) {
                console.log(`ERROR AL INSERTAR LOGS DE AUDITORIA: USUARIO: \n ${usuario}, IP: \n ${info_user.ip}, UBICACIÓN: \n ${info_user?.ubicacion}`)
            }

            const familia_cambiada = await this._Query_Familia_Producto.Cambiar_Estado_Familia(id_familia_producto, estado)
            if (familia_cambiada?.rowCount != 1) {
                return { error: true, message: 'Error al cambiar el estado de la familia' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado de la familia' } //!ERROR
        }
    }
}