import QueryRol from "../../querys/Configuracion/QueryRol";

export class RolService {
    private _Query_Rol: QueryRol;

    constructor() {
        // INICIARLIZAR EL QUERY A USAR
        this._Query_Rol = new QueryRol();
    }

    public async Obtener_Roles(estado: number): Promise<any> {
        if (!estado) {
            return { error: true, message: 'Estado no definido' } //!ERROR
        }
        try {
            const respuesta = await this._Query_Rol.ObtenerRoles(estado)

            if (respuesta?.length <= 0) {
                return { error: true, message: 'No se han encontrado roles' } //!ERROR
            }

            return respuesta
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al cargar los roles' } //!ERROR
        }
    }

    public async Insertar_Rol(nombre: string, descripcion: string, usuario_creacion: string) {
        try {
            //VALIDAR SI EL ROL EXISTE
            const Brol: any = await this._Query_Rol.Buscar_Rol_Nombre(nombre)
            if (Brol?.length > 0) {
                return { error: true, message: 'Ya existe este rol' } //!ERROR
            }

            //INVOCAR FUNCION PARA INSERTAR ROL
            const respuesta = await this._Query_Rol.Insertar_Rol(nombre, descripcion, usuario_creacion)
            if (!respuesta) {
                return { error: true, message: 'No se ha podido crear el rol' } //!ERROR
            }

            //INVOCAR FUNCION PARA BUSCAR EL ROL POR ID
            const rol = await this._Query_Rol.Buscar_Rol_ID(respuesta[0].id_rol)
            if (!rol) {
                return { error: true, message: 'No se ha encontrado el rol' } //!ERROR
            }

            return rol[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al crear el rol' } //!ERROR
        }
    }

    public async Buscar_Rol(id_rol: number): Promise<any> {
        try {
            const rol = await this._Query_Rol.Buscar_Rol_ID(id_rol)
            if (!rol) {
                return { error: true, message: 'No se ha encontrado este rol' } //!ERROR
            }
            return rol[0]
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al encontrar el rol' }
        }
    }

    public async Editar_Rol(id_rol: number, nombre: string, descripcion: string, usuario_modificacion: string) {
        let nombre_editado: string
        let descripcion_editado: string
        try {
            const Brol: any = await this._Query_Rol.Buscar_Rol_Nombre(nombre)
            if (Brol?.length > 0 && Brol[0].nombre !== nombre) {
                return { error: true, message: 'Ya existe este rol' } //!ERROR
            }
            
            // COMPROBAR SI ESTE ROL EXISTE
            const respuesta: any = await this._Query_Rol.Buscar_Rol_ID(id_rol)
            if(respuesta.length === 0){
                return { error: true, message: 'No existe este rol' } //!ERROR
            }

            // ACTUALIZAR
            if (respuesta[0]?.nombre === nombre) {
                nombre_editado = respuesta[0]?.nombre
            } else {
                nombre_editado = nombre
            }

            if (respuesta[0]?.descripcion === descripcion) {
                descripcion_editado = respuesta[0]?.descripcion
            } else {
                descripcion_editado = descripcion
            }

            const res = await this._Query_Rol.Editar_Rol(id_rol, nombre_editado, descripcion_editado, usuario_modificacion)
            if (res?.rowCount != 1) {
                return { error: true, message: 'Error al actualizar el rol' } //!ERROR
            }

            return { error: false, message: '' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar rol' } //!ERROR
        }
    }

    public async Cambiar_Estado_Rol(id_rol: number, estado: number) {
        try {

            const rol_editado = await this._Query_Rol.Cambiar_Estado_Rol(id_rol, estado);
            if (!rol_editado?.rowCount) {
                return { error: true, message: 'Error al editar el rol' } //!ERROR
            }

            return { error: false, message: 'Se ha cambiado el estado del rol' }
        } catch (error) {
            console.log(error)
            return { error: true, message: 'Error al editar el rol' } //!ERROR
        }
    }
}