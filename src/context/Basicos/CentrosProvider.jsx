import { createContext, useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import conexion_cliente from "../../config/ConexionCliente";
const CentrosContext = createContext();

const CentrosProvider = ({ children }) => {
  const { setAlerta, authUsuario } = useAuth();
  const [dataCentros, setDataCentros] = useState([]);
  const [CentroState, setCentroState] = useState({});
  const [permisosCentros, setPermisosCentros] = useState([]);

  const [errors, setErrors] = useState({
    codigo: "",
    centro_costo: "",
    id_proceso: "",
    consecutivo: "",
    correo_responsable: "",
  });

  const [CentrosAgg, setCentrosAgg] = useState({
    id_centro: 0,
    id_empresa: authUsuario.id_empresa && authUsuario.id_empresa,
    codigo: "",
    centro_costo: "",
    id_proceso: 0,
    consecutivo: 0,
    correo_responsable: "",
  });

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("centros")) {
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
            const estado = location.pathname.includes("inactivos") ? 2 : 1;
            const { data } = await conexion_cliente(
              `/opciones-basicas/centro-costo-empresa?estado=${estado}&empresa=${authUsuario.id_empresa}`,
              config
            );
            if (data.error == false){
              setDataCentros([]);
              return
            }
            setDataCentros(data);
          } catch (error) {
            setDataCentros([]);
          }
        }
      })();
    }
  }, [location.pathname]);

  const buscar_centro_costo = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/centro-costo-empresa/${id}`,
        config
      );

      if (data?.error) {
        return { error: true, message: data.message };
      }

      setCentrosAgg(data);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const guardar_centro_costo = async (formData) => {
    const token = localStorage.getItem("token");

    formData.consecutivo = +formData.consecutivo
    formData.id_empresa = authUsuario.id_empresa

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const {data} = await conexion_cliente.post(
        "/opciones-basicas/centro-costo-empresa",
        formData,
        config
      );

      if(data.error){
        setAlerta({
          error: true,
          show: true,
          message: data.message,
        });
        return false
      }

      setDataCentros((dataCentros) => [data, ...dataCentros]);
      setAlerta({
        error: false,
        show: true,
        message: "Centros de Costo creado con exito",
      });

      setCentrosAgg({
        id_centro: 0,
        id_empresa: authUsuario.id_empresa && authUsuario.id_empresa,
        codigo: "",
        centro_costo: "",
        id_proceso: 0,
        consecutivo: 0,
        correo_responsable: "",
      });

      setTimeout(() => setAlerta({}), 1500);
      return true
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

  const editar_centro_costo = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/opciones-basicas/centro-costo-empresa/${formData.id_centro}`,
        formData,
        config
      );

      if(data.error){
        setAlerta({
          error: true,
          show: true,
          message: data.message,
        });
        return false
      }

      const centro_costo_actualizados = dataCentros.map((centros) =>
        centros.id_centro === data.id_centro ? data : centros
      );
      setDataCentros(centro_costo_actualizados);

      setAlerta({
        error: false,
        show: true,
        message: "Centro editado con exito",
      });

      setTimeout(() => setAlerta({}), 1500);
      setCentrosAgg({
        id_centro: 0,
        id_empresa: authUsuario.id_empresa && authUsuario.id_empresa,
        codigo: "",
        centro_costo: "",
        id_proceso: 0,
        consecutivo: 0,
        correo_responsable: "",
      });

      return true
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
    dataCentros,
    setDataCentros,
    CentroState,
    setCentroState,
    permisosCentros,
    CentrosAgg,
    setCentrosAgg,
    errors,
    setErrors,
    setPermisosCentros,
    buscar_centro_costo,
    guardar_centro_costo,
    editar_centro_costo,
  }));

  return (
    <CentrosContext.Provider value={obj}> {children}</CentrosContext.Provider>
  );
};

export { CentrosProvider };
export default CentrosContext;
