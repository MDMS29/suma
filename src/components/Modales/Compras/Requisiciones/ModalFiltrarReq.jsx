import { Dialog } from "primereact/dialog"
import Button from "../../../Botones/Button";
import { Dropdown } from "primereact/dropdown";
import useProcesos from "../../../../hooks/Basicos/useProcesos";
import useRequisiciones from "../../../../hooks/Compras/useRequisiciones";

const ModalFiltrarReq = ({ visible, onClose }) => {

  const {
    RequiAgg,
    setRequiAgg,
    centroCostoAgg,
    obtener_centro_costo,
    filtar_tipo_requ,
    tipoRequiAgg,
  } = useRequisiciones();
  const { dataProcesos } = useProcesos();

  const btn_cambio = (e) => {
    // const value = e.target.value;
    const name = e.target.name;

    setRequiAgg({ ...RequiAgg, [e.target.name]: e.target.value });
    if (name === "id_proceso") {
      //ENVIAR POR PARAMETROS DEL ID DEL PROCESO
      obtener_centro_costo(e.target.value);
    }
    if (name === "id_centro") {
      const centro = centroCostoAgg.filter(
        (centro) => centro.id_centro == e.target.value
      )[0]?.consecutivo_centro;

      RequiAgg.consecutivo = centro;
    }
    if (name === "id_tipo_producto") {
      //ENVIAR EL ID DEL TIPO DE PRODUCTO POR PARAMETRO
      filtar_tipo_requ(e.target.value);
    }
  };


  const footerContent = (
    <div className="mt-3">
      <Button
        tipo={'PRINCIPAL'}
      // funcion={consultar}
      > Consultar
      </Button>
    </div>
  );
  return (
    <Dialog
      header={<h1>Filtrar Requisicion</h1>}
      visible={visible}
      onHide={onClose}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              N. Requisicion <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300" >
              <Dropdown
                // value={productosAgg.id_marca} onChange={(e) => btn_cambio_producto(e)} options={dataMarcas}
                name="id_marca"
                optionLabel="marca"
                optionValue="id_marca"
                placeholder="Seleccione"
                filter className="w-full md:w-14rem rounded-md"
              />
            </div>
            {/* {errors.marca && (
              <div className="text-red-600 text-xs">
                {errors.marca}
              </div>
            )} */}
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Tipo de Requisicion <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300" >
              <Dropdown
                value={RequiAgg.id_tipo_producto}
                onChange={(e) => btn_cambio(e)}
                options={tipoRequiAgg}
                name="id_tipo_producto"
                optionLabel="descripcion"
                optionValue="id_tipo_producto"
                placeholder="Seleccione Tipo de Requisición"
                filter className="w-full md:w-14rem rounded-md"
              />
            </div>
            {/* {errors.marca && (
              <div className="text-red-600 text-xs">
                {errors.marca}
              </div>
            )} */}
          </div>
          <div className="flex flex-col flex-wrap col-span-2">
            <label className="text-gray-600 pb-2 font-bold text-lg">
              Rango de fechas</label>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-600 pb-2 font-semibold">
                  Fecha Inicial <span className="font-bold text-red-900">*</span>
                </label>
                <div className="card flex justify-content-center h-10">
                  <input
                    // value={RequiAgg.fecha_requisicion}
                    // onChange={(e) => btn_cambio(e)}
                    name="fecha_requisicion"
                    type="date"
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
                    // value={RequiAgg.fecha_requisicion}
                    // onChange={(e) => btn_cambio(e)}
                    name="fecha_requisicion"
                    type="date"
                    className="px-2 w-42 text-gray-500"
                  />
                </div>
              </div>

            </div>

            {/* {errors.marca && (
              <div className="text-red-600 text-xs">
                {errors.marca}
              </div>
            )} */}
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Procesos <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300" >
              <Dropdown
                value={RequiAgg.id_proceso}
                onChange={(e) => btn_cambio(e)}
                options={dataProcesos}
                name="id_proceso"
                optionLabel="proceso"
                optionValue="id_proceso"
                placeholder="Seleccione un Proceso"
                filter className="w-full md:w-14rem rounded-md"
              />
            </div>
          </div>
          <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Centro de Costos{" "}
              <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center border-1 rounded-md border-gray-300" >
              <Dropdown
                value={RequiAgg.id_centro}
                onChange={(e) => btn_cambio(e)}
                options={centroCostoAgg}
                name="id_centro"
                optionLabel="centro_costo"
                optionValue="id_centro"
                placeholder="Seleccione un centro de Costos"
                filter className="w-full md:w-14rem rounded-md"
              />
            </div>
          </div>

        </div>
      </div>

    </Dialog>
  )
}

export default ModalFiltrarReq