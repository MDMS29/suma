import { useEffect, useRef, useState } from "react";
// import { Button as PButton } from "primereact/button";
import { Req_Icono } from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";
import BLink from "../../../components/Botones/BLink";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import CardRequisicion from "../../../components/Cards/CardRequisicion";
import useAuth from "../../../hooks/useAuth";
import ModalRevisarReq from "../../../components/Modales/Compras/ModalRevisarReq.jsx";
import { Toast } from "primereact/toast";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden.jsx";

const Requisiciones = () => {
  const toast = useRef(null);
  const { verEliminarRestaurar, authUsuario, alerta, setAlerta, Permisos_DB, authPermisos } = useAuth();
  const { eliminar_requisicion, dataRequisiciones, setRequiAgg, setProductosData, requisicionesFiltradas, filtrar_requisiciones, permisosReq, setPermisosReq } = useRequisiciones();
  const [modalVisible, setModalVisible] = useState(false);

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
  }


  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosReq(authPermisos);
      }
    }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authPermisos]);


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



  //MOSTRAR ALERTA
  useEffect(() => {
    if (alerta.show) {
      const show_alert = () => {
        toast.current.show({
          severity: alerta.error ? 'error' : 'success',
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500);
      };
      show_alert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerta]);

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
          <h1 className="text-3xl">Requisiciones Pendientes</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border p-3 rounded-sm w-full flex flex-wrap gap-3">
          {permisosReq.filter(
            (permiso) =>
              permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
          ).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <div className="h-full flex justify-center items-center">
                  <BLink tipo={"PRINCIPAL"} url={"/compras/requisiciones/agregar"}>
                    <i className="pi pi-plus mx-2 font-medium"></i>
                    Agregar
                  </BLink>
                </div>
              </div>
            )}

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
            <InputText
              className="h-10 pl-8 rounded-md"
              onChange={(e) => filtrar_requisiciones(e)}
              placeholder="Buscar No. Requisicion"
            />
          </span>
        </div>

        <div className="w-full py-3 flex flex-wrap gap-3">
          {dataRequisiciones.length == 0 ? (<div className="bg-white border w-full my-3 p-3">
            <p className="text-center">No hay requisiciones pendientes</p>
          </div>
          ) : dataRequisiciones.error === false ? (
              <Loader/>
          ): (
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
                setModalVisible={setModalVisible}
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
return <>{
  permisosReq.length === 0 ?
    (<Loader />) :
    (permisosReq.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0
      ?
      (main())
      :
      (<Forbidden />))
}</>;
};

export default Requisiciones;
