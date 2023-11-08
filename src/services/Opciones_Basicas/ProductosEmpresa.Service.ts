import QueryProductosEmpresa from "../../querys/Opciones_Basicas/QueryProductosEmpresa";
import { Producto_Empresa } from '../../Interfaces/Opciones_Basicas/IOpcioBasic'

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

    public async Buscar_Producto_Empresa(id_producto: number): Promise<any> {
        try {
            const producto_empresa = await this._Query_Productos_Empresa.Buscar_Producto_ID(id_producto)
            if (!producto_empresa) {
                return { error: true, message: 'No se ha encontrado el producto' } //!ERROR
            }
            return producto_empresa[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el producto' }
        }
    }

    public async Buscar_Producto_Filtro(tipo: string, valor: number): Promise<any> {
        const TIPOS_FILTROS = {
            tipo_producto: 'tipo_producto',
        }
        try {
            if (TIPOS_FILTROS.tipo_producto === tipo) {
                const producto_empresa = await this._Query_Productos_Empresa.Buscar_Producto_Filtro(tipo, valor)
                if (!producto_empresa) {
                    return { error: true, message: 'No se han encontrado los productos' } //!ERROR
                }
                return producto_empresa
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar los productos' }
        }
    }


    public async Editar_Producto_Empresa(id_producto: number, producto_empresa_request: Producto_Empresa, usuario_edicion: string) {
        try {
            const respuesta: any = await this._Query_Productos_Empresa.Buscar_Producto_ID(id_producto)

            const producto_filtrado_refe: any = await this._Query_Productos_Empresa.Buscar_Producto_Referencia(producto_empresa_request)
            if (producto_filtrado_refe?.length > 0 && producto_filtrado_refe[0].referencia !== respuesta[0].referencia && producto_empresa_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe esta referencia' } //!ERROR
            }

            const producto_filtrado_desc: any = await this._Query_Productos_Empresa.Buscar_Producto_Nombre(producto_empresa_request)
            if (producto_filtrado_desc?.length > 0 && producto_filtrado_desc[0].descripcion !== respuesta[0].descripcion && producto_empresa_request.id_empresa === respuesta[0].id_empresa) {
                return { error: true, message: 'Ya existe este nombre de producto' } //!ERROR
            }


            producto_empresa_request.referencia = respuesta[0]?.referencia === producto_empresa_request.referencia ? respuesta[0]?.referencia : producto_empresa_request.referencia
            producto_empresa_request.descripcion = respuesta[0]?.descripcion === producto_empresa_request.descripcion ? respuesta[0]?.descripcion : producto_empresa_request.descripcion

            producto_empresa_request.foto = producto_empresa_request.foto === '' ? respuesta[0].foto : producto_empresa_request.foto


            const res = await this._Query_Productos_Empresa.Editar_Producto_Empresa(id_producto, producto_empresa_request, usuario_edicion)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el producto' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el producto' } //!ERROR
        }
    }

    public async Cambiar_Estado_Producto(id_producto: number, estado: number) {
        try {
            const producto_filtrado: any = await this._Query_Productos_Empresa.Buscar_Producto_ID(id_producto)
            if (producto_filtrado?.length <= 0) {
                return { error: true, message: 'No se ha encontrado este producto' } //!ERROR
            }

            const producto = await this._Query_Productos_Empresa.Cambiar_Estado_Producto(id_producto, estado)
            if (producto?.rowCount != 1) {
                return { error: true, message: 'Error al cambiar el estado del producto' } //!ERROR
            }

            return { error: false, message: '' } //*SUCCESSFUL
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado del producto' } //!ERROR
        }
    }
}