import QueryUsuario from "../../querys/Configuracion/QuerysUsuario";
import { PerfilUsuario, UsuarioLogin } from "../../validations/Types";
import { Generar_JWT } from "../../validations/utils";

let bcrypt = require('bcrypt')

export default class UsuarioService {
    private _Query_Usuario: QueryUsuario;
    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Usuario = new QueryUsuario();
    }

    public async Autenticar_Usuario(object: Omit<UsuarioLogin, 'captcha'>) {
        const { usuario, clave } = object
        //----OBTENER LA INFORMACIÓN DEL USUARIO LOGUEADO----
        // Promise<UsuarioLogeado | undefined>
        const respuesta = await this._Query_Usuario.Autenticar_Usuario({ usuario, clave })
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
            const modulos = await this._Query_Usuario.Modulos_Usuario(respuesta[0]?.id_usuario)
            if (modulos) {
                respuesta.modulos = modulos
                for (const modulo of modulos) {
                    //CARGA DE MENUS DE LOS MODULOS
                    const response = await this._Query_Usuario.Menu_Modulos(respuesta[0]?.id_usuario, modulo.id_modulo)
                    modulo.menus = response
                    //CARGAR PERMISOS DEL MODULO
                    const permisos = await this._Query_Usuario.Permisos_Modulo(modulo.id_modulo, respuesta[0]?.id_usuario)
                    modulo.permisos = permisos
                }
            }

            //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
            const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave, id_empresa, nombre_empresa } = respuesta[0]
            respuesta.token = Generar_JWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
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
                    id_empresa,
                    nombre_empresa,
                    token: respuesta.token,
                    perfiles: perfilLogin
                },
                modulos: respuesta.modulos
            }
        }
        return undefined
    }

    public async Obtener_Usuarios(estado: string, empresa: number) {
        //VERIFICACIÓN DEL TIPO DE LA VARIABLE
        if (typeof estado === 'number') {
            throw new Error('Error al obtener el estado del usuario') //!ERROR
        }

        try {
            const respuesta = await this._Query_Usuario.Obtener_Usuarios(estado, empresa) //INVOCAR FUNCION PARA OBTENER LOS USUARIOS
            if (respuesta) { //VALIDACION SI HAY ALGUNA RESPUESTA
                return respuesta //RETORNAR LA RESPUESTA
            }
            return
        } catch (error) {
            console.log(error) //!ERROR
            return
        }

    }

    public async Insertar_Usuario(RequestUsuario: any, UsuarioCreador: string): Promise<any> {
        const { usuario, correo, clave } = RequestUsuario

        //BUSCAR EL USUARIO POR SU USUARIO Y CORREO
        const respuesta = await this._Query_Usuario.Buscar_Usuario_Correo(usuario, correo)
        if (respuesta.length > 0) {
            //SI EL USUARIO YA ESTA REGISTRADO MOSTRAR ERROR
            return { error: true, message: 'El usuario o correo ya existe' }
        }
        if (clave) {
            //HASHEAR CLAVE DEL USUARIO
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            RequestUsuario.clave = hash
            //FUNCIOÓN PARA REGISTRAR LA INFORMACIÓN PRINCIPAL DEL USUARIO 
            const respuesta = await this._Query_Usuario.Insertar_Usuario(RequestUsuario, UsuarioCreador)
            if (respuesta) {
                for (let perfil of RequestUsuario.perfiles) {
                    const res = await this._Query_Usuario.Insertar_Perfil_Usuario(respuesta, perfil) // GUARDAR PERFILES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        throw new Error('Error al insertar el perfil') //!ERROR
                    }
                }
                for (let rol of RequestUsuario.roles) {
                    const res = await this._Query_Usuario.Insertar_Rol_Modulo(respuesta, rol)// GUARDAR ROLES DE USUARIO POR EL ID RETORNADO
                    if (!res) {
                        throw new Error('Error al insertar el rol') //!ERROR
                    }
                }

                const empresa_usuario = await this._Query_Usuario.Insertar_Empresa_Usuario(respuesta, RequestUsuario.id_empresa, UsuarioCreador)

                if (empresa_usuario?.rowCount !== 1) {
                    return { error: true, message: "Error al guardar la empresa del usuario" } //!ERROR
                }

                const data = await this._Query_Usuario.Buscar_Usuario_ID(respuesta) //BUSCAR EL USUARIO GUARDADO Y RETORNARLO 
                return data[0]
            }
            //!ERRORES DE INSERCIÓN A LA BASE DE DATOS
            throw new Error('Error al guardar el usuario') //!ERROR
        } else {
            //!ERROR AL HASHEAR LA CLAVE DEL USUARIO
            throw new Error('Error al hashear clave de usuario') //!ERROR
        }
    }

    public async Buscar_Usuario(id = 0, p_user = '') {
        if (p_user === 'param' && id !== 0) { //CONDICION SI EL USUARIO VIENE POR PARAMETROS
            const respuesta = await this._Query_Usuario.Buscar_Usuario_ID(id) //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
            if (respuesta.length <= 0) {
                return { error: true, message: "No se ha encontado el usuario" } //!ERROR
            }
            if (respuesta) {
                for (const res of respuesta) {
                    res.perfiles = {
                        id_perfil: res.id_perfil,
                        nombre_perfil: res.nombre_perfil,
                        estado_perfil: +res.id_estado_perfil
                    }
                }

                //----CARGAR PERFILES DE USUARIO----
                let perfilLogin: PerfilUsuario[] = [] //ARRAY DE LOS PERFILES DEL USUARIO
                respuesta.forEach((res: any) => perfilLogin.push(res?.perfiles));
                //----CARGAR MODULOS DEL USUARIO----
                const modulos = await this._Query_Usuario.Modulos_Usuario(respuesta[0]?.id_usuario)
                if (modulos) {
                    respuesta.modulos = modulos
                    for (const modulo of modulos) {
                        //CARGA DE MENUS DE LOS MODULOS
                        const response = await this._Query_Usuario.Menu_Modulos(respuesta[0]?.id_usuario, modulo.id_modulo)
                        modulo.menus = response
                        //CARGAR PERMISOS DEL MODULO
                        const permisos = await this._Query_Usuario.Permisos_Modulo(modulo.id_modulo, respuesta[0]?.id_usuario)
                        modulo.permisos = permisos
                    }
                }

                //TOMAR INFORMACIÓN DEL USUARIO PARA RETONARLA DE FORMA PERSONALIZADA
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave, estado_usuario, id_empresa, nombre_empresa } = respuesta[0]
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
                        estado_usuario,
                        id_empresa,
                        nombre_empresa,
                        perfiles: perfilLogin
                    },
                    modulos: respuesta.modulos
                }
            }
        }
        if (id !== 0 && p_user == '') { //CONDICION SI EL USUARIO NO VIENE POR PARAMETROS
            const respuesta = await this._Query_Usuario.Buscar_Usuario_ID(id) //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
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
                const { id_usuario, nombre_completo, usuario, fecha_creacion, correo, id_estado, cm_clave, id_empresa, nombre_empresa } = respuesta[0]
                // respuesta.token = generarJWT(respuesta[0].id_usuario) //GENERAR TOKEN DE AUTENTICACIÓN
                return {
                    id_usuario,
                    nombre_completo,
                    usuario,
                    fecha_creacion,
                    correo,
                    id_estado,
                    cm_clave,
                    id_empresa,
                    nombre_empresa,
                    perfiles: perfilLogin
                }
            }
        }
        return undefined
    }

    public async Editar_Usuario(RequestUsuario: any, UsuarioModificador: string) {
        const { id_usuario } = RequestUsuario
        //BUSCAR LA INFORMACIÓN DEL USUARIO        
        const respuesta = await this._Query_Usuario.Buscar_Usuario_ID(id_usuario) //INVOCAR FUNCION PARA BUSCAR EL USUARIO POR ID
        if (respuesta.length == 0) { //SI LA RESPUESTA ES VACIA ENVIAR ERROR
            return { error: true, message: "No se ha encontrado el usuario" } //!ERROR
        }

        const usuario_filtrado_correo: any = await this._Query_Usuario.Buscar_Usuario_Correo('', RequestUsuario.correo)
        if (usuario_filtrado_correo?.length > 0 && usuario_filtrado_correo[0].correo !== respuesta[0].correo) {
            return { error: true, message: 'Ya existe este correo de usuario' } //!ERROR
        }
        
        const usuario_filtrado: any = await this._Query_Usuario.Buscar_Usuario_Correo(RequestUsuario.usuario, '')
        if (usuario_filtrado?.length > 0 && usuario_filtrado[0].usuario !== respuesta[0].usuario) {
            return { error: true, message: 'Ya existe este usuario' } //!ERROR
        }


        const { usuario, nombre_completo, correo, clave } = respuesta[0] //DESTRUCTURING PARA OBTENER LA INFORMACION PERSONALIZADA

        let Usuario_Editado: string = RequestUsuario.usuario == usuario ? usuario : RequestUsuario.usuario //NUEVO USUARIO
        let Nombre_Editado: string = RequestUsuario.nombre_completo == nombre_completo ? nombre_completo : RequestUsuario.nombre_completo //NUEVO NOMBRE COMPLETO
        let Correo_Editado: string = RequestUsuario.correo == correo ? correo : RequestUsuario.correo //NUEVO CORREO
        let Clave_Editada: string //VARIABLE PARA LA CLAVE


        try {
            if (RequestUsuario.clave === '') {
                Clave_Editada = clave
            } else {
                let matchPass = await bcrypt.compare(RequestUsuario.clave, clave) //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS
                if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                    Clave_Editada = clave
                } else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                    const saltRounds = 10
                    const hash = await bcrypt.hash(RequestUsuario.clave, saltRounds)
                    Clave_Editada = hash
                }
            }

            //INVOCAR FUNCION PARA EDITAR EL USUARIO
            const result = await this._Query_Usuario.Editar_Usuario({ id_usuario, Usuario_Editado, Nombre_Editado, Correo_Editado, Clave_Editada }, UsuarioModificador)
            await this._Query_Usuario.Editar_Empresa_Usuario(RequestUsuario.id_empresa, id_usuario, UsuarioModificador)
            return result //RETORNAR EL USUARIO EDITADO
        } catch (error) {
            console.log(error)
            return { error: true, message: "Error al editar el usuario" } //!ERROR
        }
    }

    public async Editar_Perfiles_Usuario(perfiles: any, usuario: number) {
        try {
            for (let perfil of perfiles) {
                const perfilExistente: any = await this._Query_Usuario.Buscar_Perfil_Usuario(perfil.id_perfil, usuario) //INVOCAR FUNCION PARA BUSCAR EL PERFIL DEL USUARIO
                if (perfilExistente.length == 0) {
                    // SI EL PERFIL NO EXISTE LO AGREGARA
                    const res = await this._Query_Usuario.Insertar_Perfil_Usuario(usuario, perfil) //INVOCAR FUNCION PARA GUARDAR EL PERFIL DEL USUARIO
                    if (!res) {
                        return { error: true, message: 'No se pudo guardar el nuevo perfil' } //!ERROR
                    }
                } else {
                    const res = await this._Query_Usuario.Editar_Perfil_Usuario(perfil.id_perfil, perfil.estado_perfil, usuario) //INVOCAR FUNCION PARA EDITAR EL PERFIL DEL USUARIO
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

    public async Editar_Permisos_Usuario(permisos: any, usuario: number) {
        try {
            for (let permiso of permisos) {
                const permisoExistente: any = await this._Query_Usuario.Buscar_Rol_Usuario(permiso.id_rol, usuario) //INVOCAR FUNCION PARA BUSCAR EL ROL DEL USUARIO
                if (permisoExistente.length == 0) { //VERIFICAR SI EL USUARIO TIENE UN ROL
                    // SI EL ESTADO NO EXISTE LO AGREGARA
                    const res = await this._Query_Usuario.Insertar_Rol_Modulo(usuario, permiso) //INVOCAR FUNCION PARA GUARDAR EL ROL DEL USUARIO
                    if (!res) {
                        return { error: true, message: 'No se pudo guardar el nuevo permiso' } //!ERROR
                    }
                } else {//SI EL PERMISO EXISTE EDITARA SU ESTADO
                    const res = await this._Query_Usuario.Editar_Rol_Usuario(permiso.id_rol, `${permiso.id_estado}`, usuario) //INVOCAR FUNCION PARA EDITAR EL ROL DEL USUARIO

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

    public async Cambiar_Estado_Usuario({ usuario, estado }: { usuario: number; estado: string; }) {
        const busqueda = await this._Query_Usuario.Buscar_Usuario_ID(usuario)
        if (busqueda.length <= 0) {
            return { error: true, message: 'No se ha encontrado el usuario' }
        }
        try {
            const res = await this._Query_Usuario.Cambiar_Estado_Usuario(usuario, estado)
            if (!res) {
                return { error: true, message: 'No se pudo cambiar el estado del usuario' }
            }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cambiar el estado del usuario' }
        }
        return
    }

    public async Cambiar_Clave_Usuario(id_usuario: number, clave: string, cm_clave: boolean) {
        let _Nueva_Clave: string
        try {
            const usuario: any = await this._Query_Usuario.Buscar_Usuario_ID(id_usuario)

            //SI SE VA A ENVIAR LA CLAVE DEL USUARIO POR CORREO
            if (cm_clave) {

                let matchPass = await bcrypt.compare(clave, usuario[0]?.clave) //COMPARA LA CLAVE ENVIADA DEL USUARIO CON LA DE LA BASE DE DATOS

                if (matchPass) { //SI SON IGUALES DEJA LA NORMAL
                    return { error: true, message: 'Las clave no puede ser igual a la ya existente' } //!ERROR
                } else { //SI SON DIFERENTES HASHEA LA NUEVA CLAVE
                    const saltRounds = 10
                    const hash = await bcrypt.hash(clave, saltRounds)

                    _Nueva_Clave = hash
                }

                const res = await this._Query_Usuario.Cambiar_Clave_Usuario(id_usuario, _Nueva_Clave, cm_clave)
                if (!res?.rowCount) {
                    return { error: true, message: 'Error al cambiar la clave del usuario' } //!ERROR
                }

                //RETORNAR LA INFORMACION PARA EL ENVIO DEL CORREO
                return {
                    error: false,
                    data_usuario: {
                        id_usuario,
                        clave,
                        nombre: usuario[0]?.nombre_completo,
                        usuario: usuario[0]?.usuario,
                        correo: usuario[0]?.correo
                    },
                    message: 'Clave cambiada con exito'
                }
            }

            //SI SE RESTABLECE LA CLAVE DEL USUARIO
            const saltRounds = 10
            const hash = await bcrypt.hash(clave, saltRounds)
            if (!hash) {
                console.error(hash) //!ERROR
            }

            const res = await this._Query_Usuario.Cambiar_Clave_Usuario(id_usuario, hash, cm_clave)
            if (!res?.rowCount) {
                return { error: true, message: 'Error al restablecer la clave del usuario' } //!ERROR
            }

            return { error: false, message: 'Se ha restablecido la clave del usuario' } //*SUCCESS

        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al restablecer la clave del usuario' } //!ERROR
        }
    }
}
