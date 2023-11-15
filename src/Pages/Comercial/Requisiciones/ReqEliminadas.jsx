import React, { useState } from "react";
import { Req_Icono, Return_Icono } from "../../../components/Icons/Iconos";
import Button from "../../../components/Botones/Button";
import BLink from "../../../components/Botones/BLink";
import { InputText } from "primereact/inputtext";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";

function ReqEliminadas() {
  const { dataRequisiciones, eliminar_requisicion } = useRequisiciones();
  const [requisicionesFiltradas, setRequisicionesFiltradas] = useState([]);

  const { verEliminarRestaurar } = useAuth();

  const filtrar_requisiciones = (e) => {
    e.preventDefault();
    const requisiciones = dataRequisiciones.filter((requisicion) =>
      requisicion.requisicion?.includes(e.target.value)
    );
    setRequisicionesFiltradas(requisiciones);
  };
  const main = () => (
    <>
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"RESTAURAR"}
          funcion={(e) => eliminar_requisicion(e)}
        />
      )}
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Requisiciones Inactivas</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/verificadas"} tipo={"APROBADO"}>
              Verficadas
            </BLink>
          </div>
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones"} tipo={"PENDIENTE"}>
              Pendientes
            </BLink>
          </div>
          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText
              className="h-10 pl-8 rounded-md"
              onChange={(e) => filtrar_requisiciones(e)}
              placeholder="Buscar"
            />
          </span>
        </div>

        <div className="rounded-sm w-full flex flex-wrap gap-3">
          {dataRequisiciones.length == 0 ? (
            <div className="flex justify-center items-center w-full">
              <Loader />
            </div>
          ) : dataRequisiciones.error === false ? (
            <div className="bg-white border w-full my-3 p-3">
              <p className="text-center">No hay requisiciones eliminadas.</p>
            </div>
          ) : (
            <>
              {requisicionesFiltradas.length > 0 ? (
                <>
                  {requisicionesFiltradas.map((requisiciones) => (
                    <CardRequisicion
                      key={requisiciones.id_requisiciones}
                      requisiciones={requisiciones}
                    />
                  ))}
                </>
              ) : (
                <>
                  {dataRequisiciones.map((requisiciones) => (
                    <CardRequisicion
                      key={requisiciones.id_requisiciones}
                      requisiciones={requisiciones}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
}

export default ReqEliminadas;
