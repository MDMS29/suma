import React from "react";
import Button from "../../../components/Botones/Button";
import BLink from "../../../components/Botones/BLink";
import { InputText } from "primereact/inputtext";
import {
  Edit_Icono,
  Req_Icono,
  Return_Icono,
  Trash_Icono,
} from "../../../components/Icons/Iconos";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";

function ReqRevisadas() {
  const { dataRequisiciones } = useRequisiciones();

  const main = () => (
    <>
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Requisiciones Revisadas</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/anuladas"} tipo={"INACTIVOS"}>
              Eliminados
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

        <div className="rounded-sm w-full flex flex-wrap gap-3">
          {dataRequisiciones.error === false ? (
            <div className="bg-white border w-full my-3 p-3">
            <p>No hay requisiciones revisadas</p>
          </div>
          ) : (
            dataRequisiciones.map((requisiciones) => (
              <CardRequisicion requisiciones={requisiciones} />
            ))
          )}
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
}

export default ReqRevisadas;
