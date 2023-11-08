import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";
const TipoProdContext = createContext();

const TipoProdProvider = ({ children }) => {

  const { setAlerta, authUsuario } = useAuth();
  const [dataTipoProf, setDataTipoProf] = useState([]);
  const [TipoProdState, setTipoProdState] = useState({});
  const [permisosTipoProd, setpermisosTipoProd] = useState([]);

  const [TipoProdAgg, setTipoProdAgg] = useState({
    id_tipo_producto: 0,
    id_empresa: authUsuario.id_empresa,
    descripcion: "",
  })

  const [errors, setErrors] = useState({ descripcion: '', });

  const location = useLocation();

  const obtener_tipo_producto = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (authUsuario.id_empresa) {
      try {
        const { data } = await conexion_cliente(
          `/opciones-basicas/tipos-producto?estado=1&empresa=${authUsuario.id_empresa}`,
          config
        );
        setDataTipoProf(data);
      } catch (error) {
        setDataTipoProf([]);
      }
    }
  }

  useEffect(() => {
    if (location.pathname.includes("tipos-productos")) {
      obtener_tipo_producto()
    }
  }, [location.pathname]);

  const buscar_tipo_prod = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/tipos-producto/${id}`,
        config
      );

      if (data?.error) {
        return { error: true, message: data.message };
      }
      // const { id_tipo_producto, descripcion } = data;
      setTipoProdAgg(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const guardar_tipo_prod = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await conexion_cliente.post(
        "/opciones-basicas/tipos-producto",
        formData,
        config
      );

      setDataTipoProf((dataTipoProf) => [response.data, ...dataTipoProf]);
      setAlerta({
        error: false,
        show: true,
        message: "Tipo de Producto creado con exito",
      });

      setTipoProdAgg({
        id_tipo_producto: 0,
        descripcion: "",
      });

      setTimeout(() => setAlerta({}), 1500);
    } catch (error) {
      console.error("Error al guardar la información:", error);

      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      throw error;
    }
  };

  const editar_tipo_prod = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/opciones-basicas/tipos-producto/${formData.id_tipo_producto}`,
        formData,
        config
      );
      const tipos_prod_actualizados = dataTipoProf.map((tipoprod) =>
        tipoprod.id_tipo_producto === data.id_tipo_producto
          ? data
          : tipoprod
      );
      setDataTipoProf(tipos_prod_actualizados);

      setAlerta({
        error: false,
        show: true,
        message: "Tipo de producto editado con exito",
      });

      setTimeout(() => setAlerta({}), 1500);
      setTipoProdAgg({
        id_tipo_producto: 0,
        descripcion: "",
      });
    } catch (error) {
      console.error("Error al guardar la información:", error);

      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      throw error;
    }
  };

  const obj = useMemo(() => ({
    obtener_tipo_producto,
    dataTipoProf,
    setDataTipoProf,
    TipoProdState,
    setTipoProdState,
    permisosTipoProd,
    setpermisosTipoProd,
    TipoProdAgg,
    setTipoProdAgg,
    errors,
    setErrors,
    buscar_tipo_prod,
    guardar_tipo_prod,
    editar_tipo_prod
  }));

  return (
    <TipoProdContext.Provider
      value={obj}
    >      {children}
    </TipoProdContext.Provider>
  )
}

export { TipoProdProvider }
export default TipoProdContext