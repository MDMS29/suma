import { client } from "../../config/db"
import {
    _BuscarCodigoModulo, _BuscarModuloID,
    _BuscarModuloNombre, _InsertarModulo, _ObtenerModulos
} from "../dao/DaoModulo"
import { ModulosUsuario } from "../validations/Types"

export default class QueryModulo {
    public async ObtenerModulos(estado: number): Promise<any> {
        try {
            const result = await client.query(_ObtenerModulos, [estado])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarModuloNombre(nombre_modulo: string): Promise<any> {
        try {
            const result = await client.query(_BuscarModuloNombre, [nombre_modulo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarCodigoModulo(codigo: string): Promise<any> {
        try {
            const result = await client.query(_BuscarCodigoModulo, [codigo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarModuloID(id_modulo: number): Promise<any> {
        try {
            const result = await client.query(_BuscarModuloID, [id_modulo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async InsertarModulo(nombre_modulo: string, usuario_creador: string, codigo: string, icono: string): Promise<any> {
        try {
            const result = await client.query(_InsertarModulo, [codigo, nombre_modulo, icono, usuario_creador])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async EditarModulo(id_modulo: number, Request_Modulo: Partial<ModulosUsuario>, usuario_modi: string) {
        try {
            const result = await client.query(_InsertarModulo, [id_modulo, Request_Modulo.cod_modulo, Request_Modulo.nombre_modulo, Request_Modulo.icono, usuario_modi])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}