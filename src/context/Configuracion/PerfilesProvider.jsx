import { createContext, useState, useEffect, useMemo } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth'

const PerfilesContext = createContext();
 
const PerfilesProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation();

  const { setAlerta, setVerEliminarRestaurar, setAuthUsuario } = useAuth()

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



  useEffect(() => {
    if (location.pathname.includes('perfiles')) {

      const obtener_perfiles = async () => {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("inactivos") ? 2 : 1;
        try {
          const { data } = await conexion_cliente(
            `/perfiles?estado=${estado}`,
            config
          );
          if (data.error == false) {
            setDataPerfiles([]);
            return
          }
          setDataPerfiles(data);
        } catch (error) {
          setDataPerfiles([]);
        }
      };
      obtener_perfiles();
    }
  }, [location.pathname]);


  const obtener_modulos = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(`/modulos?estado=1`, config);
      setModulosAgg(data);
    } catch (error) {
      console.error("Error al obtener modulos:", error);
    }
  };

  const buscar_perfil = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(`/perfiles/${id}`, config);

      if (data?.error) {
        return { error: true, message: data.message }
      }

      const { id_perfil, nombre_perfil } = data
      let modulo_check = []

      setPerfilesAgg({
        id_perfil,
        nombre_perfil: nombre_perfil
      })

      await data?.modulos.map((modulo) => {
        modulo_check.push({ id_modulo: +modulo?.id_modulo, id_estado: +modulo?.id_estado })
      })
      setModulosEdit(modulo_check)

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const eliminar_restablecer_perfil = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) {
      setAuthUsuario({})
      navigate('/auth')
      return
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const estado = location.pathname.includes("inactivos") ? 1 : 2;
      const { data } = await conexion_cliente.delete(`/perfiles/${id}?estado=${estado}`, config)

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }

      const perfiles_actualizados = dataPerfiles.filter((perfil) => perfil.id_perfil !== id)
      setDataPerfiles(perfiles_actualizados)

      setAlerta({ error: false, show: true, message: data.message })
      setTimeout(() => setAlerta({}), 1500)
      setVerEliminarRestaurar(false)
      return true

    } catch (error) {
      setAlerta({ error: false, show: true, message: error.response.data.message })
      setTimeout(() => setAlerta({}), 1500)
      return false
    }
  }

  const guardar_perfil = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await conexion_cliente.post(
        "/perfiles",
        formData,
        config
      );

      setDataPerfiles((dataPerfiles) => [response.data, ...dataPerfiles]);
      setAlerta({
        error: false,
        show: true,
        message: 'Perfil creado con exito'
      })

      setPerfilesAgg({
        id_perfil: 0,
        nombre_perfil: ""
      });

      setTimeout(() => setAlerta({}), 1500)

    } catch (error) {
      console.error("Error al guardar la información:", error);

      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
      throw error;  
    }
  };

  const editar_perfil = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(`/perfiles/${formData.id_perfil}`, formData, config);
      const perfiles_actualizados = dataPerfiles.map((perfil) =>
        perfil.id_perfil === data.id_perfil ? { id_perfil: data.id_perfil, nombre_perfil: data.nombre_perfil } : perfil
      );
      setDataPerfiles(perfiles_actualizados);

      setAlerta({
        error: false,
        show: true,
        message: 'Perfil editado con exito'
      })

      setTimeout(() => setAlerta({}), 1500)
      setPerfilesAgg({
        id_perfil: 0,
        nombre_perfil: ""
      });


    } catch (error) {
      console.error("Error al guardar la información:", error);

      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })

      setTimeout(() => setAlerta({}), 1500)
      throw error;  
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
    buscar_perfil,
    obtener_modulos,
    guardar_perfil,
    permisosPerfil,
    setPermisosPerfil,
    PerfilesAgg,
    setPerfilesAgg,
    editar_perfil,
    modulosEdit,
    setModulosEdit,
    eliminar_restablecer_perfil
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
