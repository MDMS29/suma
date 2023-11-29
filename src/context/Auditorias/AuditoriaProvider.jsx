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
  const [auditoriasFiltradas, setAuditoriasFiltradas] = useState([]);

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

  const filtrar_auditoria = async (formData) => { 
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/auditorias/historial/filtro/logs?inputs=${formData.target.value}`,
        config
      );
      setAuditoriasFiltradas(data);
      return data;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      setAuditoriasFiltradas([]);
    }
  };

  const obj = useMemo(() => ({
    dataAuditoria,
    setDataAuditoria,
    permisosAuditoria,
    setPermisosAuditoria,
    filtrar_auditoria,
    auditoriasFiltradas,
  }));

  return (
    <AuditoriaContext.Provider value={obj}>
      {children}
    </AuditoriaContext.Provider>
  );
};

export { AuditoriaProvider };
export default AuditoriaContext;
