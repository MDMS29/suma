import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import conexionCliente from "../config/ConexionCliente";

const ModulosContext = createContext();

// eslint-disable-next-line react/prop-types
const ModulosProvider = ({ children }) => {
  const [dataModulos, setDataModulos] = useState([]);
  const [ModuloState, setModuloState] = useState({});

  const [ModulosAgg, setModulosAgg] = useState({
    nombre_modulo: "",
    icono: "",
  });

  const [errors, setErrors] = useState({
    nombre_modulo: "",
    icono: "",
  });

  const [permisosModulo, setPermisosModulo] = useState([]);

  const location = useLocation();

  const handleChangeModulos = (e) => {
    setModulosAgg({ ...ModulosAgg, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (location.pathname.includes('modulos')) {
      const ObtenerModulos = async () => {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("inactivos") ? 2 : 1;

        try {
          const { data } = await conexionCliente(
            `/modulos?estado=${estado}`,
            config
          );
          setDataModulos(data);
        } catch (error) {
          setDataModulos([]);
        }
      };
      ObtenerModulos();
    }
  }, [location.pathname]);

  const eliminarModuloProvider = async () => {
    if (ModuloState.id_modulo) {
      const token = localStorage.getItem("token");
      let estadoModulo = 0;
      if (ModuloState.estado_modulo == "ACTIVO") {
        estadoModulo = 2;
      } else {
        estadoModulo = 1;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await conexionCliente.delete(
          `/modulos/${ModuloState.id_modulo}?estado=${estadoModulo}`,
          config
        );
        console.log(data);
        if (data.error) {
          console.log(data.message);
        }

        const moduloActualizados = dataModulos.filter(
          (modulo) => modulo.id_modulo !== ModuloState.id_modulo
        );
        setDataModulos(moduloActualizados);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const restaurarModuloProvider = async () => {
    if (ModuloState.id_modulo) {
      const token = localStorage.getItem("token");
      let estadoModulo = 0;
      if (ModuloState.estado_modulo == "INACTIVO") {
        estadoModulo = 1;
      } else {
        estadoModulo = 2;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await conexionCliente.delete(
          `/modulos/${ModuloState.id_modulo}?estado=${estadoModulo}`,
          config
        );
        console.log(data);
        if (data.error) {
          console.log(data.message);
        }

        const moduloActualizados = dataModulos.filter(
          (modulo) => modulo.id_modulo !== ModuloState.id_modulo
        );
        setDataModulos(moduloActualizados);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const guardarModulo = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await conexionCliente.post("/modulos", formData, config);
      console.log("Información guardada con éxito:", response);
      setDataModulos([...dataModulos, response.data]); // Puede devolver los datos guardados si es necesario
    } catch (error) {
      console.error("Error al guardar la información:", error);
      throw error; // Puedes lanzar una excepción en caso de error
    }
  };

  const buscarModulo = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/modulos/${id}`, config);
      if (data?.error) {
        return { error: true, message: data.message }
      }

      const { id_modulo, nombre_modulo, icono } = data.modulo
      setUsuariosAgg(
        {
          id_modulo,
          nombre: nombre_modulo,
          icono: icono,
        }
      )
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const obj = useMemo(() => ({
    dataModulos,
    setDataModulos,
    ModuloState,
    setModuloState,
    ModulosAgg,
    setModulosAgg,
    errors,
    setErrors,
    handleChangeModulos,
    eliminarModuloProvider,
    restaurarModuloProvider,
    guardarModulo,
    permisosModulo,
    setPermisosModulo,
    buscarModulo
  }));

  return (
    <ModulosContext.Provider
      value={obj}
    >
      {children}
    </ModulosContext.Provider>
  );
};

export { ModulosProvider };

export default ModulosContext;
