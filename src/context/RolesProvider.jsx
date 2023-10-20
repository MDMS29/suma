import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import conexionCliente from "../config/ConexionCliente";
import useAuth from "../hooks/useAuth";

const RolesContext = createContext();

// eslint-disable-next-line react/prop-types
const RolesProvider = ({ children }) => {
  const location = useLocation()

  const { setAlerta } = useAuth()

  const [dataRoles, setDataRoles] = useState([])
  const [permisosRoles, setPermisosRoles] = useState([])

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const obj = useMemo(() => ({
    dataRoles, permisosRoles, setPermisosRoles
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