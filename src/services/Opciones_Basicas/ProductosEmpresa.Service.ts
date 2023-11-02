import QueryProductosEmpresa from "../../querys/Opciones_Basicas/QueryProductosEmpresa";
import { Producto_Empresa } from "../../validations/Types";

export class ProductosEmpresaService {
    private _Query_Productos_Empresa: QueryProductosEmpresa;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Productos_Empresa = new QueryProductosEmpresa();
    }

    public async Obtener_Productos_Empresa(estado: number, empresa: number): Promise<any> {
        try {
            const respuesta = await this._Query_Productos_Empresa.Obtener_Productos_Empresa(estado, empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado los productos' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los productos' } //!ERROR
        }
    }

    public async Insertar_Producto_Empresa(producto_empresa_request: Producto_Empresa, usuario_creacion: string) {
        try {
            //TODO: ARREGLAR VALIDACION DE DATOS
            const familia_filtrada_nombre: any = await this._Query_Productos_Empresa.Buscar_Producto_Nombre(producto_empresa_request)
            if (familia_filtrada_nombre?.length > 0) {
                return { error: true, message: 'Ya existe este nombre de producto' } //!ERROR
            }
            const producto_filtrado_refe: any = await this._Query_Productos_Empresa.Buscar_Producto_Referencia(producto_empresa_request)
            if (producto_filtrado_refe?.length > 0) {
                return { error: true, message: 'Ya existe esta referencia de producto' } //!ERROR
            }

            //MOSTRAR POR DEFAULT UNA IMAGEN SI NO EXISTE
            producto_empresa_request.foto = producto_empresa_request.foto === '' ? 'imagen.png' : producto_empresa_request.foto

            const respuesta = await this._Query_Productos_Empresa.Insertar_Producto_Empresa(producto_empresa_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el producto' } //!ERROR
            }

            const producto_empresa = await this._Query_Productos_Empresa.Buscar_Producto_ID(respuesta[0].id_producto)
            if (!producto_empresa) {
                return { error: true, message: 'No se ha encontrado el producto' } //!ERROR
            }

            return producto_empresa[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el producto' } //!ERROR
        }
    }

    // public async Buscar_Familia_Producto(id_familia_producto: number): Promise<any> {
    //     try {
    //         const familia_producto = await this._Query_Productos_Empresa.Buscar_Familia_Producto_ID(id_familia_producto)
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
    //         const respuesta: any = await this._Query_Productos_Empresa.Buscar_Familia_Producto_ID(id_familia_producto)

    //         const familia_filtrada_referencia: any = await this._Query_Productos_Empresa.Buscar_Familia_Producto(familia_producto_request)
    //         if (familia_filtrada_referencia?.length > 0 && familia_filtrada_referencia[0].referencia !== respuesta[0].referencia && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
    //             return { error: true, message: 'Ya existe esta referencia' } //!ERROR
    //         }

    //         const familia_filtrada_descripcion: any = await this._Query_Productos_Empresa.Buscar_Familia_Descripcion(familia_producto_request)
    //         if (familia_filtrada_descripcion?.length > 0 && familia_filtrada_descripcion[0].descripcion !== respuesta[0].descripcion && familia_producto_request.id_empresa === respuesta[0].id_empresa) {
    //             return { error: true, message: 'Ya existe este nombre de familia' } //!ERROR
    //         }

    //         familia_producto_request.referencia = respuesta[0]?.referencia === familia_producto_request.referencia ? respuesta[0]?.referencia : familia_producto_request.referencia
    //         familia_producto_request.descripcion = respuesta[0]?.descripcion === familia_producto_request.descripcion ? respuesta[0]?.descripcion : familia_producto_request.descripcion

    //         const res = await this._Query_Productos_Empresa.Editar_Familia_Producto(id_familia_producto, familia_producto_request)
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
    //         const familia_filtrada: any = await this._Query_Productos_Empresa.Buscar_Familia_Producto_ID(id_familia_producto)
    //         if (familia_filtrada?.length <= 0) {
    //             return { error: true, message: 'No se ha encontrado esta la familia' } //!ERROR
    //         }

    //         const familia_cambiada = await this._Query_Productos_Empresa.Cambiar_Estado_Familia(id_familia_producto, estado)
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