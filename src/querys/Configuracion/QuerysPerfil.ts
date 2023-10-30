import { pool } from "../../../config/db";
import {
    _ObtenerPerfiles, _ObtenerModulosPerfil, _InsertarPerfil,
    _InsertarModuloPerfil, _BuscarPerfilID, _PermisosModulosPerfil,
    _EditarPerfil, _BuscarModulosPerfil, _EditarModuloPerfil,
    _CambiarEstadoPerfil
} from "../../dao/Configuracion/DaoPerfil";

import { PerfilUsuario } from "../../validations/Types";

export default class QueryPerfil {
    public async Obtener_Perfiles(estado: number): Promise<any> {
        const client = await pool.connect()
        try {
            let result = await client.query(_ObtenerPerfiles, [estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Modulos_Perfil(id_perfil: number): Promise<any> {
        const client = await pool.connect()

        try {
            let result = await client.query(_ObtenerModulosPerfil, [id_perfil])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Perfil({ nombre_perfil, usuario_creacion }: { nombre_perfil: string, usuario_creacion: string }) {
        const client = await pool.connect()

        try {
            const result = await client.query(_InsertarPerfil, [nombre_perfil, usuario_creacion])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Modulo_Perfil(id_perfil: number, id_modulo: number) {
        const client = await pool.connect()

        try {
            const result = await client.query(_InsertarModuloPerfil, [id_perfil, id_modulo])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Perfil_ID(id_perfil: number): Promise<PerfilUsuario | undefined> {
        const client = await pool.connect()

        try {
            const result = await client.query(_BuscarPerfilID, [id_perfil]);
            return result.rows[0]
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Perfil_Nombre(nombre_perfil: string) {
        const client = await pool.connect()

        try {
            const result = await client.query(_ObtenerPerfiles, [1]);
            const repetido = result.rows.filter(x => x.nombre_perfil.toLowerCase() === nombre_perfil.toLowerCase())
            return repetido
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Permisos_Modulos_Perfil(id_modulo: number) {
        const client = await pool.connect()

        try {
            const result = await client.query(_PermisosModulosPerfil, [id_modulo]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Perfil({ id_perfil, nombre_editado, usuario_creacion }: { id_perfil: number, nombre_editado: string, usuario_creacion: string }) {
        const client = await pool.connect()

        try {
            const result = await client.query(_EditarPerfil, [id_perfil, nombre_editado, usuario_creacion])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Modulo_Perfil(id_perfil: number, id_modulo: number) {
        const client = await pool.connect()

        try {
            const result = await client.query(_BuscarModulosPerfil, [id_perfil, id_modulo])
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Editar_Modulo_Perfil(id_perfil: number, modulo: any) {
        const client = await pool.connect()

        try {
            const result = await client.query(_EditarModuloPerfil, [id_perfil, modulo.id_modulo, modulo.id_estado])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Perfil(id_perfil: number, estado: number) {
        const client = await pool.connect()

        try {
            const result = await client.query(_CambiarEstadoPerfil, [id_perfil, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}