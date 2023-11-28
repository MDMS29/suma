/* eslint-disable react/prop-types */
import { useMemo, createContext, useEffect, useState } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
const HistorialContext = createContext();

const HistorialProvider = ({ children }) => {
  const location = useLocation();

  const { setAlerta } = useAuth();
  const [dataHistorial, setDataHistorial] = useState([]);

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
            setDataHistorial([]);
            return;
          }
          setDataHistorial(data);
        } catch (error) {
          return setDataHistorial([]);
        }
      })();
    }
  }, [location.pathname]);
console.log(dataHistorial)


  const obj = useMemo(() => ({
    dataHistorial,
    setDataHistorial,
  }));
  return (
    <HistorialContext.Provider value={obj}>
      {children}
    </HistorialContext.Provider>
  );
};

export { HistorialProvider };
export default HistorialContext;
