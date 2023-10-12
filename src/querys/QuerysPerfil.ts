import { client } from "../../config/db";
import {
    _ObtenerPerfiles, _ObtenerModulosPerfil, _InsertarPerfil,
    _InsertarModuloPerfil, _BuscarPerfilID, _PermisosModulosPerfil,
    _EditarPerfil, _BuscarModulosPerfil, _EditarModuloPerfil,
    _CambiarEstadoPerfil
} from "../dao/DaoPerfil";

import { PerfilUsuario } from "../validations/Types";

export default class QueryPerfil {
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
            const result = await client.query(_ObtenerPerfiles, [1]);
            const repetido = result.rows.filter(x => x.nombre_perfil.toLowerCase() === nombre_perfil.toLowerCase())
            return repetido
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async PermisosModulosPerfil(id_modulo: number) {
        try {
            const result = await client.query(_PermisosModulosPerfil, [id_modulo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async EditarPerfil({ id_perfil, nombre_editado, usuario_creacion }: { id_perfil: number, nombre_editado: string, usuario_creacion: string }) {
        try {
            const result = await client.query(_EditarPerfil, [id_perfil, nombre_editado, usuario_creacion])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async BuscarModuloPerfil(id_perfil: number, id_modulo: number) {
        try {
            const result = await client.query(_BuscarModulosPerfil, [id_perfil, id_modulo])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        }
    }
    public async EditarModuloPerfil(id_perfil: number, modulo: any) {
        try {
            console.log(modulo)
            const result = await client.query(_EditarModuloPerfil, [id_perfil, modulo.id_modulo, modulo.id_estado])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async CambiarEstadoPerfil(id_perfil: number, estado: number) {
        try {
            const result = await client.query(_CambiarEstadoPerfil, [id_perfil, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }
}