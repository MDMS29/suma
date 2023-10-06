import {
    _QueryAutenticarUsuario, _QueryBuscarUsuarioCorreo, _QueryBuscarUsuarioID,
    _QueryMenuModulos, _QueryInsertarUsuario, _QueryPermisosModulo,
    _QueryInsertarRolModulo, _QueryInsertarPerfilUsuario, _QueryModulosUsuario,
    _QueryObtenerUsuarios, _QueryEditarUsuario, _QueryBuscarPerfilUsuario,
    _QueryEditarPerfilUsuario, _QueryBuscarRolUsuario, _QueryEditarRolUsuario, _QueryCambiarEstadoUsuario
} from "../querys/QuerysUsuarios";
import { PerfilUsuario, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";

let bcrypt = require('bcrypt')

export class _UsuarioService {
    public async AutenticarUsuario(object: UsuarioLogin) {
        const { usuario, clave } = object;
        //----OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO----
        const respuesta = await _QueryAutenticarUsuario({ usuario, clave })
        if (respuesta) {
            for (const res of respuesta) {
                res.perfiles = {
                    id_perfil: res.id_perfil,
                    nombre_perfil: res.nombre_perfil,
                    estado_perfil: res.id_estado_perfil
                }
            }

            //----CARGAR PERFILES DE USUARIO----
            let perfilLogin: PerfilUsuario[] = [] //ARRAY DE LOS PERFILES DEL USUARIO
            respuesta.forEach((res: any) => perfilLogin.push(res?.perfiles));
            //----CARGAR MODULOS DEL USUARIO----
            const modulos = await _QueryModulosUsuario(respuesta[0]?.id_usuario)
            if (modulos) {
                respuesta.modulos = modulos
                for (const modulo of modulos) {
                    //CARGA DE MENUS DE LOS MODULOS
                    const response = await _QueryMenuModulos(respuesta[0]?.id_usuario, modulo.id_modulo)
                    modulo.menus = response
                    //CARGAR PERMISOS DEL MODULO
                    const permisos = await _QueryPermisosModulo(modulo.id_modulo, respuesta[0]?.id_usuario)
                    modulo.permisos = permisos
                }
            }

            //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
            const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado } = respuesta[0]
            respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
            //RETORNO DE LA ESTRUCTURA DEL USUARIO Y MODULOS
            return {
                usuario:
                {
                    id_usuario,
                    nombre_completo,
                    usuario,
                    fecha_creacion,
                    correo,
                    id_estado,
                    token: respuesta.token,
                    perfiles: perfilLogin
                },
                modulos: respuesta.modulos
            }
        }
        return undefined
    }
    public async ObtenerUsuarios(estado: string) {
        //VERIFICACIÓN DEL TIPO DE LA VARIABLE
        if (typeof estado === 'number') {
            throw new Error('Error al obtener el estado del usuario')
        }

        try {
            //RESPUESTA DE LA CONSULTA
            const respuesta = await _QueryObtenerUsuarios(estado)
            if (respuesta) {
                return respuesta
            }
        } catch (error) {
            console.log(error)
            return
        }
        return

    }
    public async InsertarUsuario(RequestUsuario: any, UsuarioCreador: string): Promise<any> {
        const { usuario, correo, clave } = RequestUsuario

        //BUSCAR EL USUARIO POR SU USUARIO Y CORREO
        const respuesta = await _QueryBuscarUsuarioCorreo(usuario, correo)
        if (respuesta) {
            //SI EL USUARIO YA ESTA REGISTRADO MOSTRAR ERROR
            return { error: true, message: 'Este usuario ya existe' }
        }
        if (clave) {
            //HASHEAR CLAVE DEL USUARIO
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            RequestUsuario.clave = hash
            //FUNCIOÓN PARA REGISTRAR LA INFORMACIÓN PRINCIPAL DEL USUARIO 
            const respuesta = await _QueryInsertarUsuario(RequestUsuario, UsuarioCreador)
            if (respuesta) {
                for (let perfil of RequestUsuario.perfiles) {
                    const res = await _QueryInsertarPerfilUsuario(respuesta, perfil) // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        throw new Error('Error al insertar el perfil')
                    }
                }
                for (let rol of RequestUsuario.roles) {
                    const res = await _QueryInsertarRolModulo(respuesta, rol)// GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        throw new Error('Error al insertar el rol')
                    }
                }
                const data = await _QueryBuscarUsuarioID(respuesta) //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                return data
            }
            //ERRORES DE INSERCIÓN A LA BASE DE DATOS
            throw new Error('Error al guardar el usuario')
        } else {
            //ERROR AL HASHEAR LA CLAVE DEL USUARIO
            throw new Error('Error al hashear clave de usuario')
        }
    }
    public async BuscarUsuario(id = 0, p_user = '') {
        if (p_user === 'param' && id !== 0) {
            const respuesta = await _QueryBuscarUsuarioID(id)
            if (respuesta.length <= 0) {
                return { error: true, message: "No se ha encontado el usuario" }
            }
            if (respuesta) {
                for (const res of respuesta) {
                    res.perfiles = {
                        id_perfil: res.id_perfil,
                        nombre_perfil: res.nombre_perfil,
                        estado_perfil: res.id_estado_perfil
                    }
                }

                //----CARGAR PERFILES DE USUARIO----
                let perfilLogin: PerfilUsuario[] = [] //ARRAY DE LOS PERFILES DEL USUARIO
                respuesta.forEach((res: any) => perfilLogin.push(res?.perfiles));
                //----CARGAR MODULOS DEL USUARIO----
                const modulos = await _QueryModulosUsuario(respuesta[0]?.id_usuario)
                if (modulos) {
                    respuesta.modulos = modulos
                    for (const modulo of modulos) {
                        //CARGA DE MENUS DE LOS MODULOS
                        const response = await _QueryMenuModulos(respuesta[0]?.id_usuario, modulo.id_modulo)
                        modulo.menus = response
                        //CARGAR PERMISOS DEL MODULO
                        const permisos = await _QueryPermisosModulo(modulo.id_modulo, respuesta[0]?.id_usuario)
                        modulo.permisos = permisos
                    }
                }

                //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado } = respuesta[0]
                // respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
                return {
                    usuario:
                    {
                        id_usuario,
                        nombre_completo,
                        usuario,
                        fecha_creacion,
                        correo,
                        id_estado,
                        perfiles: perfilLogin
                    },
                    modulos: respuesta.modulos
                }
            }
        }
        if (id !== 0 && p_user == '') {
            const respuesta = await _QueryBuscarUsuarioID(id)
            if (respuesta) {
                for (const res of respuesta) {
                    res.perfiles = {
                        id_perfil: res.id_perfil,
                        nombre_perfil: res.nombre_perfil,
                        estado_perfil: res.id_estado_perfil
                    }
                }

                //----CARGAR PERFILES DE USUARIO----
                let perfilLogin: PerfilUsuario[] = [] //ARRAY DE LOS PERFILES DEL USUARIO
                respuesta.forEach((res: any) => perfilLogin.push(res?.perfiles));
                respuesta.perfiles = perfilLogin
            }
            return respuesta
        }
        return undefined
    }
    public async EditarUsuario(RequestUsuario: any, UsuarioModificador: string) {
        const { id_usuario } = RequestUsuario
        //BUSCAR LA INFORMACIÓN DEL USUARIO
        const respuesta = await _QueryBuscarUsuarioID(id_usuario)

        if (respuesta.length == 0) {
            return { error: true, message: "No se ha encontrado el usuario" }
        }

        const { usuario, nombre_completo, correo, clave } = respuesta[0]

        let usuarioEditado: string = RequestUsuario.usuario == usuario ? usuario : RequestUsuario.usuario
        let nombreEditado: string = RequestUsuario.nombre_completo == nombre_completo ? nombre_completo : RequestUsuario.nombre_completo
        let correoEditado: string = RequestUsuario.correo == correo ? correo : RequestUsuario.correo
        let claveEditada: string

        // VERIFICACION PARA EL USUARIO INGRESADO NO ESTE DUPLICADO
        if (usuarioEditado != usuario) {
            const usuarioDuplicado = await _QueryBuscarUsuarioCorreo(usuarioEditado, '')
            console.log(usuarioDuplicado)
            if (usuarioDuplicado.legnth == 0) {
                return { error: true, message: "Usuario ya registrado" }
            }
        }
        // VERIFICACION PARA EL CORREO INGRESADO NO ESTE DUPLICADO
        if (correoEditado != correo) {
            const correoDuplicado = await _QueryBuscarUsuarioCorreo('', correoEditado)
            if (correoDuplicado.legnth == 0) {
                return { error: true, message: "Correo ya registrado" }
            }
        }

        let matchPass = await bcrypt.compare(RequestUsuario.clave, clave)
        if (matchPass) {
            claveEditada = clave
        } else {
            const saltRounds = 10
            const hash = await bcrypt.hash(RequestUsuario.clave, saltRounds)
            claveEditada = hash
        }

        const result = await _QueryEditarUsuario({ id_usuario, usuarioEditado, nombreEditado, correoEditado, claveEditada }, UsuarioModificador)
        return result
    }
    public async EditarPerfilesUsuario(perfiles: any, usuario: number) {
        try {
            for (let perfil of perfiles) {
                const perfilExistente: any = await _QueryBuscarPerfilUsuario(perfil, usuario)
                if (perfilExistente.length == 0) {
                    // SI EL PERFIL NO EXISTE LO AGREGARA
                    const res = await _QueryInsertarPerfilUsuario(usuario, perfil) // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        return { error: true, message: 'No se pudo guardar el nuevo perfil' }
                    }
                } else {
                    const res = await _QueryEditarPerfilUsuario(perfil.id_perfil, perfil.id_estado, usuario)
                    if (!res) {
                        return { error: true, message: 'No se pudo editar el nuevo perfil' }
                    }
                }
            }
            return { error: false, message: '' }
        } catch (error) {
            return { error: true, message: 'Error al editar los perfiles del usuario' }
        }
    }
    public async EditarPermisosUsuario(permisos: any, usuario: number) {
        try {
            for (let permiso of permisos) {
                const permisoExistente: any = await _QueryBuscarRolUsuario(permiso, usuario)
                if (permisoExistente.length == 0) {
                    // SI EL ESTADO NO EXISTE LO AGREGARA
                    const res = await _QueryInsertarRolModulo(usuario, permiso) // GUARDAR PERMISOS DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        return { error: true, message: 'No se pudo guardar el nuevo permiso' }
                    }
                } else {
                    //SI EL permiso EXISTE EDITARA SU ESTADO
                    const res = await _QueryEditarRolUsuario(permiso.id_rol, permiso.id_estado, usuario)
                    if (!res) {
                        return { error: true, message: 'No se pudo editar el permiso' }
                    }
                }
            }
            return { error: false, message: '' }
        } catch (error) {
            return { error: true, message: 'Error al editar los permisos del usuario' }
        }
    }

    public async CambiarEstadoUsuario(usuario: number, estado: number) {
        const busqueda = await _QueryBuscarUsuarioID(usuario)
        if (busqueda.length <= 0) {
            return { error: true, message: 'No se ha encontrado el usuario' }
        }

        const res = await _QueryCambiarEstadoUsuario(usuario, estado)
        if (!res) {
            return { error: true, message: 'No se pudo cambiar el estado del usuario' }
        }
        return
    }
}
