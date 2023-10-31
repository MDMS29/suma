import { useEffect, useState, createContext, useMemo } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth'


const UsuariosContext = createContext();

// eslint-disable-next-line react/prop-types
const UsuariosProvider = ({ children }) => {

  const navigate = useNavigate()
  const { authUsuario, setAuthUsuario, setAlerta, setVerEliminarRestaurar } = useAuth()

  const [dataUsuarios, setDataUsuarios] = useState([])
  const [usuarioState, setUsuarioState] = useState({})
  const [contraseña, setConstraseña] = useState("")

  const [perfilesAgg, setPerfilesAgg] = useState([]);
  const [modulosAgg, setModulosAgg] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [permisosAgg, setPermisosAgg] = useState([]);

  const [perfilesEdit, setPerfilesEdit] = useState([])
  const [permisosEdit, setPermisosEdit] = useState([])


  const [UsuariosAgg, setUsuariosAgg] = useState({
    id_usuario: 0,
    nombre: "",
    usuario: "",
    correo: "",
    clave: "",
    clave_repetida: "",
    id_empresa: authUsuario.perfiles?.some((perfil) => perfil.id_perfil == 1) && authUsuario.id_empresa == 1 ? "" : authUsuario.id_empresa && authUsuario.id_empresa
  });

  const [errors, setErrors] = useState({
    nombre: '',
    usuario: '',
    correo: '',
    clave: '',
    clave_repetida: '',
  });

  const [permisosUsuario, setPermisosUsuario] = useState([])

  const [resClave, setResClave] = useState(false)

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('usuarios')) {
      const obtener_usuarios = async () => {
        const token = localStorage.getItem('token')

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        const estado = location.pathname.includes('inactivos') ? 2 : 1
        if (authUsuario.id_empresa) {
          try {
            const { data } = await conexion_cliente(`/usuarios?estado=${estado}&empresa=${authUsuario.id_empresa}`, config)
            setDataUsuarios(data)
          } catch (error) {
            setDataUsuarios([])
          }
        }
      }
      obtener_usuarios()
    }
  }, [location.pathname])

  const eliminar_restablecer_usuario = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setAuthUsuario({})
      navigate('/auth')
      return
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const estado = location.pathname.includes("inactivos") ? 1 : 2;
      const { data } = await conexion_cliente.delete(`/usuarios/${id}?estado=${estado}`, config)

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const usuarios_actualizados = dataUsuarios.filter(usuario => usuario.id_usuario !== id)
      setDataUsuarios(usuarios_actualizados)

      setAlerta({ error: false, show: true, message: data.message })
      setTimeout(() => setAlerta({}), 1500)
      setVerEliminarRestaurar(false)
      return true

    } catch (error) {
      setAlerta({ error: false, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const restablecer_usuario_provider = async (id) => {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
    try {
      setAlerta({ error: true, show: true, message: 'Enviando correo...' })
      const { data } = await conexion_cliente.patch(`usuarios/cambiar_clave/${id}`, {}, config)
      setAlerta({ error: false, show: false, message: '' })
      setResClave(false)

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      setAlerta({ error: false, show: true, message: data.message })
      setTimeout(() => setAlerta({}), 1500)
      setVerEliminarRestaurar(false)
      return true

    } catch (error) {
      setAlerta({ error: false, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const restablecer_contraseña_provider = async () => {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
    const body = {
      "clave": `${contraseña}`
    }
    try {
      const { data } = await conexion_cliente.patch(`usuarios/restablecer_clave/${authUsuario.id_usuario}`, body, config)
      if (data.error) {
        return console.log(data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const obtener_perfiles = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(`/perfiles?estado=1`, config);
      setPerfilesAgg(data);
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
    }
  };

  const obtener_modulos = async (perfiles) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.post(
        `/perfiles/modulos`,
        perfiles,
        config
      );
      setModulosAgg(data);
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
    }
  };

  const guardar_usuario = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Realiza la solicitud POST a la API para guardar la información del usuario
      const { data } = await conexion_cliente.post("/usuarios", formData, config);
      if (!data?.error) {
        setDataUsuarios([...dataUsuarios, data])

        setAlerta({
          error: false,
          show: true,
          message: 'Usuario creado con exito'
        })

        setTimeout(() => setAlerta({}), 1500)

        return true
      }
      setAlerta({
        error: true,
        show: true,
        message: data.message
      })

      setTimeout(() => setAlerta({}), 1500)
      return false;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response?.data.message
      })

      setTimeout(() => setAlerta({}), 1500)

    }
  };

  const buscar_usuario = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(`/usuarios/${id}`, config);
      if (data?.error) {
        return { error: true, message: data.message }
      }

      const { id_usuario, nombre_completo, usuario, correo, perfiles } = data.usuario
      let permisos = []
      setUsuariosAgg({
        id_usuario,
        nombre: nombre_completo,
        usuario: usuario,
        correo: correo,
        clave: "",
        clave_repetida: "",
        id_empresa: authUsuario.id_empresa
      })
      await data?.modulos.map((modulo) => {
        modulo?.permisos.map((permiso) => {
          permisos.push({ id_rol: +permiso?.id_rol_modulo, id_estado: +permiso?.id_estado })
        })
      })

      setPerfilesEdit(perfiles)
      setPermisosEdit(permisos)

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const editar_usuario = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Realiza la solicitud PATCH API para editar la información del usuario
      const { data } = await conexion_cliente.patch(`/usuarios/${formData.id_usuario}`, formData, config);

      if (data?.usuario) {
        // ACTUALIZAR STATE, MOSTRAR MENSAJE Y CERRAR MODAL
        const usuarios_actualizados = dataUsuarios.map(usuario => usuario.id_usuario === data.usuario.id_usuario ? data.usuario : usuario)
        setDataUsuarios(usuarios_actualizados)

        setAlerta({
          error: false,
          show: true,
          message: 'Usuario editado con exito'
        })

        setTimeout(() => setAlerta({}), 1500)
        return true
      }

      setAlerta({
        error: true,
        show: true,
        message: data.message
      })
      setTimeout(() => setAlerta({}), 1500)
      return false

    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const obj = useMemo(() => ({
    dataUsuarios,
    UsuariosAgg,
    setUsuariosAgg,
    obtener_perfiles,
    perfilesAgg,
    obtener_modulos,
    modulosAgg,
    setModulosAgg,
    permisosAgg,
    guardar_usuario,
    errors,
    setErrors,
    setUsuarioState,
    usuarioState,
    eliminar_restablecer_usuario,
    restablecer_usuario_provider,
    restablecer_contraseña_provider,
    contraseña,
    setConstraseña,
    buscar_usuario,
    perfilesEdit,
    permisosEdit,
    setPerfilesEdit,
    setPermisosEdit,
    editar_usuario,
    permisosUsuario,
    setPermisosUsuario,
    resClave,
    setResClave
  }))

  return (
    <UsuariosContext.Provider
      value={obj}
    >
      {children}
    </UsuariosContext.Provider>
  );
};

export { UsuariosProvider };

export default UsuariosContext;
