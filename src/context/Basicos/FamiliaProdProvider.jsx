import { createContext, useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import conexion_cliente from "../../config/ConexionCliente";
import { TIPOS_ALERTAS } from "../../helpers/constantes.js"

const FamiliaProdContext = createContext();

const FamiliaProdProvider = ({ children }) => {
  const { setAlerta, authUsuario } = useAuth();
  const [dataFliaPro, setDataFliaPro] = useState([]);
  const [FliaProState, setFliaProState] = useState({});
  const [permisosFliaPro, setPermisosFliaPro] = useState([]);

  const [errors, setErrors] = useState({ referencia: "", descripcion: "" });

  const [FliaProAgg, setFliaProAgg] = useState({
    id_familia: 0,
    id_empresa: authUsuario.id_empresa,
    referencia: "",
    descripcion: "",
  });

  const location = useLocation();

  const obtener_familia_prod = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (authUsuario.id_empresa) {
      try {
        const estado = location.pathname.includes("inactivos") ? 2 : 1;
        const { data } = await conexion_cliente(
          `/opciones-basicas/familias-productos?estado=${estado}&empresa=${authUsuario.id_empresa}`,
          config
        );
        if (data.error == false) {
          setDataFliaPro([]);
          return;
        }
        setDataFliaPro(data);
      } catch (error) {
        setDataFliaPro([]);
      }
    }
  };

  useEffect(() => {
    if (location.pathname.includes("familias-productos")) {
      obtener_familia_prod();
    }
  }, [location.pathname]);

  const buscar_flia_pro = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/familias-productos/${id}`,
        config
      );

      if (data?.error) {
        setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }
      const { id_familia, referencia, descripcion } = data;

      setFliaProAgg({
        id_familia,
        id_empresa: authUsuario.id_empresa,
        referencia,
        descripcion,
      });
    } catch (error) {
      setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  };

  const guardar_flia_prod = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.post(
        "/opciones-basicas/familias-productos",
        formData,
        config
      );

      if (!data?.error) {
        setDataFliaPro((dataFliaPro) => [data, ...dataFliaPro]);
        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Familia de productos creada con exito",
        });
        setFliaProAgg({
          id_familia: 0,
          referencia: "",
          descripcion: "",
        });
        setTimeout(() => setAlerta({}), 1500);
        return true;
      }

      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: data.message,
      });
      setTimeout(() => setAlerta({}), 1500);
      return false;
    } catch (error) { 
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      throw error;
    }
  };

  const editar_flia_pro = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/opciones-basicas/familias-productos/${formData.id_familia}`,
        formData,
        config
      );
      const flia_pro_actualizados = dataFliaPro.map((fliapro) =>
        fliapro.id_familia === data.id_familia ? data : fliapro
      );

      if (!data?.error) {
        setDataFliaPro(flia_pro_actualizados);

        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Familia de Producto editado con exito",
        });

        setTimeout(() => setAlerta({}), 1500);
        setFliaProAgg({
          id_familia: 0,
          referencia: "",
          descripcion: "",
        });
        return true;
      }
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: data.message,
      });
      setTimeout(() => setAlerta({}), 1500);
      return false;
    } catch (error) { 
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      throw error;
    }
  };

  const obj = useMemo(() => ({
    obtener_familia_prod,
    dataFliaPro,
    setDataFliaPro,
    FliaProState,
    setFliaProState,
    permisosFliaPro,
    setPermisosFliaPro,
    FliaProAgg,
    setFliaProAgg,
    errors,
    setErrors,
    buscar_flia_pro,
    guardar_flia_prod,
    editar_flia_pro,
  }));

  return (
    <FamiliaProdContext.Provider value={obj}>
      {children}
    </FamiliaProdContext.Provider>
  );
};

export { FamiliaProdProvider };
export default FamiliaProdContext;
