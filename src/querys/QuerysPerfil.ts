import { client } from "../../config/db";
import { _ObtenerPerfiles, _ObtenerModulosPerfil, _InsertarPerfil, _InsertarModuloPerfil, _BuscarPerfilID, _BuscarPerfilNombre, _PermisosModulosPerfil } from "../dao/DaoPerfil";
import { PerfilUsuario } from "../validations/Types";

export class QueryPerfil {
    public async ObtenerPerfiles(estado: number): Promise<any> {
        try {
            let result = await client.query(_ObtenerPerfiles, [estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async ModulosPerfil(id_perfil: number): Promise<any> {
        try {
            let result = await client.query(_ObtenerModulosPerfil, [id_perfil])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async InsertarPerfil({ nombre_perfil, usuario_creacion }: { nombre_perfil: string, usuario_creacion: string }) {
        try {
            const result = await client.query(_InsertarPerfil, [nombre_perfil, usuario_creacion])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async InsertarModuloPerfil(id_perfil: number, id_modulo: number) {
        try {
            const result = await client.query(_InsertarModuloPerfil, [id_perfil, id_modulo])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarPerfilID(id_perfil: number): Promise<PerfilUsuario | undefined> {
        try {
            const result = await client.query(_BuscarPerfilID, [id_perfil]);
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarPerfilNombre(nombre_perfil: string) {
        try {
            const result = await client.query(_BuscarPerfilNombre, [nombre_perfil]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async PermisosModulosPerfil(id_modulo: number) {
        try {
            const result = await client.query(_PermisosModulosPerfil, [id_modulo]);
            return result. rows
        } catch (error) {
            console.log(error)
            return
        }
    }
}