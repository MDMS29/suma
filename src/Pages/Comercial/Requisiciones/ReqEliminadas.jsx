import { Add_Icono, Cancelar_Filtro_Icon, Filter_Icono, Req_Icono } from "../../../components/Icons/Iconos";
import BLink from "../../../components/Botones/BLink";
import { InputText } from "primereact/inputtext";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import { useState } from "react";
import ModalFiltrarReq from "../../../components/Modales/Compras/Requisiciones/ModalFiltrarReq";
import Button from "../../../components/Botones/Button";

function ReqEliminadas() {
  const { dataRequisiciones, eliminar_requisicion, requisicionesFiltradas, filtrar_requisiciones, cargando, permisosReq, setRequisicionesFiltradas } = useRequisiciones();

  const { verEliminarRestaurar, Permisos_DB } = useAuth();

  const [modalFiltrar, setmodalFiltrar] = useState(false);

  const cambiar_visibilidad_modal_filtrar = () => {
    setmodalFiltrar(!modalFiltrar);
  };

  const cancelar_filtro = () => {
    setRequisicionesFiltradas([]);
    document.querySelector("#lupa").value = ""
  };

  const main = () => (
    <>
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"RESTAURAR"}
          funcion={(e) => eliminar_requisicion(e)}
        />
      )}
      {modalFiltrar && (
        <ModalFiltrarReq
          visible={modalFiltrar}
          onClose={cambiar_visibilidad_modal_filtrar}
        />
      )}
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Requisiciones Inactivas</h1>
          <div className="max-sm:hidden">
            {Req_Icono}
          </div>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          {permisosReq.filter(
            (permiso) =>
              permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
          ).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <div className="h-full flex justify-center items-center">
                  <BLink
                    tipo={"PRINCIPAL"}
                    url={"/compras/requisiciones/agregar"}
                  >
                    {Add_Icono} Agregar
                  </BLink>
                </div>
              </div>
            )}

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
              id="lupa"
              className="h-10 pl-8 rounded-md"
              onChange={(e) => filtrar_requisiciones(e)}
              placeholder="Buscar No. Requisicion"
            />
          </span>

          <div className="h-full flex justify-center items-center">
            <Button tipo={"FILTRAR"} funcion={(e) => setmodalFiltrar(true, e)}
            >{Filter_Icono} Filtrar </Button>
            {requisicionesFiltradas.length > 0 && (
              <Button funcion={cancelar_filtro} tipo={"CANCELAR_FILTRO"}>
                {Cancelar_Filtro_Icon}
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-sm w-full justify-center flex flex-wrap gap-3">
          {cargando ? (
            <div className="flex justify-center items-center w-full">
              <Loader />
            </div>
          ) : dataRequisiciones.error === false ||
            dataRequisiciones.length == 0 ? (
            <div className="bg-white border w-full my-3 p-3">
              <p className="text-center">No hay requisiciones inactivas.</p>
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

export default ReqEliminadas;
