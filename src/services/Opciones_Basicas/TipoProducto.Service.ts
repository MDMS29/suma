import QueryTipoProducto from "../../querys/Opciones_Basicas/QueryTipoProducto";
import { Tipo_Producto } from "../../validations/Types";

export class TiposProductoService {
    private _QueryTipoProducto: QueryTipoProducto;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._QueryTipoProducto = new QueryTipoProducto();
    }

    public async Obtener_Tipos_Producto(id_empresa: number): Promise<any> {
        try {
            const respuesta = await this._QueryTipoProducto.Obtener_Tipos_Producto(id_empresa)

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado tipos de producto' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los tipos de producto' } //!ERROR
        }
    }

    public async Insertar_Tipo_Producto(tipos_producto_request: Tipo_Producto, usuario_creacion: string) {
        try {
            //VALIDAR SI EL MENU EXISTE
            const unidad_filtrada: any = await this._QueryTipoProducto.Buscar_Tipo_Producto(tipos_producto_request)
            if (unidad_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe este tipo de producto' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR MENU
            const respuesta = await this._QueryTipoProducto.Insertar_Tipo_Producto(tipos_producto_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el tipo de producto' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
            const unidad_medida = await this._QueryTipoProducto.Buscar_Tipo_Producto_ID(respuesta[0].id_tipo_producto)
            if (!unidad_medida) {
                return { error: true, message: 'No se ha encontrado el tipo de producto' } //!ERROR
            }

            return unidad_medida[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el tipo de producto' } //!ERROR
        }
    }

    public async Buscar_Tipo_Producto(id_tipo_producto: number): Promise<any> {
        try {
            const tipo_producto = await this._QueryTipoProducto.Buscar_Tipo_Producto_ID(id_tipo_producto)
            if (!tipo_producto) {
                return { error: true, message: 'No se ha encontrado el tipo de producto' } //!ERROR
            }
            return tipo_producto[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el tipo de producto' }
        }
    }

    public async Editar_Tipo_Producto(id_tipo_producto: number, tipos_producto_request: Tipo_Producto) {
        try {
            const respuesta: any = await this._QueryTipoProducto.Buscar_Tipo_Producto_ID(id_tipo_producto)

            const unidad_filtrada: any = await this._QueryTipoProducto.Buscar_Tipo_Producto(tipos_producto_request)
            if (unidad_filtrada?.length > 0 && unidad_filtrada[0].descripcion !== respuesta[0].descripcion) {
                return { error: true, message: 'Ya existe este tipo de producto' } //!ERROR
            }

            tipos_producto_request.descripcion = respuesta[0]?.descripcion === tipos_producto_request.descripcion ? respuesta[0]?.descripcion : tipos_producto_request.descripcion

            const res = await this._QueryTipoProducto.Editar_Tipo_Producto(id_tipo_producto, tipos_producto_request)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el tipo de producto' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el tipo de producto' } //!ERROR
        }
    }
}