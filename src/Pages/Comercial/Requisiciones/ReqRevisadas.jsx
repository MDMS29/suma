import BLink from "../../../components/Botones/BLink";
import { InputText } from "primereact/inputtext";
import {
  Add_Icono,
  Filter_Icono,
  Req_Icono
} from "../../../components/Icons/Iconos";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";
import ModalPDF from "../../../components/Modales/Compras/Requisiciones/ModalPDF";
import Loader from "../../../components/Loader";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/Botones/Button";
import { useState } from "react";
import ModalFiltrarReq from "../../../components/Modales/Compras/Requisiciones/ModalFiltrarReq";

function ReqRevisadas() {
  const { dataRequisiciones, verPDF, setVerPDF, requisicionesFiltradas, filtrar_requisiciones, permisosReq, cargando } = useRequisiciones();
  const { Permisos_DB } = useAuth();

  const [modalFiltrar, setmodalFiltrar] = useState(false);

  const cambiar_visibilidad_modal_filtrar = () => {
    setmodalFiltrar(!modalFiltrar);
  }

  const cerrar = () => {
    setVerPDF(false);
  };

  const main = () => (
    <>
      {verPDF && <ModalPDF visible={verPDF} onClose={cerrar} />}
      {modalFiltrar && <ModalFiltrarReq visible={modalFiltrar} onClose={cambiar_visibilidad_modal_filtrar} />}

      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Requisiciones Verificadas</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          {permisosReq.filter(
            (permiso) =>
              permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
          ).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <div className="h-full flex justify-center items-center">
                  <BLink tipo={"PRINCIPAL"} url={"/compras/requisiciones/agregar"}>
                    {Add_Icono} Agregar</BLink>
                </div>
              </div>
            )}

          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/inactivas"} tipo={"INACTIVOS"}>
              Inactivas
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
              placeholder="Buscar No. Requisicion"
            />
          </span>

          <div className="h-full flex justify-center items-center">
            <Button
              tipo={"FILTRAR"}
              funcion={(e) => setmodalFiltrar(true, e)}
            >{Filter_Icono} Filtrar </Button>
          </div>
        </div>

        <div className="w-full py-3 flex flex-wrap gap-3">
          {cargando ? (
            <div className="flex justify-center items-center w-full">
              <Loader />
            </div>
          ) : dataRequisiciones.error === false || dataRequisiciones.length == 0 ? (
            <div className="bg-white border w-full my-3 p-3">
              <p className="text-2xl text-center">No hay requisiciones verificadas.</p>
            </div>
          ) : (
            <>
              {requisicionesFiltradas.length > 0 ? (
                <>
                  {requisicionesFiltradas.map((requisiciones) => (
                    <CardRequisicion
                      key={requisiciones.id_requisicion}
                      requisiciones={requisiciones}
                    />
                  ))}
                </>
              ) : (
                <>
                  {dataRequisiciones.map((requisiciones) => (
                    <CardRequisicion
                      key={requisiciones.id_requisicion}
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

export default ReqRevisadas;
