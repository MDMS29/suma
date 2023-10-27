import { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import conexionCliente from "../config/ConexionCliente";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [authUsuario, setAuthUsuario] = useState({})
  const [authModulos, setAuthModulos] = useState([])

  const [authPermisos, setAuthPermiso] = useState([])

  const [alerta, setAlerta] = useState({
    error: false,
    show: false,
    message: ''
  })

  const [verEliminarRestaurar, setVerEliminarRestaurar] = useState(false)

  useEffect(() => {
    const autenticarUsuario = async () => {
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
        const { data } = await conexionCliente('/usuarios/perfil', config)
        setAuthUsuario(data)
        if (data.cm_clave) {
          navigate('/auth/resetear')
        }
        setAuthModulos(JSON.parse(localStorage.getItem('modulos')));
        navigate('/home')

      } catch (error) {
        setAuthUsuario({})
        navigate('/auth')
      }
    }
    autenticarUsuario()
  }, [])

  //CARGAR LOS PERMISOS SEGUN EL MODULO
  useEffect(() => {
    if (authUsuario.id_usuario) {
      const modulos = JSON.parse(localStorage.getItem('modulos'))
      const [modulo] = modulos.filter(m => m.nombre_modulo.toLowerCase() === location.pathname.split('/')[1])
      setAuthPermiso(modulo?.permisos)
    }
  }, [location.pathname, authUsuario.id_usuario])

  const cerrar_salir = () => {
    setAuthUsuario({})
    setAuthModulos([])
    localStorage.removeItem('token')
    localStorage.removeItem('modulos')
    navigate("/auth")
  }

  const Permisos_DB = {
    CONSULTAR: 'consultar',
    CREAR_EDITAR: 'crear/editar',
    BORRAR: 'borrar',
    RESTAURAR: 'restaurar'
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const obj = useMemo(() => ({
    authUsuario, setAuthUsuario, authModulos, setAuthModulos,
    cerrar_salir, authPermisos, Permisos_DB, alerta, setAlerta,
    verEliminarRestaurar, setVerEliminarRestaurar
  }))

  return (
    <AuthContext.Provider
      value={obj}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider };

export default AuthContext 