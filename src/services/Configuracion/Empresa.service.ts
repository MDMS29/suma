import QueryEmpresa from "../../querys/Configuracion/QueryEmpresa";
import { Empresa } from '../../Interfaces/Configuracion/IConfig'

export default class EmpresaService {
    private _Query_Empresa: QueryEmpresa;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Empresa = new QueryEmpresa();
    }

    public async Obtener_Empresas(estado: number): Promise<any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Empresa.Obtener_Empresas(estado)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado empresas' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar las empresas' } //!ERROR
        }
    }

    public async Insertar_Empresa(empresa_request: Empresa, usuario_creacion: string) {
        try {
            //VALIDAR SI LA EMPRESA EXISTE
            const empresa_filtrada_nit: any = await this._Query_Empresa.Buscar_Nit(empresa_request.nit)
            if (empresa_filtrada_nit?.length > 0) {
                return { error: true, message: 'Ya existe este nit' } //!ERROR
            }
            const empresa_filtrada: any = await this._Query_Empresa.Buscar_Razon_Social(empresa_request.razon_social)
            if (empresa_filtrada?.length > 0) {
                return { error: true, message: 'Ya existe este nombre de empresa' } //!ERROR
            }



            //INVOCAR FUNCION PARA INSERTAR ROL
            const respuesta = await this._Query_Empresa.Insertar_Empresa(empresa_request, usuario_creacion)
            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear la empresa' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL ROL POR ID
            const empresa = await this._Query_Empresa.Buscar_Empresa_ID(respuesta[0].id_empresa)
            if (!empresa) {
                return { error: true, message: 'No se ha encontrado la empresa' } //!ERROR
            }

            return empresa[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear la empresa' } //!ERROR
        }
    }

    public async Buscar_Empresa(id_empresa: number): Promise<any> {
        try {
            const rol = await this._Query_Empresa.Buscar_Empresa_ID(id_empresa)
            if (!rol) {
                return { error: true, message: 'No se ha encontrado esta empresa' } //!ERROR
            }
            return rol[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error buscar la empresa' }
        }
    }

    public async Editar_Empresa(id_empresa: any, empresa_request: Empresa, usuario_modificacion: string) {

        try {
            // COMPROBAR SI ESTE ROL EXISTE
            const empresa: any = await this._Query_Empresa.Buscar_Empresa_ID(id_empresa)
            if (empresa.length === 0) {
                return { error: true, message: 'No existe esta empresa' } //!ERROR
            }

            //VERIFICACION DE EMPRESAS CON INFORMACION DUPLICADA
            const empresa_filtrada_razon: any = await this._Query_Empresa.Buscar_Razon_Social(empresa_request.razon_social)
            if (empresa_filtrada_razon?.length > 0 && empresa_filtrada_razon[0].razon_social !== empresa[0].razon_social) {
                return { error: true, message: 'Ya existe este nombre de empresa' } //!ERROR
            }

            const empresa_filtrada_nit: any = await this._Query_Empresa.Buscar_Nit(empresa_request.nit)
            if (empresa_filtrada_nit?.length > 0 && empresa_filtrada_nit[0].nit !== empresa[0].nit) {
                return { error: true, message: 'Ya existe este nit de empresa' } //!ERROR
            }


            // ACTUALIZAR
            empresa_request.nit = empresa[0]?.nit === empresa_request.nit ? empresa[0].nit : empresa_request.nit
            empresa_request.razon_social = empresa[0]?.razon_social === empresa_request.razon_social ? empresa[0].razon_social : empresa_request.razon_social
            empresa_request.telefono = empresa[0]?.telefono === empresa_request.telefono ? empresa[0].telefono : empresa_request.telefono
            empresa_request.correo = empresa[0]?.correo === empresa_request.telefono ? empresa[0].telefono : empresa_request.telefono
            empresa_request.direccion = empresa[0]?.direccion === empresa_request.telefono ? empresa[0].telefono : empresa_request.telefono

            const res = await this._Query_Empresa.Editar_Empresa(id_empresa, empresa_request, usuario_modificacion)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el rol' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar rol' } //!ERROR
        }
    }

    public async Cambiar_Estado_Empresa(id_empresa: number, estado: number) {
        try {

            const empresa_editada = await this._Query_Empresa.Cambiar_Estado_Empresa(id_empresa, estado);
            if (!empresa_editada?.rowCount) {
                return { error: true, message: 'Error al cambiar el estado de la empresa' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado de la empresa' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado de la empresa' } //!ERROR
        }
    }
}