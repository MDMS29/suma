import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Button from "../../../Botones/Button";
import { Dropdown } from "primereact/dropdown";
import useProcesos from "../../../../hooks/Basicos/useProcesos";
import useRequisiciones from "../../../../hooks/Compras/useRequisiciones";
import useAuth from "../../../../hooks/useAuth";
import { useState, useEffect } from "react";

const ModalFiltrarReq = ({ visible, onClose }) => {
  const {
    RequiAgg, 
    centroCostoAgg,
    obtener_centro_costo,
    tipoRequiAgg,
    obtener_tipo_requisicion,
    filtrar_modal_requi,
    filtro,
    setFiltro,
  } = useRequisiciones();

  const { obtener_procesos, dataProcesos } = useProcesos();
  const { setAlerta } = useAuth();

  const [fechas, setFechas] = useState({
    fecha_inicial: "",
    fecha_final: "",
  });

  useEffect(() => {
    obtener_procesos();
    obtener_tipo_requisicion();

    if (RequiAgg.id_proceso != 0) {
      obtener_centro_costo(RequiAgg.id_proceso);
    }
  }, []);

  const cerrar_modal = () => {
    onClose();

    setFiltro({
      requisicion: "",
      proceso: 0,
      centro_costo: 0,
      tipo_producto: 0,
      fecha_inicial: "",
      fecha_final: ""
    }) 
  };

  const btn_cambio = (e) => {
    setFiltro({ ...filtro, [e.target.name]: e.target.value });
    if (e.target.name === "proceso") {
      //ENVIAR POR PARAMETROS DEL ID DEL PROCESO
      obtener_centro_costo(e.target.value);
    }
    if (filtro.fecha_inicial && fechas.fecha_final > fechas.fecha_final) {
      setAlerta({
        error: true,
        show: true,
        message: "La fecha de inicio no puede ser mayor que la fecha de fin",
      });
      setTimeout(() => setAlerta({}), 2000);
      return;
    }
    if (filtro.fecha_final && filtro.fecha_inicial < fechas.fecha_inicial) {
      setAlerta({
        error: true,
        show: true,
        message: "La fecha de fin no puede ser menor que la fecha de inicio",
      });
      setTimeout(() => setAlerta({}), 2000);
      return;
    }
  };

  const consultar = () => {
    const formData = {
      requisicion: filtro.requisicion,
      proceso: filtro.proceso,
      centro_costo: filtro.centro_costo,
      tipo_producto: filtro.tipo_producto,
      fecha_inicial: filtro.fecha_inicial,
      fecha_final: filtro.fecha_final,
    };
    if (filtro.tipo_producto == 0 && filtro.proceso == 0 && filtro.requisicion == 0) {
      setAlerta({
        error: true,
        show: true,
        message: "Selecciona por lo menos  un criterio",
      });
      setTimeout(() => setAlerta({}), 1500);
      return;
    }

    filtrar_modal_requi(formData);
    // console.log("DATOS DE FILTROS",formData)
    cerrar_modal();
    
  };

  const footerContent = (
    <div className="mt-3">
      <Button tipo={"PRINCIPAL"} funcion={consultar}> Consultar </Button>
    </div>
  );

  return (
    <Dialog
      header={<h1>Filtrar Requisicion</h1>}
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              No. Requisicion <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300">
              <InputText
                value={filtro.requisicion}
                name="requisicion"
                placeholder="No. requisicion"
                className="w-full h-10 px-2 md:w-14rem rounded-md"
                onChange={(e) => btn_cambio(e)}
              />
            </div>
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Tipo de Requisicion{" "}
              <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300">
              <Dropdown
                value={filtro.tipo_producto}
                onChange={(e) => btn_cambio(e)}
                options={tipoRequiAgg}
                name="tipo_producto"
                optionLabel="descripcion"
                optionValue="id_tipo_producto"
                placeholder="Seleccione Tipo de Requisición"
                filter
                className="w-full md:w-14rem rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col flex-wrap col-span-2">
            <label className="text-gray-600 pb-2 font-bold text-lg">
              Rango de fechas
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">
                  Fecha Inicial{" "}
                  <span className="font-bold text-red-900">*</span>
                </label>
                <div className="card flex justify-content-center h-10">
                  <input
                    name="fecha_inicial"
                    type="date"
                    value={filtro.fecha_inicial}
                    onChange={(e) => btn_cambio(e)}
                    className="px-2 w-42 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">
                  Fecha Final <span className="font-bold text-red-900">*</span>
                </label>
                <div className="card flex justify-content-center h-10 ">
                  <input
                    name="fecha_final"
                    type="date"
                    value={filtro.fecha_final}
                    onChange={(e) => btn_cambio(e)}
                    className="px-2 w-42 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Procesos <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300">
              <Dropdown
                value={filtro.proceso}
                onChange={(e) => btn_cambio(e)}
                options={dataProcesos}
                name="proceso"
                optionLabel="proceso"
                optionValue="id_proceso"
                placeholder="Seleccione un Proceso"
                filter
                className="w-full md:w-14rem rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Centro de Costos <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300">
              <Dropdown
                value={filtro.centro_costo}
                onChange={(e) => btn_cambio(e)}
                options={centroCostoAgg}
                name="centro_costo"
                optionLabel="centro_costo"
                optionValue="id_centro"
                placeholder="Seleccione un centro de Costos"
                filter
                className="w-full md:w-14rem rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalFiltrarReq;
