import { client } from "../../config/db";
import {
    _buscar_empresa_id, _buscar_empresa_nit, _buscar_razon_social, _CambiarEstadoRol,
    _editar_empresa, _insertar_empresa, _obtener_empresas
} from "../dao/DaoEmpresa";
import { Empresa } from "../validations/Types";

export default class QueryEmpresa {
    public async Obtener_Empresas(estado: number): Promise<any> {
        try {
            let result = await client.query(_obtener_empresas, [estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Razon_Social(razon_social: string) {
        try {
            let result = await client.query(_buscar_razon_social, [razon_social]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Empresa(empresa_request: Empresa, usuario_creacion: string) {
        const { nit, razon_social, direccion, telefono, correo } = empresa_request
        try {
            let result = await client.query(_insertar_empresa, [nit, razon_social, telefono, direccion, correo, usuario_creacion]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Empresa_ID(id_empresa: number) {
        try {
            let result = await client.query(_buscar_empresa_id, [id_empresa]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Nit(nit: string) {
        try {
            let result = await client.query(_buscar_empresa_nit, [nit]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Editar_Empresa(id_empresa: number, empresa_request: Empresa, usuario_modificacion: string) {
        const { nit, razon_social, direccion, telefono, correo } = empresa_request

        try {
            let result = await client.query(_editar_empresa, [id_empresa, nit, razon_social, telefono, direccion, correo, usuario_modificacion]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Cambiar_Estado_Rol(id_rol: number, estado: number) {
        try {
            let result = await client.query(_CambiarEstadoRol, [id_rol, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}