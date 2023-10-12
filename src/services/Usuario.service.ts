import QueryUsuario from "../querys/QuerysUsuario";
import { PerfilUsuario, UsuarioLogin } from "../validations/Types";
import { generarJWT } from "../validations/utils";

let bcrypt = require('bcrypt')

export default class UsuarioService {
    private _Query_Usuario: QueryUsuario;
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Usuario = new QueryUsuario();
    }

    public async AutenticarUsuario(object: Omit<UsuarioLogin, 'captcha'>) {
        const { usuario, clave } = object
        //----OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO----
        // Promise<UsuarioLogeado | undefined>
        const respuesta = await this._Query_Usuario.AutenticarUsuario({ usuario, clave })
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
            const modulos = await this._Query_Usuario.ModulosUsuario(respuesta[0]?.id_usuario)
            if (modulos) {
                respuesta.modulos = modulos
                for (const modulo of modulos) {
                    //CARGA DE MENUS DE LOS MODULOS
                    const response = await this._Query_Usuario.MenuModulos(respuesta[0]?.id_usuario, modulo.id_modulo)
                    modulo.menus = response
                    //CARGAR PERMISOS DEL MODULO
                    const permisos = await this._Query_Usuario.PermisosModulo(modulo.id_modulo, respuesta[0]?.id_usuario)
                    modulo.permisos = permisos
                }
            }

            //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
            const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave } = respuesta[0]
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
                    cm_clave,
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
            throw new Error('Error al obtener el estado del usuario') //!ERROR
        }

        try {
            const respuesta = await this._Query_Usuario.ObtenerUsuarios(estado) //INVOCAR FUNCION PARA OBTENER LOS USUARIOS
            if (respuesta) { //VALIDACION SI HAY ALGUNA RESPUESTA
                return respuesta //RETORNAR LA RESPUESTA
            }
            return
        } catch (error) {
            console.log(error) //!ERROR
            return
        }

    }

    public async InsertarUsuario(RequestUsuario: any, UsuarioCreador: string): Promise<any> {
        const { usuario, correo, clave } = RequestUsuario

        //BUSCAR EL USUARIO POR SU USUARIO Y CORREO
        const respuesta = await this._Query_Usuario.BuscarUsuarioCorreo(usuario, correo)
        if (respuesta.length > 0) {
            //SI EL USUARIO YA ESTA REGISTRADO MOSTRAR ERROR
            return { error: true, message: 'Este usuario ya existe' }
        }
        if (clave) {
            //HASHEAR CLAVE DEL USUARIO
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            RequestUsuario.clave = hash
            //FUNCIOÓN PARA REGISTRAR LA INFORMACIÓN PRINCIPAL DEL USUARIO 
            const respuesta = await this._Query_Usuario.InsertarUsuario(RequestUsuario, UsuarioCreador)
            if (respuesta) {
                for (let perfil of RequestUsuario.perfiles) {
                    const res = await this._Query_Usuario.InsertarPerfilUsuario(respuesta, perfil) // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        throw new Error('Error al insertar el perfil') //!ERROR
                    }
                }
                for (let rol of RequestUsuario.roles) {
                    const res = await this._Query_Usuario.InsertarRolModulo(respuesta, rol)// GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        throw new Error('Error al insertar el rol') //!ERROR
                    }
                }
                const data = await this._Query_Usuario.BuscarUsuarioID(respuesta) //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                return data[0]
            }
            //!ERRORES DE INSERCIÓN A LA BASE DE DATOS
            throw new Error('Error al guardar el usuario') //!ERROR
        } else {
            //!ERROR AL HASHEAR LA CLAVE DEL USUARIO
            throw new Error('Error al hashear clave de usuario') //!ERROR
        }
    }

    public async BuscarUsuario(id = 0, p_user = '') {
        if (p_user === 'param' && id !== 0) { //CONDICION SI EL USUARIO VIENE POR PARAMETROS
            const respuesta = await this._Query_Usuario.BuscarUsuarioID(id) //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
            if (respuesta.length <= 0) {
                return { error: true, message: "No se ha encontado el usuario" } //!ERROR
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
                const modulos = await this._Query_Usuario.ModulosUsuario(respuesta[0]?.id_usuario)
                if (modulos) {
                    respuesta.modulos = modulos
                    for (const modulo of modulos) {
                        //CARGA DE MENUS DE LOS MODULOS
                        const response = await this._Query_Usuario.MenuModulos(respuesta[0]?.id_usuario, modulo.id_modulo)
                        modulo.menus = response
                        //CARGAR PERMISOS DEL MODULO
                        const permisos = await this._Query_Usuario.PermisosModulo(modulo.id_modulo, respuesta[0]?.id_usuario)
                        modulo.permisos = permisos
                    }
                }

                //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave } = respuesta[0]
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
                        cm_clave,
                        perfiles: perfilLogin
                    },
                    modulos: respuesta.modulos
                }
            }
        }
        if (id !== 0 && p_user == '') { //CONDICION SI EL USUARIO NO VIENE POR PARAMETROS
            const respuesta = await this._Query_Usuario.BuscarUsuarioID(id) //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
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
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave } = respuesta[0]
                // respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
                return {
                    id_usuario,
                    nombre_completo,
                    usuario,
                    fecha_creacion,
                    correo,
                    id_estado,
                    cm_clave,
                    perfiles: perfilLogin
                }
            }
        }
        return undefined
    }

    public async EditarUsuario(RequestUsuario: any, UsuarioModificador: string) {
        const { id_usuario } = RequestUsuario
        //BUSCAR LA INFORMACIÓN DEL USUARIO        
        const respuesta = await this._Query_Usuario.BuscarUsuarioID(id_usuario) //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
        if (respuesta.length == 0) { //SI LA RESPUESTA ES VACIA ENVIAR ERROR
            return { error: true, message: "No se ha encontrado el usuario" } //!ERROR
        }

        const { usuario, nombre_completo, correo, clave } = respuesta[0] //DESTRUCTURING PARA OBTENER LA INFORMACION PERSONALIZADA

        let Usuario_Editado: string = RequestUsuario.usuario == usuario ? usuario : RequestUsuario.usuario //NUEVO USUARIO
        let Nombre_Editado: string = RequestUsuario.nombre_completo == nombre_completo ? nombre_completo : RequestUsuario.nombre_completo //NUEVO NOMBRE COMPLETO
        let Correo_Editado: string = RequestUsuario.correo == correo ? correo : RequestUsuario.correo //NUEVO CORREO
        let Clave_Editada: string //VARIABLE PARA LA CLAVE


        try {

            // VERIFICACION PARA EL USUARIO INGRESADO NO ESTE DUPLICADO
            if (Usuario_Editado != usuario) {
                const usuarioDuplicado = await this._Query_Usuario.BuscarUsuarioCorreo(Usuario_Editado, '') //INVOCAR FUNCION PARA BUSCAR EL USUARIO 
                if (usuarioDuplicado.legnth == 0) { //VERIFICAR SI HAY INFORMACION IGUAL 
                    return { error: true, message: "Usuario ya registrado" } //!ERROR
                }
            }
            // VERIFICACION PARA EL CORREO INGRESADO NO ESTE DUPLICADO
            if (Correo_Editado != correo) {
                const correoDuplicado = await this._Query_Usuario.BuscarUsuarioCorreo('', Correo_Editado)  //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR EL CORREO
                if (correoDuplicado.legnth == 0) { //VERIFICAR SI HAY INFORMACION IGUAL
                    return { error: true, message: "Correo ya registrado" } //!ERROR
                }
            }

            let matchPass = await bcrypt.compare(RequestUsuario.clave, clave) //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS
            if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                Clave_Editada = clave
            } else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                const saltRounds = 10
                const hash = await bcrypt.hash(RequestUsuario.clave, saltRounds)
                Clave_Editada = hash
            }

            //INVOCAR FUNCION PARA EDITAR EL USUARIO
            const result = await this._Query_Usuario.EditarUsuario({ id_usuario, Usuario_Editado, Nombre_Editado, Correo_Editado, Clave_Editada }, UsuarioModificador)
            return result //RETORNAR EL USUARIO EDITADO
        } catch (error) {
            console.log(error)
            return { error: true, message: "Error al editar el usuario" } //!ERROR
        }
    }

    public async EditarPerfilesUsuario(perfiles: any, usuario: number) {
        try {
            for (let perfil of perfiles) {
                const perfilExistente: any = await this._Query_Usuario.BuscarPerfilUsuario(perfil, usuario) //INVOCAR FUNCION PARA BUSCAR EL PERFIL DEL USUARIO
                if (perfilExistente.length == 0) {
                    // SI EL PERFIL NO EXISTE LO AGREGARA
                    const res = await this._Query_Usuario.InsertarPerfilUsuario(usuario, perfil) //INVOCAR FUNCION PARA GUARDAR EL PERFIL DEL USUARIO
                    if (!res) {
                        return { error: true, message: 'No se pudo guardar el nuevo perfil' } //!ERROR
                    }
                } else {
                    const res = await this._Query_Usuario.EditarPerfilUsuario(perfil.id_perfil, perfil.id_estado, usuario) //INVOCAR FUNCION PARA EDITAR EL PERFIL DEL USUARIO
                    if (!res) {
                        return { error: true, message: 'No se pudo editar el nuevo perfil' } //!ERROR
                    }
                }
            }
            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar los perfiles del usuario' } //!ERROR
        }
    }

    public async EditarPermisosUsuario(permisos: any, usuario: number) {
        try {
            for (let permiso of permisos) {
                const permisoExistente: any = await this._Query_Usuario.BuscarRolUsuario(permiso, usuario) //INVOCAR FUNCION PARA BUSCAR EL ROL DEL USUARIO
                if (permisoExistente.length == 0) { //VERIFICAR SI EL USUARIO TIENE UN ROL
                    // SI EL ESTADO NO EXISTE LO AGREGARA
                    const res = await this._Query_Usuario.InsertarRolModulo(usuario, permiso) //INVOCAR FUNCION PARA GUARDAR EL ROL DEL USUARIO
                    if (!res) {
                        return { error: true, message: 'No se pudo guardar el nuevo permiso' } //!ERROR
                    }
                } else {//SI EL PERMISO EXISTE EDITARA SU ESTADO 
                    const res = await this._Query_Usuario.EditarRolUsuario(permiso.id_rol, permiso.id_estado, usuario) //INVOCAR FUNCION PARA EDITAR EL ROL DEL USUARIO
                    if (!res) {
                        return { error: true, message: 'No se pudo editar el permiso' } //!ERROR
                    }
                }
            }
            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar los permisos del usuario' } //!ERROR
        }
    }

    public async CambiarEstadoUsuario({ usuario, estado }: { usuario: number; estado: string; }) {
        const busqueda = await this._Query_Usuario.BuscarUsuarioID(usuario)
        if (busqueda.length <= 0) {
            return { error: true, message: 'No se ha encontrado el usuario' }
        }
        try {
            const res = await this._Query_Usuario.CambiarEstadoUsuario(usuario, estado)
            if (!res) {
                return { error: true, message: 'No se pudo cambiar el estado del usuario' }
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado del usuario' }
        }
        return
    }

    public async CambiarClaveUsuario(id_usuario: number, clave: string) {
        let _Nueva_Clave: string
        try {
            const usuario: any = await this.BuscarUsuario(id_usuario, '')
            let matchPass = await bcrypt.compare(clave, usuario?.clave) //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS

            if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                return { error: true, message: 'Las clave no puede ser igual a la ya existente' }
            } else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                const saltRounds = 10
                const hash = await bcrypt.hash(clave, saltRounds)
                _Nueva_Clave = hash
            }

            const res = await this._Query_Usuario.CambiarClaveUsuario(id_usuario, _Nueva_Clave)
            if (!res?.rowCount) {
                return { error: true, message: 'Error al cambiar la clave del usuario' }
            }

            //RETORNAR LA INFORMACION PARA EL ENVIO DEL CORREO
            return {
                error: false,
                data_usuario: {
                    id_usuario,
                    clave,
                    nombre: usuario?.nombre_completo,
                    usuario: usuario?.usuario,
                    correo: usuario?.correo
                },
                message: 'Clave cambiada con exito'
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar la clave del usuario' }
        }
    }
}
