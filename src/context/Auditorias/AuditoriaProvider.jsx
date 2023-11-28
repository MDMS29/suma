/* eslint-disable react/prop-types */
import { useMemo, createContext, useEffect, useState } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
const AuditoriaContext = createContext();

const AuditoriaProvider = ({ children }) => {
  const location = useLocation();

  const { setAlerta } = useAuth();
  const [dataAuditoria, setDataAuditoria] = useState([]);
  const [permisosAuditoria, setPermisosAuditoria] = useState([]);

  useEffect(() => {
    if (location.pathname.includes("auditoria")) {
      (async () => {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        try {
          const { data } = await conexion_cliente(
            `/auditorias/historial/logs`,
            config
          );
          console.log(data ? "si hay" : "no hay");

          if (data.error) {
            setAlerta({
              error: true,
              show: true,
              message: data.message,
            });
          }
          if (data.error == false) {
            setDataAuditoria([]);
            return;
          }
          setDataAuditoria(data);
        } catch (error) {
          return setDataAuditoria([]);
        }
      })();
    }
  }, [location.pathname]);

  const obj = useMemo(() => ({
    dataAuditoria, 
    setDataAuditoria,
    permisosAuditoria,
    setPermisosAuditoria,
  }));

  return (
    <AuditoriaContext.Provider value={obj}>
      {children}
    </AuditoriaContext.Provider>
  );
};

export { AuditoriaProvider };
export default AuditoriaContext;
