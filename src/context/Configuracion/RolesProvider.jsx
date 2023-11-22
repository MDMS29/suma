import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";

const RolesContext = createContext();
 
const RolesProvider = ({ children }) => {
  const location = useLocation()

  const { setAlerta, setAuthUsuario, setVerEliminarRestaurar } = useAuth()
  const [dataRoles, setDataRoles] = useState([])
  const [permisosRoles, setPermisosRoles] = useState([])
  const [rolAgg, setRolAgg] = useState({ id_rol: 0, nombre: '', descripcion: '' })
  const [errors, setErrors] = useState({ nombre: '', descripcion: '' });

  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname.includes('roles')) {
      (async () => {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("inactivos") ? 2 : 1;
        try {
          const { data } = await conexion_cliente(`/roles?estado=${estado}`, config);
          if (data.error) {
            setAlerta({
              error: true,
              show: true,
              message: data.message
            })
          }
          if (data.error == false) {
            setDataRoles([]);
            return
          }

          setDataRoles(data);
        } catch (error) {
          return setDataRoles([]);
        }
      })()
    }
  }, [location.pathname])

  const guardar_rol = async (formData) => {

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
      const { data } = await conexion_cliente.post('/roles', formData, config)
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      setDataRoles((dataRoles) => [data, ...dataRoles])
      setAlerta({ error: false, show: true, message: 'Rol creado con exito' })
      setTimeout(() => setAlerta({}), 1500)
      return true

    } catch (error) {
      setAlerta({ error: true, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const buscar_rol = async (id) => {

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
      const { data } = await conexion_cliente(`roles/${id}`, config)
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      setRolAgg(data)
      return

    } catch (error) {
      setAlerta({ error: true, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const editar_rol = async (formData) => {
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
      const { data } = await conexion_cliente.patch(`/roles/${formData.id_rol}`, formData, config)
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const Roles_Actualizados = dataRoles.map(rol => rol.id_rol === data.id_rol ? data : rol)
      setDataRoles(Roles_Actualizados)

      setAlerta({ error: false, show: true, message: 'Rol editado con exito' })
      setTimeout(() => setAlerta({}), 1500)
      return true

    } catch (error) {
      setAlerta({ error: true, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const eliminar_rol = async (id) => {
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
      const { data } = await conexion_cliente.delete(`/roles/${id}?estado=${estado}`, config)

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const rolesActualizados = dataRoles.filter(rol => rol.id_rol !== id)
      setDataRoles(rolesActualizados)

      setAlerta({ error: false, show: true, message: data.message })
      setTimeout(() => setAlerta({}), 1500)
      setVerEliminarRestaurar(false)
      return true

    } catch (error) {
      setAlerta({ error: true, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }
 
  const obj = useMemo(() => ({
    dataRoles, permisosRoles, setPermisosRoles, errors, setErrors,
    rolAgg, setRolAgg, guardar_rol, buscar_rol, editar_rol, eliminar_rol
  }))

  return (
    <RolesContext.Provider
      value={obj}
    >
      {children}
    </RolesContext.Provider>
  )
}

export { RolesProvider };

export default RolesContext 