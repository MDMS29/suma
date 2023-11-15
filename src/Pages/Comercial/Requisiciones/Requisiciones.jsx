import React, { useEffect } from "react";
import { Req_Icono } from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";
import BLink from "../../../components/Botones/BLink";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";
import useAuth from "../../../hooks/useAuth";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import Loader from "../../../components/Loader";

const Requisiciones = () => {
  const {
    dataRequisiciones,
    setRequiAgg,
    setProductosData,
    eliminar_requisicion,
  } = useRequisiciones();

  const { verEliminarRestaurar, authUsuario } = useAuth();

  useEffect(() => {
    setRequiAgg({
      id_requisicion: 0,
      id_empresa:
        authUsuario && authUsuario.id_empresa ? authUsuario.id_empresa : 0,
      id_proceso: 0,
      id_centro: 0,
      id_tipo_producto: 0,
      consecutivo: "",
      fecha_requisicion: "",
      hora_requisicion: "",
      comentarios: "",
      equipo: 1,
    });
    setProductosData([]);
    return;
  }, []);

  const main = () => (
    <>
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"ELIMINAR"}
          funcion={(e) => eliminar_requisicion(e)}
        />
      )}
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
            <BLink url={"/compras/requisiciones/inactivas"} tipo={"INACTIVOS"}>
            Inactivas
            </BLink>
          </div>
          <div className="h-full flex justify-center items-center">
            <BLink
              url={"/compras/requisiciones/verificadas"}
              tipo={"VERIFICADA"}
            >
              Verificadas
            </BLink>
          </div>

          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" />
          </span>
        </div>

        <div className="w-full flex flex-wrap gap-3">
          {dataRequisiciones.length == 0 ? (
            <div className="flex justify-center items-center w-full">
              <Loader />
            </div>
          ) : dataRequisiciones.error === false ? (
            <div className="bg-white border w-full my-3 p-3">
              <p className="text-center">No hay requisiciones aprobadas</p>
            </div>
          ) : (
            dataRequisiciones.map((requisiciones) => (
              <CardRequisicion
                key={requisiciones.id_requisiciones}
                requisiciones={requisiciones}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
};

export default Requisiciones;
