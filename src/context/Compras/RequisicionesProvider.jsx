import { useEffect } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { createContext } from "react";
import { useState } from "react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

const RequisicionesContext = createContext();

const RequisicionesProvider = ({ children }) => {
  const { authUsuario, setAlerta } = useAuth();

  const [dataRequisiciones, setDataRequisiciones] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [RequiState, setRequiState] = useState({});

  const [RequiAgg, setRequiAgg] = useState({
    id_requisicion: 0,
    id_empresa:
      authUsuario && authUsuario.id_empresa ? authUsuario.id_empresa : 0,
    id_proceso: 0,
    id_centro: 0,
    id_tipo_producto: 0,
    consecutivo: "",
    fecha_requisicion: "",
    hora_requisicion: "",
    comentarios: "",
    equipo: 1,
  });

  const [detalleRequi, setdetalleRequi] = useState();
  const [productoState, setProductoState] = useState({});
  const [centroCostoAgg, setcentroCostoAgg] = useState([]);
  const [tipoRequiAgg, setTipoRequiAgg] = useState([]);
  const [SeletipoRequ, setSeletipoRequ] = useState([]);
  const [productos, setproductos] = useState([]);
  const [productosData, setProductosData] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("requisiciones")) {
      const obtener_requisiciones = async () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("anuladas")
          ? 5
          : location.pathname.includes("aprobadas")
          ? 4
          : 3;

        try {
          const { data } = await conexion_cliente(
            `/compras/requisiciones?estado=${estado}&empresa=${authUsuario.id_empresa}`,
            config
          );

          setDataRequisiciones(data);
          // console.log(data);
        } catch (error) {
          setDataRequisiciones([]);
        }
      };

      obtener_requisiciones();
    }
  }, [location.pathname, authUsuario.id_empresa]);

  const obtener_centro_costo = async (id_proceso) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/centro-costo-empresa?estado=1&empresa=${authUsuario.id_empresa}&proceso=${id_proceso}`,
        config
      );
      console.log('centro de costo',data)
      if (data.error == false) {
        setcentroCostoAgg([]);
        return;
      }
      setcentroCostoAgg(data);

    } catch (error) {}
  };

  const filtar_tipo_requ = async (id_tipo_req) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/productos-empresa/filtro?tipo=${id_tipo_req}`,
        config
      );
      if (data.length == 0) {
        setproductos([]);
        return;
      }
      setproductos(data);
    } catch (error) {}
  };

  const obtener_tipo_requisicion = async () => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/opciones-basicas/tipos-producto?empresa=${authUsuario.id_empresa}`,
        config
      );
      setTipoRequiAgg(data);
      if (data.error == false) {
        setTipoRequiAgg([]);
        return;
      }
    } catch (error) {
      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const guardar_requisiciones = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.post(
        "/compras/requisiciones",
        formData,
        config
      );
      if (!data?.error) {
        setDataRequisiciones([...dataRequisiciones, data]);
        setAlerta({
          error: false,
          show: true,
          message: "Requisición creado con exito",
        });
        setTimeout(() => setAlerta({}), 1500);
        return true;
      }
      setAlerta({
        error: true,
        show: true,
        message: data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
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

  const buscar_requisicion = async (id) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente(
        `/compras/requisiciones/${id}`,
        config
      );
      console.log(data);

      if (data?.error) {
        return { error: true, message: data.message };
      }

      const {
        id_requisicion,
        id_proceso,
        proceso,
        id_centro,
        centro_costo,
        id_tipo_producto,
        tipo_productos,
        requisicion,
        fecha_requisicion,
        comentarios,
        det_requisicion,
      } = data;

      setRequiAgg({
        id_empresa: authUsuario.id_empresa,
        id_proceso: id_proceso,
        proceso: proceso,
        id_requisicion: id_requisicion,
        id_centro: id_centro,
        centro: centro_costo,
        fecha_requisicion: fecha_requisicion,
        id_tipo_producto: id_tipo_producto,
        tipo_productos: tipo_productos,
        consecutivo: requisicion,
        comentarios: comentarios,
      });

      setRequiState({
        id_centro: id_centro,
        id_tipo_producto: id_tipo_producto,
        id_proceso: id_proceso,
      });

      setProductosData(det_requisicion);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const editar_requisicion = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/compras/requisiciones/${formData.id_requisiciones}`,
        formData,
        config
      );
      console.log(formData);
      if (!data?.error) {
        const requisiciones_actualizadas = dataRequisiciones.map((req) =>
          req.id_requisiciones === data.id_requisiciones ? data : req
        );
        setDataRequisiciones(requisiciones_actualizadas);

        setAlerta({
          error: false,
          show: true,
          message: "Requisicion editado con exito",
        });
        setRequiAgg({
          id_empresa: authUsuario.id_empresa,
          id_proceso: 0,
          id_centro: 0,
          id_tipo_producto: 0,
          consecutivo: "",
          fecha_requisicion: "",
          hora_requisicion: "",
          comentarios: "",
          equipo: 1,
          det_requisicion: productosData,
        });
        setTimeout(() => setAlerta({}), 1500);
        return true;
      }
      setAlerta({
        error: true,
        show: true,
        message: data.message,
      });
      setTimeout(() => setAlerta({}), 1500);
      return false;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const revisar_requisicion = async (formData) => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await conexion_cliente.patch(
        `/compras/requisiciones/${formData.id_requisiciones}`,
        formData,
        config
      );
      if (!data?.error) {
        setDataRequisiciones([...dataRequisiciones, data]);
        setAlerta({
          error: false,
          show: true,
          message: "Requisición revisada con exito",
        });
        setTimeout(() => setAlerta({}), 1500);
        return true;
      }
      setAlerta({
        error: true,
        show: true,
        message: data.message,
      });
      setTimeout(() => setAlerta({}), 1500);
      return false;
    } catch (error) {
      setAlerta({
        error: true,
        show: true,
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const obj = useMemo(() => ({
    dataRequisiciones,
    procesos,
    RequiAgg,
    setRequiAgg,
    detalleRequi,
    setdetalleRequi,
    obtener_centro_costo,
    centroCostoAgg,
    obtener_tipo_requisicion,
    tipoRequiAgg,
    filtar_tipo_requ,
    setSeletipoRequ,
    SeletipoRequ,
    productos,
    RequiState,
    setRequiState,
    setproductos,
    productoState,
    setProductoState,
    guardar_requisiciones,
    productosData,
    setProductosData,
    editar_requisicion,
    buscar_requisicion,
    revisar_requisicion
  }));
  return (
    <RequisicionesContext.Provider value={obj}>
      {children}
    </RequisicionesContext.Provider>
  );
};

export { RequisicionesProvider };
export default RequisicionesContext;
