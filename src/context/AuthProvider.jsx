import { createContext } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import conexionCliente from "../config/ConexionCliente";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [authUsuario, setAuthUsuario] = useState({})
  const [authModulos, setAuthModulos] = useState([])
  

  useEffect(() => {
    const autenticarUsuario = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const config = {
        headers: {
          "Content-Type": "apllication/json",
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const { data } = await conexionCliente('/usuarios/perfil', config)
        setAuthUsuario(data)
        if (data.cm_clave) {
          console.log("data")
          navigate('/auth/resetear')
        }
        setAuthModulos(JSON.parse(localStorage.getItem('modulos')));
        navigate('/home')

      } catch (error) {
        setAuthUsuario({})
        navigate('/')
      }
    }
    autenticarUsuario()
  }, [])

  const cerrar_salir = () => {
    setAuthUsuario({})
    setAuthModulos([])
    localStorage.removeItem('token')
    localStorage.removeItem('modulos')
    navigate("/")
  }

  return (
    <AuthContext.Provider
      value={{
        authUsuario, setAuthUsuario,
        authModulos, setAuthModulos,
        cerrar_salir
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider };

export default AuthContext 