import { useEffect } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { createContext } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const RequisicionesContext = createContext();
const RequisicionesProvider = ({ children }) => {
  const { authUsuario } = useAuth();
  const [dataRequisiciones, setDataRequisiciones] = useState([]);

  const location = useLocation();

  
  useEffect(() => {
    if (location.pathname.includes("requisiciones")) {
      const obtenerRequisiciones = async () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("anuladas") ? 5 : location.pathname.includes("aprobadas") ? 4 : 3
        
        console.log(`/compras/requisiciones?estado=${estado && estado}&empresa=${authUsuario.id_empresa}`)
        try {
          const { data } = await conexion_cliente(
            `/compras/requisiciones?estado=${estado}&empresa=${authUsuario.id_empresa}`,
            config
            );

          setDataRequisiciones(data);
          console.log(data);
        } catch (error) {
          setDataRequisiciones([]);
        }
      };

      obtenerRequisiciones();
    }
  }, [location.pathname, authUsuario.empresa_id]);

  const obj = useMemo(() => ({
    dataRequisiciones
  }));
  return (
    <RequisicionesContext.Provider value={obj}>
      {children}
    </RequisicionesContext.Provider>
  );
};

export { RequisicionesProvider };
export default RequisicionesContext;
