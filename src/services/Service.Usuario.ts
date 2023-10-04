import {
    _QueryAutenticarUsuario, _QueryBuscarUsuario,
    _QueryMenuModulos, _QueryInsertarUsuario, _QueryPermisosModulo,
    _QueryInsertarRolModulo, _QueryInsertarPerfilUsuario, _QueryModulosUsuario, _QueryObtenerUsuarios
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
        const respuesta = await _QueryBuscarUsuario(0, usuario, correo)
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
                if (await _QueryInsertarRolModulo(respuesta, RequestUsuario.roles)) { // GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                    if (await _QueryInsertarPerfilUsuario(respuesta, RequestUsuario.perfiles)) { // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                        const data = await _QueryBuscarUsuario(respuesta, '', '') //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                        return data
                    }
                }
            }
            //ERRORES DE INSERCIÓN A LA BASE DE DATOS
            throw new Error('Error al guardar el usuario')
        } else {
            //ERROR AL HASHEAR LA CLAVE DEL USUARIO
            throw new Error('Error al hashear clave de usuario')
        }
    }

    public async BuscarUsuario(id = 0, p_user = '', correo = '') {
        if (p_user === 'param' && id !== 0) {
            const respuesta = await _QueryBuscarUsuario(id, p_user, correo)
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
                    }
                }

                //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado } = respuesta[0]
                respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
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
        }
        else if (id) {
            const respuesta = await _QueryBuscarUsuario(id, p_user, correo)
            return respuesta
        }
        return undefined
    }
}
