import { createContext, useState, useEffect, useMemo } from "react";
import conexionCliente from "../config/ConexionCliente";
import { useLocation } from "react-router-dom";

const PerfilesContext = createContext();

// eslint-disable-next-line react/prop-types
const PerfilesProvider = ({ children }) => {

  const [dataPerfiles, setDataPerfiles] = useState([]);
  const [perfilState, setPerfilState] = useState({});
  const [modulosAgg, setModulosAgg] = useState([]);

  const [permisosPerfil, setPermisosPerfil] = useState([])


  const [PerfilesAgg, setPerfilesAgg] = useState({
    nombre_perfil: "",
  });

  const [errors, setErrors] = useState({
    nombre_perfil: "",
  });

  const location = useLocation();

  const handleChangePerfiles = (e) => {
    setPerfilesAgg({ ...PerfilesAgg, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (location.pathname.includes('perfiles')) {

      const ObtenerPerfiles = async () => {
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
            `/perfiles?estado=${estado}`,
            config
          );
          setDataPerfiles(data);
        } catch (error) {
          setDataPerfiles([]);
        }
      };
      ObtenerPerfiles();
    }
  }, [location.pathname]);


  const obtenerModulos = async (perfiles) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente.post(
        `/perfiles/modulos`,
        perfiles,
        config
      );
      console.log(data);
      setModulosAgg(data);
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
    }
  };

  const eliminarPerfilProvider = async () => {
    if (perfilState.id_perfil) {
      const token = localStorage.getItem("token");
      let estadoPerfil = 0;
      if (perfilState.id_estado == 1) {
        estadoPerfil = 2;
      } else {
        estadoPerfil = 1;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await conexionCliente.delete(
          `/perfiles/${perfilState.id_perfil}?estado=${estadoPerfil}`,
          config
        );
        console.log(data);
        if (data.error) {
          console.log(data.message);
        }

        const perfilActualizados = dataPerfiles.filter(
          (perfil) => perfil.id_perfil !== perfilState.id_perfil
        );
        setDataPerfiles(perfilActualizados);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const restaurarPerfilProvider = async () => {
    if (perfilState.id_perfil) {
      const token = localStorage.getItem("token");
      let estadoPerfil = 0;
      if (perfilState.id_estado == 2) {
        estadoPerfil = 1;
      } else {
        estadoPerfil = 2;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await conexionCliente.delete(
          `/perfiles/${perfilState.id_perfil}?estado=${estadoPerfil}`,
          config
        );
        console.log(data);
        if (data.error) {
          console.log(data.message);
        }

        const perfilActualizados = dataPerfiles.filter(
          (perfil) => perfil.id_perfil !== perfilState.id_perfil
        );
        setDataPerfiles(perfilActualizados);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const guardarPerfil = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await conexionCliente.post(
        "/perfiles",
        formData,
        config
      );
      console.log("Información guardada con éxito:", response);
      setDataPerfiles([...dataPerfiles, response.data]); // Puede devolver los datos guardados si es necesario
    } catch (error) {
      console.error("Error al guardar la información:", error);
      throw error; // Puedes lanzar una excepción en caso de error
    }
  };

  const obj = useMemo(() => ({
    dataPerfiles,
    setDataPerfiles,
    perfilState,
    setPerfilState,
    modulosAgg,
    setModulosAgg,
    errors,
    setErrors,
    handleChangePerfiles,
    obtenerModulos,
    eliminarPerfilProvider,
    restaurarPerfilProvider,
    guardarPerfil,
    permisosPerfil,
    setPermisosPerfil
  }))

  return (
    <PerfilesContext.Provider
      value={obj}
    >
      {children}
    </PerfilesContext.Provider>
  );
};
export { PerfilesProvider };

export default PerfilesContext;
