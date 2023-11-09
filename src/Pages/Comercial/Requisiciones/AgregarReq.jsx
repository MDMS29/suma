import React, { useState } from "react";
import { Req_Icono } from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";
import BLink from "../../../components/Botones/BLink";
import { Dropdown } from "primereact/dropdown";
import Button from "../../../components/Botones/Button";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Mention } from "primereact/mention";

const AgregarReq = () => {
  const [date, setDate] = useState(null);

  const columns = [
    { field: "id_rol", header: "Item" },
    { field: "nombre", header: "codigo" },
    { field: "descripcion", header: "Nombre" },
    { field: "id_estado", header: "Cantidad" },
    { field: "id_estado", header: "Unidad de Medida" },
    { field: "justificacion", header: "Justificación" },
  ];

  const header = (
    <MultiSelect
      options={columns}
      optionLabel="header"
      className="w-full sm:w-20rem"
      display="chip"
    />
  );

  const main = () => (
    <>
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Agregar Requisiciones</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/anuladas"} tipo={"INACTIVOS"}>
              Anulados
            </BLink>
          </div>
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/aprobadas"} tipo={"APROBADO"}>
              Aprobados
            </BLink>
          </div>
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones"} tipo={"PENDIENTE"}>
              Pendientes
            </BLink>
          </div>
          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" />
          </span>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full">
          <div className="gap-x-4 m-2 p-3 flex flex-wrap gap-3">
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Procesos <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <Dropdown
                  placeholder="Seleccione un Proceso"
                  filter
                  className="w-full md:w-14rem"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Centro de Costos{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <Dropdown
                  placeholder="Seleccione un centro de Costos"
                  filter
                  className="w-full md:w-14rem"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Centro de Costos{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full h-10">
                <Calendar
                  value={date}
                  onChange={(e) => setDate(e.value)}
                  showIcon
                  className="px-2 text-gray-500"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                No. Requisición{" "}
              </label>
              <div className="card flex justify-content-center w-full h-10 bg-gray-100">
                <InputText className="bg-gray-100" disabled />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="gap-x-4 m-2 p-3 gap-3">
              <label className="text-gray-600 pb-2 font-semibold">
                Tipo de Requisiciones{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <Dropdown
                  placeholder="Seleccione Tipo de Requisición"
                  filter
                  className="md:w-14rem"
                />
              </div>
            </div>
            <div className="mt-14">
              <Button tipo={"PRINCIPAL"}>Seleccionar</Button>
            </div>
          </div>
          <div className="p-2 m-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Observaciones{" "}
              <span className="font-bold text-red-900">*</span>
            </label>
            <Mention className="w-full card border-gray-300" id="observaciones" />
          </div>
          <div className="p-2 m-2">
            <Button tipo={"PRINCIPAL"}>Guardar</Button>
          </div>
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
};

export default AgregarReq;
