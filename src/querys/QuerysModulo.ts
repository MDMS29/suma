import { client } from "../../config/db"
import { _ObtenerModulos } from "../dao/DaoModulo"

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
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }
}