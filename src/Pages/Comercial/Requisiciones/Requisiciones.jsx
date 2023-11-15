import { useEffect, useRef, useState } from "react";
import { Button as PButton } from "primereact/button";
import { Req_Icono } from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";
import BLink from "../../../components/Botones/BLink";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";
import useAuth from "../../../hooks/useAuth";
import { IDS_PERMISOS } from "../../../helpers/constantes.js"
import ModalRevisarReq from "../../../components/Modales/Compras/ModalRevisarReq.jsx";
import { Toast } from "primereact/toast";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";

const Requisiciones = () => {
  const toast = useRef(null);
  const { verEliminarRestaurar, authUsuario } = useAuth();
  const { eliminar_requisicion, dataRequisiciones, setRequiAgg, setProductosData, buscar_requisicion } = useRequisiciones();
  const [modalVisible, setModalVisible] = useState(false);


  const revisar_req = async (e, id_requisicion) => {
    e.preventDefault();
    console.log(authUsuario.perfiles)
    if (authUsuario.perfiles?.some((perfil) => perfil.id_perfil == IDS_PERMISOS.PERFIL_GERENTE)) {
      console.log(id_requisicion);
      setModalVisible(true);
      await buscar_requisicion(id_requisicion);
    }
  };

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
  }

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
      <Toast ref={toast} />
      {modalVisible && <ModalRevisarReq visible={modalVisible} onClose={cambiar_visibilidad_modal} />}
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
          <div className="h-full flex justify-center items-center">
            {authUsuario.perfiles?.some((perfil) => perfil.id_perfil !== IDS_PERMISOS.PERFIL_GERENTE) &&
              <div className="h-full flex justify-center items-center">
                <BLink tipo={"PRINCIPAL"} url={"/compras/requisiciones/agregar"}>
                  <i className="pi pi-plus mx-2 font-medium"></i>
                  Agregar
                </BLink>
              </div>
            }
          </div>
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/anuladas"} tipo={"INACTIVOS"}>
              Eliminados
            </BLink>
          </div>
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones/verificadas"} tipo={"VERIFICADA"}>
              Verificadas
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
              <p className="text-center">No hay requisiciones aprobadas</p>
            </div>
          ) : (
            dataRequisiciones.map((requisiciones) => (
              <PButton key={requisiciones} onClick={e => revisar_req(e, requisiciones.id_requisicion)}>
                <CardRequisicion key={requisiciones.id_requisiciones}
                  requisiciones={requisiciones} />
              </PButton>
            ))
          )}
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
};

export default Requisiciones;
