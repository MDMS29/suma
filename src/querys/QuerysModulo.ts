import { client } from "../../config/db"
import {
    _BuscarCodigoModulo, _BuscarIconoModulo, _BuscarModuloID,
    _BuscarModuloNombre, _BuscarRolModulo, _CambiarEstadoModulo, _EditarModulo,
    _EditarRolModulo, _InsertarModulo, _InsertarRolModulo, _ObtenerModulos,
    _ObtenerRolesModulo, _ObtenerUltimoID
} from "../dao/DaoModulo"
import { ModulosUsuario } from "../validations/Types"

export default class QueryModulo {
    public async Obtener_Modulos(estado: number): Promise<any> {
        try {
            const result = await client.query(_ObtenerModulos, [estado])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Modulo_Nombre(nombre_modulo: string): Promise<any> {
        try {
            const result = await client.query(_BuscarModuloNombre, [nombre_modulo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Codigo_Modulo(codigo: string): Promise<any> {
        try {
            const result = await client.query(_BuscarCodigoModulo, [codigo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Modulo_ID(id_modulo: number): Promise<any> {
        try {
            const result = await client.query(_BuscarModuloID, [id_modulo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Obtener_Roles_Modulo(id_modulo: number): Promise<any> {
        try {
            const result = await client.query(_ObtenerRolesModulo, [id_modulo])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Icono_Modulo(id_modulo: number): Promise<any> {
        try {
            const result = await client.query(_BuscarIconoModulo, [id_modulo])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Modulo(nombre_modulo: string, usuario_creador: string, codigo: string, icono: string): Promise<any> {
        try {
            const result = await client.query(_InsertarModulo, [codigo, nombre_modulo, icono, usuario_creador])
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Roles_Modulo(id_rol: number, id_modulo: number, usuario_creador: string): Promise<any> {
        try {
            let ultimo_id: any = await client.query(_ObtenerUltimoID)

            ultimo_id = ultimo_id.rows[0].id_rol_modulo + 1

            const result = await client.query(_InsertarRolModulo, [ultimo_id, id_modulo, id_rol, usuario_creador])
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Editar_Modulo(id_modulo: number, nuevoModulo: Partial<ModulosUsuario>, usuario_modi: string) {
        try {
            const result = await client.query(_EditarModulo, [id_modulo, nuevoModulo.cod_modulo, nuevoModulo.nombre_modulo, nuevoModulo.icono, usuario_modi])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Cambiar_Estado_Modulo(id_modulo: number, estado: number) {
        try {
            const result = await client.query(_CambiarEstadoModulo, [id_modulo, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Rol_Modulo(id_modulo: number, rol: number) {
        try {
            const result = await client.query(_BuscarRolModulo, [id_modulo, rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Editar_Rol_Modulo(rol_modulo: number, estado: number) {
        try {
            const result = await client.query(_EditarRolModulo, [rol_modulo, estado]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        }
    }
}