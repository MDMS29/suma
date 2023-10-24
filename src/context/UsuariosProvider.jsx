import { useEffect, useState, createContext, useMemo } from "react";
import conexionCliente from "../config/ConexionCliente";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth'


const UsuariosContext = createContext();

// eslint-disable-next-line react/prop-types
const UsuariosProvider = ({ children }) => {

  const navigate = useNavigate()

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
    claverepetida: "",
  });

  const [errors, setErrors] = useState({
    nombre: '',
    usuario: '',
    correo: '',
    clave: '',
    claverepetida: '',
  });

  const [permisosUsuario, setPermisosUsuario] = useState([])

  const [resClave, setResClave] = useState(false)

  const { authUsuario, setAuthUsuario, setAlerta, setVerEliminarRestaurar } = useAuth()

  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('usuarios')) {
      const obtenerUsuarios = async () => {
        const token = localStorage.getItem('token')

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
        const estado = location.pathname.includes('inactivos') ? 2 : 1

        try {
          const { data } = await conexionCliente(`/usuarios?estado=${estado}`, config)
          setDataUsuarios(data)
        } catch (error) {
          setDataUsuarios([])
        }
      }
      obtenerUsuarios()
    }
  }, [location.pathname])

  const eliminarRestablecerUsuario = async (id) => {
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
      const { data } = await conexionCliente.delete(`/usuarios/${id}?estado=${estado}`, config)

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const usuariosActualizados = dataUsuarios.filter(usuario => usuario.id_usuario !== id)
      setDataUsuarios(usuariosActualizados)

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

  const restablecerUsuarioProvider = async (id) => {
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
    try {
      setAlerta({ error: true, show: true, message: 'Enviando correo...' })
      const { data } = await conexionCliente.patch(`usuarios/cambiar_clave/${id}`, {}, config)
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

  const restablecerContraseñaProvider = async () => {
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
      const { data } = await conexionCliente.patch(`usuarios/restablecer_clave/${authUsuario.id_usuario}`, body, config)
      if (data.error) {
        return console.log(data.message)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const obtenerPerfiles = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/perfiles?estado=1`, config);
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

  const obtenerModulos = async (perfiles) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente.post(
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

  const guardarUsuario = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Realiza la solicitud POST a la API para guardar la información del usuario
      const { data } = await conexionCliente.post("/usuarios", formData, config);
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
      return false;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)

    }
  };

  const buscarUsuario = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/usuarios/${id}`, config);
      if (data?.error) {
        return { error: true, message: data.message }
      }

      const { id_usuario, nombre_completo, usuario, correo, perfiles } = data.usuario
      let permisos = []
      console.log(data);
      setUsuariosAgg({
        id_usuario,
        nombre: nombre_completo,
        usuario: usuario,
        correo: correo,
        clave: "",
        claverepetida: "",
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

  const editarUsuario = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Realiza la solicitud PATCH API para editar la información del usuario
      const { data } = await conexionCliente.patch(`/usuarios/${formData.id_usuario}`, formData, config);

      if (data?.usuario) {
        // ACTUALIZAR STATE, MOSTRAR MENSAJE Y CERRAR MODAL
        const usuariosActualizados = dataUsuarios.map(usuario => usuario.id_usuario === data.usuario.id_usuario ? data.usuario : usuario)
        setDataUsuarios(usuariosActualizados)

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
    dataUsuarios, UsuariosAgg, setUsuariosAgg, obtenerPerfiles, perfilesAgg,
    obtenerModulos, modulosAgg, setModulosAgg, permisosAgg, guardarUsuario, errors,
    setErrors, setUsuarioState, usuarioState, eliminarRestablecerUsuario, restablecerUsuarioProvider,
    restablecerContraseñaProvider, contraseña, setConstraseña, buscarUsuario,
    perfilesEdit, permisosEdit, setPerfilesEdit, setPermisosEdit, editarUsuario,
    permisosUsuario, setPermisosUsuario, resClave, setResClave
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