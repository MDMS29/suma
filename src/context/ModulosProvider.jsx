import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conexionCliente from "../config/ConexionCliente";
import useAuth from "../hooks/useAuth";
import ModalAsignarMenu from "../components/Modulos/ModalAsignarMenu";

const ModulosContext = createContext();

// eslint-disable-next-line react/prop-types
const ModulosProvider = ({ children }) => {
  const navigate = useNavigate()

  const [dataModulos, setDataModulos] = useState([]);
  const [dataMenus, setDataMenus] = useState([]);
  const [ModuloState, setModuloState] = useState({});
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);

  const [rolesEdit, setrolesEdit] = useState([]);

  const { authModulo, setAlerta, setAuthUsuario, setVerEliminarRestaurar } = useAuth();

  const [ModulosAgg, setModulosAgg] = useState({
    id_modulo: 0,
    cod_modulo: "",
    nombre_modulo: "",
    roles: [],
  });

  const [MenusAgg, setMenusAgg] = useState({
    id_menu: 0,
    nombre_menu: "",
    link_menu: "",
  });

  const [errors, setErrors] = useState({
    nombre_modulo: "",
    icono: "",
  });

  const [permisosModulo, setPermisosModulo] = useState([]);

  const location = useLocation();

  const handleChangeModulos = (e) => {
    const { name, value } = e.target;
    setModulosAgg((prevModulosAgg) => ({
      ...prevModulosAgg,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (location.pathname.includes("modulos")) {
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

  const eliminarRestablecerModulo = async (id) => {
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
      const { data } = await conexionCliente.delete(`/modulos/${id}?estado=${estado}`, config)

      // console.log(data)
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message })
        setTimeout(() => setAlerta({}), 1500)
        return false
      }
      const moduloActualizados = dataModulos.filter(modulo => modulo.id_modulo !== id)
      setDataModulos(moduloActualizados)

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

  const obtenerroles = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente(`/roles?estado=1`, config);
      setRoles(data);
      // console.log(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const obtenerMenus = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(id_modulo)
    try {
      const { data } = await conexionCliente(`/menus/modulo/${ModuloState.id_modulo}?estado=1`, config);
      setMenus(data);
      console.log(data);
    } catch (error) {
      console.error("Error al obtener menus:", error);
    }
  };

  const guardarModulos = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente.post("/modulos", formData, config);
      // console.log("Información guardada con éxito:", response);
      if (!data?.error) {
        setDataModulos([...dataModulos, data]);
        // setDataUsuarios([...dataUsuarios, data])

        setAlerta({
          error: false,
          show: true,
          message: "Modulo creado con exito",
        });

        setTimeout(() => setAlerta({}), 1500);

        return true;
      }
      return false;
    } catch (error) {
      // console.log(error);
      setAlerta({
        error: true,
        show: true,
        message: error.response,
      });
      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const editarModulo = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Realiza la solicitud PATCH API para editar la información del modulo
      const { data } = await conexionCliente.patch(
        `/modulos/${formData.id_modulo}`,
        formData,
        config
      );

      if (data?.id_modulo) {
        // ACTUALIZAR STATE, MOSTRAR MENSAJE Y CERRAR MODAL
        const modulosActualizados = dataModulos.map((modulo) =>
          modulo.id_modulo === data.id_modulo ? data : modulo
        );
        setDataModulos(modulosActualizados);
        setAlerta({
          error: false,
          show: true,
          message: 'Modulo editado con exito'
        })

        setTimeout(() => setAlerta({}), 1500)
        return true;
      }

      setAlerta({
        error: true,
        show: true,
        message: data.message
      })
      setTimeout(() => setAlerta({}), 1500)
      return false

    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message
      })
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
        return { error: true, message: data.message };
      }

      const { id_modulo, cod_modulo, nombre_modulo, icono } = data;

      let rolesModulo = [];
      setModulosAgg({
        id_modulo,
        cod_modulo: cod_modulo,
        nombre_modulo: nombre_modulo,
        icono: icono,
      });

      await data?.roles.map((roles) => {
        rolesModulo.push({
          id_rol: +roles?.id_rol,
          id_estado: +roles?.id_estado,
        });
      });

      setrolesEdit(rolesModulo);
      // console.log(rolesModulo);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

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
    // eliminarModuloProvider,
    // restaurarModuloProvider,
    guardarModulos,
    permisosModulo,
    setPermisosModulo,
    buscarModulo,
    roles,
    obtenerroles,
    rolesEdit,
    setrolesEdit,
    editarModulo,
    obtenerMenus,
    eliminarRestablecerModulo,
    MenusAgg,
    setMenusAgg,
    dataMenus,
    setDataMenus,
  }));

  return (
    <ModulosContext.Provider value={obj}>{children}</ModulosContext.Provider>
  );
};

export { ModulosProvider };

export default ModulosContext;