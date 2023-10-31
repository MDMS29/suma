import QueryMarcaProducto from "../../querys/Opciones_Basicas/QueryMarcaProducto";
import { Marca_Producto } from "../../validations/Types";

export class MarcaProductoService {
    private _Query_Marca_Producto: QueryMarcaProducto;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Marca_Producto = new QueryMarcaProducto();
    }

    public async Obtener_Marcas_Producto(): Promise<any> {
        try {
            const respuesta = await this._Query_Marca_Producto.Obtener_Marcas_Producto()

            if (respuesta?.length <= 0) {
                return { error: false, message: 'No se han encontrado las marcas de productos' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las marcas de productos' } //!ERROR
        }
    }

    public async Insertar_Marca_Producto(marca_producto_request: Marca_Producto, usuario_creacion: string) {
        try {
            //VALIDAR SI EL MENU EXISTE
            const marca_filtrada: any = await this._Query_Marca_Producto.Buscar_Marca_Producto(marca_producto_request)
            if (marca_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe esta marca' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR MENU
            const respuesta = await this._Query_Marca_Producto.Insertar_Marca_Producto(marca_producto_request, usuario_creacion)

            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear la marca de producto' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL MENU POR ID
            const marca_producto = await this._Query_Marca_Producto.Buscar_Marca_Producto_ID(respuesta[0].id_marca)
            if (!marca_producto) {
                return { error: true, message: 'No se ha encontrado la marca de producto' } //!ERROR
            }

            return marca_producto[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear la marca de producto' } //!ERROR
        }
    }

    public async Buscar_Marca_Producto(id_marca_producto: number): Promise<any> {
        try {
            const tipo_producto = await this._Query_Marca_Producto.Buscar_Marca_Producto_ID(id_marca_producto)
            if (!tipo_producto) {
                return { error: true, message: 'No se ha encontrado la marca' } //!ERROR
            }
            return tipo_producto[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar la marca' }
        }
    }

    public async Editar_Marca_Producto(id_marca_producto: number, marca_producto_request: Marca_Producto) {
        try {
            const respuesta: any = await this._Query_Marca_Producto.Buscar_Marca_Producto_ID(id_marca_producto)

            const marca_filtrada: any = await this._Query_Marca_Producto.Buscar_Marca_Producto(marca_producto_request)
            if (marca_filtrada?.length > 0 && marca_filtrada[0].marca !== respuesta[0].marca) {
                return { error: true, message: 'Ya existe esta marca' } //!ERROR
            }

            marca_producto_request.marca = respuesta[0]?.marca === marca_producto_request.marca ? respuesta[0]?.marca : marca_producto_request.marca

            const res = await this._Query_Marca_Producto.Editar_Marca_Producto(id_marca_producto, marca_producto_request)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar la marca' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar la marca' } //!ERROR
        }
    }
}