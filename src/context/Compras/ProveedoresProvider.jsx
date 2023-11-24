import { createContext, useEffect, useMemo, useState } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";

const ProveedoresContext = createContext();

const ProveedoresProvider = ({ children }) => {
  const { setAlerta, authUsuario } = useAuth();
  const [permisosProveedor, setPermisosProveedor] = useState([]);
  const [dataProveedores, setDataProveedores] = useState([]);
  const [proveedorState, setProveedorState] = useState({});
  const [tipoDocAgg, setTipoDocAgg] = useState([]);
  const [tipoProdAgg, setTipoProdAgg] = useState([]);
  const [tipoProdEdit, setTipoProdEdit] = useState([])



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
      console.log(data);

      if (!data?.error) {
        setDataProveedores([...dataProveedores, data]);
        setAlerta({
          error: false,
          show: true,
          message: `Se ha creado el proveedor`,
        });
        setTimeout(() => setAlerta({}), 1500);
        return true;
      }

      setAlerta({
        error: true,
        show: true,
        message: data.message,
      });

      setTimeout(() => setAlerta({ show: false }), 1500);
      return false;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
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
      const { data } = await conexion_cliente(`/opciones-basicas/tipos-producto?estado=1&empresa=${authUsuario.id_empresa}`, config);
      setTipoProdAgg(data);
    } catch (error) {
      console.error("Error al obtener los tipos de productos:", error);
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
    setTipoProdEdit
  }));

  return (
    <ProveedoresContext.Provider value={obj}>
      {children}
    </ProveedoresContext.Provider>
  );
};

export { ProveedoresProvider };
export default ProveedoresContext;
