import { createContext, useEffect, useMemo, useState } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ProveedoresContext = createContext();

const ProveedoresProvider = ({ children }) => {
  const { setAlerta, authUsuario, setAuthUsuario, setVerEliminarRestaurar } =
    useAuth();
  const [permisosProveedor, setPermisosProveedor] = useState([]);
  const [dataProveedores, setDataProveedores] = useState([]);
  const [proveedorState, setProveedorState] = useState({});

  const [tipoDocAgg, setTipoDocAgg] = useState([]);
  const [tipoProdAgg, setTipoProdAgg] = useState([]);
  const [tipoProdEdit, setTipoProdEdit] = useState([]);

  const [tipoProdSeleccionados, setTipoProdSeleccionados] = useState([]);


  const [proveedorAgg, setProveedorAgg] = useState({
    id_tercero: 0,
    id_empresa:
      authUsuario && authUsuario.id_empresa ? authUsuario.id_empresa : 0,
    id_tipo_tercero: 2,
    id_tipo_documento: 0,
    documento: "",
    nombre: "",
    direccion: "",
    telefono: "",
    correo: "",
    contacto: "",
    telefono_contacto: "",
    id_estado: 1,
  });

  useEffect(() => {
    if (location.pathname.includes("proveedores")) {
      const obtener_proveedores = async () => {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("inactivos") ? 2 : 1;
        if (authUsuario.id_empresa) {
          try {
            const { data } = await conexion_cliente(
              `/compras/proveedores?estado=${estado}&empresa=${authUsuario.id_empresa}`,
              config
            );
            if (data.error) {
              setAlerta({
                error: true,
                show: true,
                message: data.message,
              });
            }
            if (data.error == false) {
              setDataProveedores([]);
              return;
            }
            setDataProveedores(data);
          } catch (error) {
            return setDataProveedores([]);
          }
        }
      };
      obtener_proveedores();
    }
  }, [location.pathname]);

  const eliminar_restablecer_proveedor = async (id) => { 
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
      const { data } = await conexion_cliente.delete(
        `/compras/proveedores/${id}?estado=${estado}`,
        config
      );

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }

      const proveedores_actualizados = dataProveedores.filter(
        (proveedor) => proveedor.id_tercero !== id
      );
      setDataProveedores(proveedores_actualizados);

      setAlerta({ error: false, show: true, message: data.message });
      setTimeout(() => setAlerta({}), 1500);
      setVerEliminarRestaurar(false);
      return true;
    } catch (error) {
      setAlerta({ error: false, show: true, message: error.data });
      setTimeout(() => setAlerta({}), 1500);
      return false;
    }
  };
  const guardar_proveedores = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.post(
        "/compras/proveedores",
        formData,
        config
      );

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }
      setDataProveedores((dataProveedores) => [data, ...dataProveedores]);
 
      setAlerta({
        error: false,
        show: true,
        message: `Se ha creado el proveedor con documento ${formData.documento}`,
      });
      setTimeout(() => setAlerta({}), 1500);
      return true;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      return false;
    }
  };

  const obtener_tipo_documento = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/tipos-documento`,
        config
      );
      setTipoDocAgg(data);
      if (data.error == false) {
        setTipoDocAgg([]);
        return;
      }
    } catch (error) {
      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const obtener_tipo_producto = async () => {
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
      setTipoProdAgg(data);
    } catch (error) {
      console.error("Error al obtener los tipos de productos:", error);
    }
  };

  const buscar_proveedor = async (id) => {
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
      const { data } = await conexion_cliente(
        `/compras/proveedores/${id}`,
        config
      );
      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }

      setProveedorAgg(data);
      let tipoprod_check = [];
      await data?.suministros.map((suministro) => {
        tipoprod_check.push({
          id_tipo_producto: suministro?.id_tipo_producto,
          id_suministro: suministro?.id_suministro,
          id_estado: suministro?.id_estado,
        });
      });
      setTipoProdSeleccionados(tipoprod_check);
      return;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const editar_proveedores = async (formData) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Check if the document number already exists
      const docExists = dataProveedores.some(
        (proveedor) =>
          proveedor.documento === formData.documento &&
          proveedor.id_tercero !== formData.id_tercero
      );

      if (docExists) {
        setAlerta({
          error: true,
          show: true,
          message: "El número de documento ya existe en la base de datos",
        });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }

      const { data } = await conexion_cliente.patch(
        `/compras/proveedores/${formData.id_tercero}`,
        formData,
        config
      );

      if (data?.error) {
        setAlerta({ error: true, show: true, message: data.message });
        setTimeout(() => setAlerta({}), 1500);
        return false;
      }

      const proveedores_actualizados = dataProveedores.map((proveedor) =>
        proveedor.id_tercero === data.id_tercero ? data.proveedor : proveedor
      );
      setDataProveedores(proveedores_actualizados);

      setAlerta({
        error: false,
        show: true,
        message: `El proveedor con documento ${formData.documento} editado con éxito`,
      });
      setTimeout(() => setAlerta({}), 1500);

      return true;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
      return false;
    }
  };

  const obj = useMemo(() => ({
    permisosProveedor,
    setPermisosProveedor,
    dataProveedores,
    setDataProveedores,
    proveedorState,
    setProveedorState,
    proveedorAgg,
    setProveedorAgg,
    guardar_proveedores,
    tipoDocAgg,
    obtener_tipo_documento,
    setTipoDocAgg,
    obtener_tipo_producto,
    tipoProdAgg,
    setTipoProdAgg,
    tipoProdEdit,
    setTipoProdEdit,
    eliminar_restablecer_proveedor,
    buscar_proveedor,
    editar_proveedores,
    tipoProdSeleccionados,
    setTipoProdSeleccionados
  }));

  return (
    <ProveedoresContext.Provider value={obj}>
      {children}
    </ProveedoresContext.Provider>
  );
};

export { ProveedoresProvider };
export default ProveedoresContext;
