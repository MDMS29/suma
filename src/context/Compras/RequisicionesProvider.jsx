import { useEffect, createContext, useState, useMemo } from "react";
import conexion_cliente from "../../config/ConexionCliente";
import useAuth from "../../hooks/useAuth";
import { useLocation } from "react-router-dom"; 
import { TIPOS_ALERTAS } from "../../helpers/constantes.js";

const RequisicionesContext = createContext();

const RequisicionesProvider = ({ children }) => {

  const { authUsuario, setAlerta,  setVerEliminarRestaurar } = useAuth();
  const [dataRequisiciones, setDataRequisiciones] = useState([]);
  const [procesos, setProcesos] = useState([]);
  const [RequiState, setRequiState] = useState({});
  const [permisosReq, setPermisosReq] = useState([]);

  const [RequiAgg, setRequiAgg] = useState({
    id_requisicion: 0,
    id_empresa: authUsuario && authUsuario.id_empresa ? authUsuario.id_empresa : 0,
    id_proceso: 0,
    id_centro: 0,
    id_tipo_producto: 0,
    consecutivo: "",
    fecha_requisicion: "",
    hora_requisicion: "",
    comentarios: "",
    equipo: 1,
  });

  const [filtro, setFiltro] = useState({
    requisicion: "",
    proceso: 0,
    centro_costo: 0,
    tipo_producto: 0,
    fecha_inicial: "",
    fecha_final: "",
  });

  const [detalleRequi, setdetalleRequi] = useState();
  const [productoState, setProductoState] = useState({});
  const [centroCostoAgg, setcentroCostoAgg] = useState([]);
  const [tipoRequiAgg, setTipoRequiAgg] = useState([]);
  const [SeletipoRequ, setSeletipoRequ] = useState([]);
  const [productos, setproductos] = useState([]);
  const [productosData, setProductosData] = useState([]);
  const [verPDF, setVerPDF] = useState(false);
  const [srcPDF, setSrcPDF] = useState(null);
  const [requisicionesFiltradas, setRequisicionesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("requisiciones")) {
      setDataRequisiciones([]);
      setRequisicionesFiltradas([]);
      const obtener_requisiciones = async () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const estado = location.pathname.includes("inactivas")
          ? 2
          : location.pathname.includes("verificadas")
            ? 6
            : 3;
        try {
          if (authUsuario.id_empresa) {
            setCargando(true);
            const { data } = await conexion_cliente(
              `/compras/requisiciones?estado=${estado}&empresa=${authUsuario.id_empresa}`,
              config
            );
            setCargando(false);
            setDataRequisiciones(data);
          }
        } catch (error) {
          setDataRequisiciones([]);
          setCargando(false);
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
      if (data.error == false) {
        setcentroCostoAgg([]);
        return;
      }
      setcentroCostoAgg(data);
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
    }
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
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response?.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
    }
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
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: `Se ha creado la requisicion ${formData.consecutivo}`,
        });
        setTimeout(() => setAlerta({}), 1500);
        return true;
      }

      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: data.message,
      });

      setTimeout(() => setAlerta({ show: false }), 1500);
      return false;
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response?.data.message,
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
        `/compras/requisiciones/detalles/${RequiAgg.id_requisicion}`,
        { detalles: formData },
        config
      );

      if (!data?.error) {
        const requisiciones = dataRequisiciones.filter(
          (requisicion) =>
            requisicion.id_requisicion !== RequiAgg.id_requisicion
        );
        setDataRequisiciones(requisiciones);

        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: `Requisicion ${RequiAgg.consecutivo} verificada con exito`,
        });
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

      if (data?.error) {
        return { error: TIPOS_ALERTAS.ERROR, message: data.message };
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
        id_estado,
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
        id_estado: id_estado,
      });
      setProductosData(det_requisicion);
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response?.data.message,
      });
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
        `/compras/requisiciones/${formData.id_requisicion}`,
        formData,
        config
      );

      if (!data?.error) {
        const requisiciones_actualizadas = dataRequisiciones.map((req) =>
          req.id_requisiciones === data.id_requisicion ? data : req
        );
        setDataRequisiciones(requisiciones_actualizadas);

        setAlerta({
          error: TIPOS_ALERTAS.SUCCESS,
          show: true,
          message: `Requisicion ${data.requisicion} editada con exito`,
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
        message: error.response.data.message,
      });

      setTimeout(() => setAlerta({}), 1500);
    }
  };

  const eliminar_requisicion = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const estado = location.pathname.includes("inactivas") ? 3 : 2;

      const { data } = await conexion_cliente.delete(
        `/compras/requisiciones/${RequiState}?estado=${estado}`,
        config
      );

      if (data.error) {
        setAlerta({
          error: TIPOS_ALERTAS.ERROR,
          show: true,
          message: data.message,
        });
        return;
      }
      const requisiciones = dataRequisiciones.filter(
        (requisicion) => requisicion.id_requisicion !== RequiState
      );
      setDataRequisiciones(requisiciones);
      setAlerta({
        error: TIPOS_ALERTAS.SUCCESS,
        show: true,
        message: data.message,
      });
      setRequiState({});
      setVerEliminarRestaurar(false);
    } catch (error) {
      setAlerta({});
    }
  };

  const generar_pdf = async ({ id_requisicion, requisicion }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      setAlerta({
        error: TIPOS_ALERTAS.INFO,
        show: true,
        message: `Generando documento - ${requisicion}`,
      });

      const { data } = await conexion_cliente(
        `compras/requisiciones/doc/${id_requisicion}`,
        config
      );

      if (!data) {
        setAlerta({
          error: TIPOS_ALERTAS.ERROR,
          show: true,
          message: "Error al generar el documento PDF",
        });
        return;
      }

      setAlerta({
        error: TIPOS_ALERTAS.SUCCESS,
        show: true,
        message: `Requisicion - ${requisicion} - generada`,
      });

      setSrcPDF({ data, requisicion });
      setVerPDF(true);
      return;
    } catch (error) {
      return;
    }
  };

  const filtrar_requisiciones = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const estado = location.pathname.includes("inactivas")
        ? 2
        : location.pathname.includes("verificadas")
          ? 6
          : 3;

      const { data } = await conexion_cliente(
        `/compras/requisiciones?estado=${estado}&empresa=${authUsuario.id_empresa}&requisicion=${e.target.value}`,
        config
      );
      console.log(data);
      if (data.error === false) {
        setAlerta({
          error: TIPOS_ALERTAS.ERROR,
          show: true,
          message: data.message,
        });
        setTimeout(() => setAlerta({}), 1500);
        return;
      }
      setRequisicionesFiltradas(data);
      return;
    } catch (error) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: error.response?.data.message,
      });
    }
  };

  const filtrar_modal_requi = async (formData) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const estado = location.pathname.includes("inactivas")
      ? 2
      : location.pathname.includes("verificadas")
        ? 6
        : 3;
    try {
      if (authUsuario.id_empresa) {
        setCargando(true);
        const { data } = await conexion_cliente.post(
          `/compras/requisiciones/filtrar?estado=${estado}&empresa=${authUsuario.id_empresa}`,
          formData,
          config
        );
        console.log(data);
        setCargando(false);
        setRequisicionesFiltradas(data);
        return data
      }
    } catch (error) {
      setRequisicionesFiltradas([]);
      setCargando(false);
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
    eliminar_requisicion,
    revisar_requisicion,
    generar_pdf,
    srcPDF,
    verPDF,
    setVerPDF,
    filtrar_requisiciones,
    requisicionesFiltradas,
    permisosReq,
    setPermisosReq,
    cargando,
    setCargando,
    filtro,
    setFiltro,
    filtrar_modal_requi,
    setRequisicionesFiltradas,
    setDataRequisiciones,
  }));
  return (
    <RequisicionesContext.Provider value={obj}>
      {children}
    </RequisicionesContext.Provider>
  );
};

export { RequisicionesProvider };
export default RequisicionesContext;
