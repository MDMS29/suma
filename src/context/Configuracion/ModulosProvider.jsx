import { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conexionCliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import {TIPOS_ALERTAS} from "../../helpers/constantes.js"

const ModulosContext = createContext();

const ModulosProvider = ({ children }) => {
  const navigate = useNavigate();

  const [dataModulos, setDataModulos] = useState([]);
  const [dataMenus, setDataMenus] = useState([]);
  const [ModuloState, setModuloState] = useState({});
  const [MenuState, setMenuState] = useState({});
  const [roles, setRoles] = useState([]);
  const [rolesEdit, setrolesEdit] = useState([]);
  const [textoBotonIcon, setTextoBotonIcon] = useState("Seleccionar");
  const { setAlerta, setAuthUsuario, setVerEliminarRestaurar } = useAuth();

  const [ModulosAgg, setModulosAgg] = useState({
    id_modulo: 0,
    cod_modulo: "",
    nombre_modulo: "",
    icono: "",
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
  const [permisosMenu, setMenuModulo] = useState([]);

  const location = useLocation();

  const cambiar_modulos = (e) => { 
    setModulosAgg((prevModulosAgg) => ({
      ...prevModulosAgg,
      [e.target.name]:
        e.target.name == "nombre_modulo"
          ? e.target.value.replace(/\d/g, "")
          : e.target.value,
    }));
  };

  const cambiar_menu = (e) => {
    const { name, value } = e.target;
    setMenusAgg((prevMenuAgg) => ({
      ...prevMenuAgg,
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
          if (data.error == false) {
            setDataModulos([]);
            return
          }
          setDataModulos(data)

        } catch (error) {
          setDataModulos([]);
        }
      };
      ObtenerModulos();
    }
  }, [location.pathname]);

  const eliminar_restablecer_modulo = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthUsuario({});
      navigate("/auth");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const estado = location.pathname.includes("inactivos") ? 1 : 2;
      const { data } = await conexionCliente.delete(
        `/modulos/${id}?estado=${estado}`,
        config
      );

      if (data?.error) {
        setAlerta({ error: TIPOS_ALERTAS.SUCCESS, show: true, message: data.message });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }
      const moduloActualizados = dataModulos.filter(
        (modulo) => modulo.id_modulo !== id
      );
      setDataModulos(moduloActualizados);

      setAlerta({ error: TIPOS_ALERTAS.SUCCESS, show: true, message: data.message });
      setTimeout(() => setAlerta({}), 1500);
      setVerEliminarRestaurar(false);
      return true;
    } catch (error) {
      setAlerta({
        error:TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      return false;
    }
  };

  const eliminar_restablecer_menu = async (id_menu) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthUsuario({});
      navigate("/auth");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const estado = location.pathname.includes("inactivos") ? 1 : 2;
      const { data } = await conexionCliente.delete(
        `/menus/${id_menu}?estado=${estado}`,
        config
      );

      if (data?.error) {
        setAlerta({ error: TIPOS_ALERTAS.ERROR, show: true, message: data.message });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }

      const menusActualizados = dataMenus.filter(
        (menu) => menu.id_menu !== id_menu
      );
      setDataMenus(menusActualizados);

      setAlerta({ error: TIPOS_ALERTAS.SUCCESS, show: true, message: data.message });
      setTimeout(() => setAlerta({}), 1500);
      setVerEliminarRestaurar(false);
      return true;
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response?.data.message,
      });
      setTimeout(() => setAlerta({}), 1500);

      return false;
    }
  };

  const obtener_roles = async () => {
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
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const obtener_menus = async (id_modulo) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await conexionCliente(
        `/menus/modulo/${id_modulo}?estado=1`,
        config
      );
      if (data.message) {
        setDataMenus([]);
        return;
      }
      setDataMenus(data);
      return;
    } catch (error) {
      setAlerta({
        error:TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message,
      });
    }
  };

  const guardar_modulos = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente.post("/modulos", formData, config); 
      if (!data?.error) {
        setDataModulos((dataModulos) => [data, ...dataModulos]);

        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Modulo creado con exito",
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
        message: error.response,
      });
      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const guardar_menu = async (id_modulo, formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await conexionCliente.post(
        `/menus/modulo/${id_modulo}`,
        formData,
        config
      );

      if (!data?.error) { 
        setDataMenus([...dataMenus, data]);

        setAlerta({
          error:  TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Menú creado con éxito",
        });
        setTimeout(() => setAlerta({}), 1500);

        return true;
      }
      return false;
    } catch (error) {
      setAlerta({
        error:  TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response,
      });
      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const editar_modulo = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try { 
      const { data } = await conexionCliente.patch(
        `/modulos/${formData.id_modulo}`,
        formData,
        config
      );

      if (data?.id_modulo) { 
        const modulosActualizados = dataModulos.map((modulo) =>
          modulo.id_modulo === data.id_modulo ? data : modulo
        );
        setDataModulos(modulosActualizados);
        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: "Modulo editado con exito",
        });

        setTimeout(() => setAlerta({}), 1500);
        return true;
      }

      setAlerta({
        error:TIPOS_ALERTAS.ERROR,
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

  const editar_menu = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexionCliente.patch(
        `/menus/${formData.id_menu}`,
        formData,
        config
      );

      if (data?.id_menu) { 
        const menusActualizados = dataMenus.map((menu) =>
          menu.id_menu === data.id_menu ? data : menu
        );
        setDataMenus(menusActualizados);
        return true;
      }
      return false;
    } catch (error) {
      setAlerta({
        error:TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message,
      });
      throw error;
    }
  };

  const buscar_modulo = async (id) => {
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
        return { error: TIPOS_ALERTAS.ERROR, message: data.message };
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
    } catch (error) {
      setAlerta({
        error:TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response.data.message,
      });
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
    cambiar_modulos,
    guardar_modulos,
    permisosModulo,
    setPermisosModulo,
    buscar_modulo,
    roles,
    obtener_roles,
    rolesEdit,
    setrolesEdit,
    editar_modulo,
    obtener_menus,
    eliminar_restablecer_modulo,
    eliminar_restablecer_menu,
    MenusAgg,
    setMenusAgg,
    dataMenus,
    setDataMenus,
    guardar_menu,
    editar_menu,
    MenuState,
    setMenuState,
    permisosMenu,
    setMenuModulo,
    cambiar_menu,
    textoBotonIcon,
    setTextoBotonIcon,
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