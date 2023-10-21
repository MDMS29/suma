import { createContext, useState, useEffect, useMemo } from "react";
import conexionCliente from "../config/ConexionCliente";
import { useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth'

const PerfilesContext = createContext();

// eslint-disable-next-line react/prop-types
const PerfilesProvider = ({ children }) => {
  const { setAlerta } = useAuth()

  const [dataPerfiles, setDataPerfiles] = useState([]);
  const [perfilState, setPerfilState] = useState({});
  const [modulosAgg, setModulosAgg] = useState([]);
  const [modulosEdit, setModulosEdit] = useState([])

  const [permisosPerfil, setPermisosPerfil] = useState([])


  const [PerfilesAgg, setPerfilesAgg] = useState({
    id_perfil: 0,
    nombre_perfil: ""
  });

  const [errors, setErrors] = useState({
    nombre_perfil: "",
  });

  const location = useLocation();


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


  const obtenerModulos = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/modulos?estado=1`, config);
      setModulosAgg(data);
    } catch (error) {
      console.error("Error al obtener modulos:", error);
    }
  };

  const buscarPerfil = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/perfiles/${id}`, config);

      if (data?.error) {
        return { error: true, message: data.message }
      }

      const { id_perfil, nombre_perfil } = data
      let moduloCheck = []

      setPerfilesAgg({
        id_perfil,
        nombre_perfil: nombre_perfil
      })

      await data?.modulos.map((modulo) => {
        moduloCheck.push({ id_modulo: +modulo?.id_modulo, id_estado: +modulo?.id_estado })
      })

      setModulosEdit(moduloCheck)


    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
        setDataPerfiles([...dataPerfiles, response.data]);
        setAlerta({
          error: false,
          show: true,
          message: 'Perfil creado con exito'
        })

        setTimeout(() => setAlerta({}), 1500)
        
    } catch (error) {
      console.error("Error al guardar la información:", error);

      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
      throw error; // Puedes lanzar una excepción en caso de error
    }
  };

  const editarPerfil = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {

      const { data } = await conexionCliente.patch(`/perfiles/${formData.id_perfil}`, formData, config);
      console.log(data);


        const perfilesActualizados = dataPerfiles.map((perfil) =>
          perfil.id_perfil === data.id_perfil ? {id_perfil: data.id_perfil, nombre_perfil: data.nombre_perfil} : perfil
        );
        setDataPerfiles(perfilesActualizados);

        setAlerta({
          error: false,
          show: true,
          message: 'Perfil editado con exito'
        })

        setTimeout(() => setAlerta({}), 1500)


    } catch (error) {
      console.error("Error al guardar la información:", error);

      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
      throw error; // Puedes lanzar una excepción en caso de error


    }
  }


  const obj = useMemo(() => ({
    dataPerfiles,
    setDataPerfiles,
    perfilState,
    setPerfilState,
    modulosAgg,
    setModulosAgg,
    errors,
    setErrors,
    buscarPerfil,
    obtenerModulos,
    eliminarPerfilProvider,
    restaurarPerfilProvider,
    guardarPerfil,
    permisosPerfil,
    setPermisosPerfil,
    PerfilesAgg,
    setPerfilesAgg,
    editarPerfil,
    modulosEdit,
    setModulosEdit
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
