import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import conexion_cliente from "../../config/ConexionCliente";
import { TIPOS_ALERTAS } from "../../helpers/constantes.js"

const UnidadesContext = createContext();

const UnidadesProvider = ({ children }) => {

  const { setAlerta, authUsuario } = useAuth();
  const [dataUnidades, setDataUnidades] = useState([]);
  const [unidadState, setUnidadState] = useState({});
  const [permisosUnidades, setPermisosUnidades] = useState([]);

  const [UnidadesAgg, setUnidadesAgg] = useState({
    id_unidad: 0,
    id_empresa: authUsuario.id_empresa,
    unidad: "",
  });

  const [errors, setErrors] = useState({ id_unidad: 0, unidad: '' });

  const location = useLocation();

  const obtener_unidades = async () => {
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
          `/opciones-basicas/unidades-medida?estado=1&empresa=${authUsuario.id_empresa}`,
          config
        );
        if (data.error == false) {
          dataUnidades([]);
          return
        }
        setDataUnidades(data);
      } catch (error) {
        setDataUnidades([]);
      }
    }
  }

  useEffect(() => {
    if (location.pathname.includes("unidades")) {
      obtener_unidades()
    }
  }, [location.pathname]);

  const buscar_unidad = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/unidades-medida/${id}`,
        config
      );

      if (data?.error) {
        setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const { id_unidad, unidad } = data;
      setUnidadesAgg({
        id_unidad,
        unidad: unidad,
      });
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
    }
  };

  const guardar_unidad = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.post(
        "/opciones-basicas/unidades-medida",
        formData,
        config
      );

      if (!data?.error) {
        setDataUnidades((dataUnidades) => [data, ...dataUnidades]);
        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Unidad de medida creada con exito",
        });

        setUnidadesAgg({
          id_unidad: 0,
          unidad: "",
        });

        setTimeout(() => setAlerta({}), 1500);
        return true
      }

      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: data.message
      })
      setTimeout(() => setAlerta({}), 1500)
      return false;

    } catch (error) { 
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.data?.message
      });

      setTimeout(() => setAlerta({}), 1500);
      throw error;
    }
  };

  const editar_unidad = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/opciones-basicas/unidades-medida/${formData.id_unidad}`,
        formData,
        config
      );
      if (!data?.error) {
        const unidades_actualizados = dataUnidades.map((unidades) =>
          unidades.id_unidad === data.id_unidad
            ? { id_unidad: data.id_unidad, unidad: data.unidad }
            : unidades
        );
        setDataUnidades(unidades_actualizados);
        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Unidad de medida editada con exito",
        });

        setUnidadesAgg({
          id_unidad: 0,
          unidad: "",
        });
        setTimeout(() => setAlerta({}), 1500);
        return true
      }
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: data.message
      })
      setTimeout(() => setAlerta({}), 1500)
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
    obtener_unidades,
    dataUnidades,
    setDataUnidades,
    buscar_unidad,
    guardar_unidad,
    editar_unidad,
    unidadState,
    setUnidadState,
    permisosUnidades,
    setPermisosUnidades,
    UnidadesAgg,
    setUnidadesAgg,
    errors,
    setErrors
  }));

  return (
    <UnidadesContext.Provider value={obj}>{children}</UnidadesContext.Provider>
  );
};

export { UnidadesProvider };
export default UnidadesContext;
