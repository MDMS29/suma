import { InputText } from "primereact/inputtext";
import useAuth from "../../../../hooks/useAuth";
import { Dialog } from "primereact/dialog";
import Button from "../../../Botones/Button";
import useTipoOrden from "../../../../hooks/Basicos/useTipoOrden";
import { useEffect, useState } from "react";
import { TIPOS_ALERTAS } from "../../../../helpers/constantes.js";

const ModalAgregarTipoOrden = ({ visible, onClose }) => {
  const {
    setErrors,
    tipoOrdenAgg,
    setTipoOrdenAgg,
    tiposProd,
    tipoProdEdit,
    obtener_tipos_productos,
    guardar_tipo_orden,
    editar_tipo_orden,
  } = useTipoOrden();

  const { authUsuario, setAlerta } = useAuth();

  const [tipoProdporOrden, setTipoProdporOrden] = useState([]);

  useEffect(() => {
    obtener_tipos_productos();
    if (tipoOrdenAgg.id_tipo_orden) {
      setTipoProdporOrden(tipoProdEdit);
    }
  }, [tipoProdEdit]);

  const cambiar_tipos_produ = (e) => {
    setTipoOrdenAgg((prevProduAgg) => ({
      ...prevProduAgg,
      [e.target.name]:
        e.target.name == "tipo_orden"
          ? e.target.value.replace(/\d/g, "")
          : e.target.value,
    }));
  };

  const btn_guardar = async () => {

    if (tipoProdporOrden.length === 0 || tipoProdporOrden.filter(tipoProd => tipoProd?.id_estado === 1).length === 0) {
      setAlerta({
        error: TIPOS_ALERTAS.ERROR,
        show: true,
        message: "Debes seleccionar por lo menos un tipo de producto",
      });
      return
    }
    try {
      const formData = {
        id_empresa: authUsuario.id_empresa,
        id_tipo_orden: tipoOrdenAgg.id_tipo_orden,
        tipo_orden: tipoOrdenAgg.tipo_orden,
        consecutivo: +tipoOrdenAgg.consecutivo,
        tipos_productos: tipoProdporOrden,
      };

      let response;
      if (tipoOrdenAgg.id_tipo_orden !== 0) {
        response = await editar_tipo_orden(formData);
      } else {
        response = await guardar_tipo_orden(formData);
      }

      if (response) {
        onClose();
        setTipoOrdenAgg({
          id_tipo_orden: 0,
          tipo_orden: "",
          consecutivo: 0,
        });

        setErrors({});
        setTipoProdporOrden([]);
      }
    } catch (error) {
      console.error("Error al guardar tipo de orden:", error);
    }
  };

  const footerContent = (
    <div>
      <Button tipo={"PRINCIPAL"} funcion={btn_guardar}>
        {tipoOrdenAgg.id_tipo_orden !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );

  const cerrar_modal = () => {
    onClose();

    setTipoOrdenAgg({
      tipo_orden: "",
      consecutivo: 0,
      id_tipo_orden: 0,
    });

    setTipoProdporOrden([]);
    setErrors({});
  };

  const ChklTiposProductos = (idTipoProducto) => {
    if (
      tipoProdporOrden.find(
        (permiso) => permiso.id_tipo_producto == idTipoProducto
      )
    ) {
      if (
        tipoProdEdit.find(
          (permiso) => permiso.id_tipo_producto == idTipoProducto
        )
      ) {
        const [permiso] = tipoProdporOrden.filter(
          (permiso) => permiso.id_tipo_producto == idTipoProducto
        );
        if (permiso.id_estado == 1) {
          permiso.id_estado = 2;
        } else {
          permiso.id_estado = 1;
        }
        const permisosActuliazados = tipoProdporOrden.map((permisoState) =>
          permisoState.id_tipo_producto == permiso.id_tipo_producto
            ? permiso
            : permisoState
        );
        setTipoProdporOrden(permisosActuliazados);
      } else {
        const permisos = tipoProdporOrden.filter(
          (permiso) => permiso.id_tipo_producto !== idTipoProducto
        );
        setTipoProdporOrden(permisos);
      }
    } else {
      setTipoProdporOrden([
        ...tipoProdporOrden,
        { id_tipo_producto: idTipoProducto, id_estado: 1 },
      ]);
    }
  };

  const fncChkPermiso = (row) => {
    const permiso = tipoProdporOrden.filter(
      (permiso) => permiso.id_tipo_producto === row.id_tipo_producto
    );
    if (permiso) {
      return permiso[0]?.id_estado === 1;
    } else {
      return false;
    }
  };

  return (
    <Dialog
      header={
        tipoOrdenAgg.id_tipo_orden !== 0 ? (
          <h1>Editar Tipo de Orden</h1>
        ) : (
          <h1>Agregar Tipo de Orden</h1>
        )
      }
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 gap-3 flex-wrap w-full">
        <div className="flex gap-3 flex-wrap ">
          <div className="flex flex-grow flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Tipo de Orden <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              type="text"
              name="tipo_orden"
              value={tipoOrdenAgg.tipo_orden}
              onChange={(e) => cambiar_tipos_produ(e)}
              className="border-1 h-10 rounded-md px-3 py-2 border-gray-300"
            />
          </div>
          <div className="flex flex-grow flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              # Consecutivo <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              type="number"
              name="consecutivo"
              value={tipoOrdenAgg.consecutivo}
              onChange={(e) => cambiar_tipos_produ(e)}
              className="border-1 h-10 rounded-md w-full px-3 border-gray-300"
            />
          </div>
        </div>
        <div className="border-gray-300 border-1 rounded-md pl-2 pt-3">
          <h1>Tipos de Productos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 overflow-auto h-48 mt-2">
            {tiposProd.map((prod) => (
              <div key={prod.id_tipo_producto}>
                <label
                  className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${fncChkPermiso(prod) ? "bg-primaryYellow" : "bg-gray-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={fncChkPermiso(prod)}
                    className="sr-only peer"
                    onChange={() => ChklTiposProductos(prod.id_tipo_producto)}
                  />
                  <span
                    className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}
                  ></span>
                </label>
                <span className="ml-6">{prod.descripcion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAgregarTipoOrden;
