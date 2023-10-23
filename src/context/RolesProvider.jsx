import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conexionCliente from "../config/ConexionCliente";
import useAuth from "../hooks/useAuth";

const RolesContext = createContext();

// eslint-disable-next-line react/prop-types
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
          const { data } = await conexionCliente(`/roles?estado=${estado}`, config);
          if (data.error) {
            setAlerta({
              error: true,
              show: true,
              message: data.message
            })
          }

          setDataRoles(data);
        } catch (error) {
          setAlerta({
            error: true,
            show: true,
            message: error.response.data.message
          })
          setDataRoles([]);
        }
      })()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const guardarRol = async (formData) => {

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
      const { data } = await conexionCliente.post('/roles', formData, config)
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      setDataRoles([...dataRoles, data])
      setAlerta({ error: false, show: true, message: 'Rol creado con exito' })
      setTimeout(() => setAlerta({}), 1500)
      return true

    } catch (error) {
      setAlerta({ error: true, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const buscarRol = async (id) => {

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
      const { data } = await conexionCliente(`roles/${id}`, config)
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

  const editarRol = async (formData) => {
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
      const { data } = await conexionCliente.patch(`/roles/${formData.id_rol}`, formData, config)
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const rolesActualizados = dataRoles.map(rol => rol.id_rol === data.id_rol ? data : rol)
      setDataRoles(rolesActualizados)

      setAlerta({ error: false, show: true, message: 'Rol editado con exito' })
      setTimeout(() => setAlerta({}), 1500)
      return true

    } catch (error) {
      setAlerta({ error: true, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const eliminarRol = async (id) => {
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
      const { data } = await conexionCliente.delete(`/roles/${id}?estado=${estado}`, config)

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const obj = useMemo(() => ({
    dataRoles, permisosRoles, setPermisosRoles, errors, setErrors,
    rolAgg, setRolAgg, guardarRol, buscarRol, editarRol, eliminarRol
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