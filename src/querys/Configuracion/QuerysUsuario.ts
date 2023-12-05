import { Database, _DB } from "../../config/db";

import {
    _FALoginUsuario, _FAModulosUsuario, _FAMenusModulos,
    _FAAccionesModulos, _FAInsertarUsuario, _FABuscarUsuarioID,
    _FABuscarUsuarioCorreo, _PAInsertarRolModuloUsuario, _PAInsertarPerfilUsuario,
    _FAObtenerUsuario, _EditarUsuario, _BuscarPerfilUsuario,
    _EditarPerfilUsuario, _BuscarRolUsuario, _EditarRolUsuario,
    _CambiarEstadoUsuario, _CambiarClaveUsuario, _Insertar_Empresa_Usuario, _Editar_Empresa_Usuario, _FAIncio_Cierre_Sesion
} from "../../dao/Configuracion/DaoUsuario";

import {
    ModulosUsuario, MenusModulos, PermisosModulos
} from '../../Interfaces/Configuracion/IConfig'

import bcrypt from "bcryptjs";


export default class QueryUsuario extends Database {
    private pool;
    constructor() {
        super()
        this.pool = this.connect_query()
    }

    public async Autenticar_Usuario({ usuario, clave }: any) {
        try {
            //FUNCIÓN ALMACENADA PARA BUSCAR LA INFORMACIÓN DEL USUARIO DEPENDIENDO DEL CAMPO DE "USUARIO"
            const result = await _DB.func(_FALoginUsuario, [usuario])
            if (result.length !== 0) {
                //COMPARACIÓN DE LAS CLAVES HASHEADAS
                const matches = await bcrypt.compare(clave, result[0].clave)
                if (matches) {
                    return result
                }
                return
            }
            return
        } catch (error) {
            console.log(error)
        }
    }

    public async Inicio_Cierre_Sesion(usuario: string, accion: string, ip: string, ubicacion: string) {
        try {
            //FUNCIÓN ALMACENADA PARA BUSCAR LA INFORMACIÓN DEL USUARIO DEPENDIENDO DEL CAMPO DE "USUARIO"
            const result = await _DB.func(_FAIncio_Cierre_Sesion, [usuario, accion, ip,ubicacion])
            return result
        } catch (error) {
            console.log(error)
        }
    }

    public async Modulos_Usuario(id_usuario: number): Promise<undefined | ModulosUsuario[]> {
        try {
            //FUNCTIÓN ALMACENADA PARA BUSCAR LOS MODULOS DEL USUARIO POR EL ID DEL USUARIO
            const result = await _DB.func(_FAModulosUsuario, [id_usuario, 1])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Menu_Modulos(id_usuario: number, id_modulo: number): Promise<[] | MenusModulos[]> {
        try {
            //FUNCIÓN ALMACENADA PARA TOMAR LOS MENUS DE CADA UNO DE LOS MODULOS DEL USUARIO
            const result = await _DB.func(_FAMenusModulos, [id_usuario, id_modulo])
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

    public async Permisos_Modulo(id_modulo: number, id_usuario: number): Promise<[] | PermisosModulos[]> {
        try {
            //FUNCIÓN ALMACENADA PARA TOMAR LOS ACCIONES PERMITIDAS PARA CADA UNO DE LOS MODULOS DEL USUARIO
            const result = await _DB.func(_FAAccionesModulos, [id_modulo, id_usuario])
            return result
        } catch (error) {
            console.log(error)
            return []
        }
    }

    public async Obtener_Usuarios(estado: string, empresa: number) {
        try {
            //FUNCIÓN ALMACENADA PARA TOMAR LOS USUARIOS SEGUN UN ESTADO
            const result = await _DB.func(_FAObtenerUsuario, [estado, empresa])
            return result
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Usuario_ID(id: number) {
        try {
            //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU ID
            let result = await _DB.func(_FABuscarUsuarioID, [id])

            return result

        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Buscar_Usuario_Correo(usuario = '', correo = '') {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            if (usuario !== '' && correo !== '') {
                //FUNCIÓN ALMACENADA PARA BUSCAR EL USUARIO POR SU USUARIO Y CORREO
                let result = await _DB.func(_FABuscarUsuarioCorreo, [usuario, correo])
                return result
            }
            if (usuario !== '') {
                let result = await client.query('SELECT tu.usuario, tu.nombre_completo FROM seguridad.tbl_usuario tu WHERE tu.usuario = $1', [usuario])
                return result.rows
            }
            if (correo !== '') {
                let result = await client.query('SELECT tu.correo FROM seguridad.tbl_usuario tu WHERE tu.correo = $1', [correo])
                return result.rows
            }
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Insertar_Usuario(RequestUsuario: any, UsuarioCreador: string): Promise<number | undefined> {
        const { nombre_completo, usuario, clave, correo } = RequestUsuario

        try {
            //FUNCTIÓN ALMACENADA PARA INSERTAR LA INFORMACIÓN DEL USUARIO Y RETORNAR EL NUEVO ID
            const result = await _DB.func(_FAInsertarUsuario, [nombre_completo, usuario, clave, UsuarioCreador, correo]);
            if (result) {
                return result[0].insertar_usuario;
            }
            return
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Perfil_Usuario(id_usuario: number, perfil: any) {
        try {
            //PROCESO ALMACENADO PARA INSERTAR LOS PERFILES DEL USUARIO 
            await _DB.proc(_PAInsertarPerfilUsuario, [id_usuario, perfil.id_perfil]);
            return true
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Rol_Modulo(id_usuario: number, rol: any) {
        try {
            //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
            await _DB.proc(_PAInsertarRolModuloUsuario, [id_usuario, rol.id_rol]);
            return true
        } catch (error) {
            console.log(error)
            return
        }
    }

    public async Insertar_Empresa_Usuario(id_usuario: number, id_empresa: any, UsuarioCreador: string) {
        const client = await this.pool.connect()
        try {
            //PROCESO ALMACENADO PARA INSERTAR LOS ROLES DEL USUARIO 
            const result = await client.query(_Insertar_Empresa_Usuario, [id_empresa, id_usuario, UsuarioCreador]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Usuario({ id_usuario, Usuario_Editado, Nombre_Editado, Correo_Editado, Clave_Editada }: any, UsuarioModificador: string) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_EditarUsuario, [id_usuario, Nombre_Editado, Usuario_Editado, Clave_Editada, UsuarioModificador, Correo_Editado])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Empresa_Usuario(id_empresa: string, id_usuario: string, UsuarioModificador: string) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_Editar_Empresa_Usuario, [id_usuario, id_empresa, UsuarioModificador])
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Perfil_Usuario(id_perfil: number, usuario: number) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_BuscarPerfilUsuario, [usuario, id_perfil]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Perfil_Usuario(id_perfil: number, id_estado: number, usuario: number) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_EditarPerfilUsuario, [usuario, id_perfil, id_estado]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Buscar_Rol_Usuario(id_rol: number, usuario: number) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_BuscarRolUsuario, [usuario, id_rol]);
            return result.rows
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Editar_Rol_Usuario(id_rol: number, id_estado: string, usuario: number) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_EditarRolUsuario, [usuario, id_rol, id_estado]);
            return result.rowCount
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }

    public async Cambiar_Estado_Usuario(usuario: number, estado: string) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_CambiarEstadoUsuario, [usuario, estado]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
    public async Cambiar_Clave_Usuario(id_usuario: number, clave: string, cm_clave: boolean) {
        const client = await this.pool.connect(); // Obtiene una conexión de la piscina

        try {
            const result = await client.query(_CambiarClaveUsuario, [id_usuario, clave, cm_clave]);
            return result
        } catch (error) {
            console.log(error)
            return
        } finally {
            client.release();
        }
    }
}