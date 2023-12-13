import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";
import { TIPOS_ALERTAS } from "../../helpers/constantes.js";

const TipoOrdenContext = createContext();

const TipoOrdenProvider = ({ children }) => {
  const { setAlerta, authUsuario } = useAuth();
  const [dataTipoOrden, setDataTipoOrden] = useState([]);
  const [permisosTipoOrden, setPermisosTipoOrden] = useState([]);
  const [tiposProd, setTiposProd] = useState([]);

  const [tipoProdEdit, setTipoProdEdit] = useState([]);

  const [errors, setErrors] = useState({
    tipo_orden: "",
    consecutivo: 0,
  });

  const [tipoOrdenAgg, setTipoOrdenAgg] = useState({
    id_tipo_orden: 0,
    tipo_orden: "",
    consecutivo: 0,
    id_empresa: authUsuario.id_empresa && authUsuario.id_empresa,
    tipos_productos: [],
  });

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("ordenes")) {
      (async () => {
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
              `/opciones-basicas/tipos-ordenes?empresa=${authUsuario.id_empresa}`,
              config
            );
            if (data.error == false) {
              setDataTipoOrden([]);
              return;
            }
            setDataTipoOrden(data);
          } catch (error) {
            setDataTipoOrden([]);
          }
        }
      })();
    }
  }, [location.pathname]);

  const obtener_tipos_productos = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/tipos-producto?estado=1&empresa=${authUsuario.id_empresa}`,
        config
      );
      setTiposProd(data);
    } catch (error) {
      console.error("Error al obtener tipos de productos:", error);
    }
  };

  const guardar_tipo_orden = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.post(
        "/opciones-basicas/tipos-ordenes",
        formData,
        config
      );
      if (!data?.error) {
        setDataTipoOrden((dataTipoOrden) => [data, ...dataTipoOrden]);

        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Tipo de orden creado con exito",
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
    }
  };

  const buscar_tipo_orden = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/tipos-ordenes/${id}`,
        config
      );
      if (data?.error) {
        return { error: TIPOS_ALERTAS.ERROR, message: data.message };
      }

      const { id_tipo_orden, tipo_orden, consecutivo } = data;

      let tiposProductos = [];

      setTipoOrdenAgg({
        id_tipo_orden,
        id_empresa: authUsuario.id_empresa,
        tipo_orden: tipo_orden,
        consecutivo: consecutivo,
      });

      await data?.tipos_productos.map((tiposProd) => {
        tiposProductos.push({
          id_tipo_producto: +tiposProd?.id_tipo_producto,
          id_tipo_producto_orden: +tiposProd?.id_tipo_producto_orden,
          id_estado: +tiposProd?.id_estado,
        });
      });

      setTipoProdEdit(tiposProductos);
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response,
      });
      throw error;
    }
  };

  const editar_tipo_orden = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/opciones-basicas/tipos-ordenes/${formData.id_tipo_orden}`,
        formData,
        config
      );

      if (data?.id_tipo_orden) {
        const tiposOrdenActualizados = dataTipoOrden.map((tiposProd) =>
          tiposProd.id_tipo_orden === data.id_tipo_orden ? data : tiposProd
        );
        setDataTipoOrden(tiposOrdenActualizados);
        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Tipo de orden editado con exito",
        });

        setTipoProdEdit([]);
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
      throw error;
    }
  };

  const obj = useMemo(() => ({
    dataTipoOrden,
    permisosTipoOrden,
    setPermisosTipoOrden,
    errors,
    setErrors,
    obtener_tipos_productos,
    guardar_tipo_orden,
    tipoOrdenAgg,
    setTipoOrdenAgg,
    tiposProd,
    tipoProdEdit,
    setTipoProdEdit,
    buscar_tipo_orden,
    editar_tipo_orden,
  }));
  return (
    <TipoOrdenContext.Provider value={obj}>
      {" "}
      {children}
    </TipoOrdenContext.Provider>
  );
};
export { TipoOrdenProvider };
export default TipoOrdenContext;
