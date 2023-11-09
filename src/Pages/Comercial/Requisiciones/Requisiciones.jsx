import React from "react";
import { Req_Icono } from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";
import BLink from "../../../components/Botones/BLink";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones"
import CardRequisicion from "../../../components/Cards/CardRequisicion";

const Requisiciones = () => {
  const {
    dataRequisiciones
  } = useRequisiciones();

  const main = () => (
    <>
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Requisiciones</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          <BLink tipo={"PRINCIPAL"} url={"/compras/requisiciones/agregar"}>
            <i className="pi pi-plus mx-2 font-medium"></i>
            Agregar
          </BLink>
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

          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" />
          </span>
        </div>

        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        {dataRequisiciones.error === false ? (
            <p>No hay requisiciones pendientes</p>
          ) : (
            dataRequisiciones.map((requisiciones) => (
              <CardRequisicion requisiciones={requisiciones}/>
            ))
          )}
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
};

export default Requisiciones;
