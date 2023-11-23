import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Button as PButton } from "primereact/button";
import Forbidden from "../../Errors/forbidden";
import useRoles from "../../../hooks/Configuracion/useRoles";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/Botones/Button";
import BLink from "../../../components/Botones/BLink";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import Loader from "../../../components/Loader";
import ModalPrinRoles from "../../../components/Modales/Configuracion/Roles/ModalPrinRoles";
import {
  Trash_Icono,
  Edit_Icono,
  Add_Icono,
  Rol_Icono,
} from "../../../components/Icons/Iconos";

const Roles = () => {
  const toast = useRef(null);

  const columns = [ 
    { field: "nombre", header: "Nombre" },
    { field: "descripcion", header: "Descripcion" },
  ];

  const {
    dataRoles,
    permisosRoles,
    setPermisosRoles,
    buscar_rol,
    eliminar_rol,
    rolAgg,
    setRolAgg,
  } = useRoles();

  const {
    authPermisos,
    Permisos_DB,
    alerta,
    setAlerta,
    verEliminarRestaurar,
    setVerEliminarRestaurar,
  } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataRoles);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(dataRoles);
  }, [dataRoles]);
  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) return setPermisosRoles(authPermisos);
    }, 10);
  }, [authPermisos]);
 
  useEffect(() => {
    if (alerta.show) {
      (() => {
        toast.current.show({
          severity: alerta.error ? "error" : "success",
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500);
      })();
    }
  }, [alerta]);

  const filtrar_columnas = (event) => {
    let columnas_seleccionadas = event.value;
    let columnas_ordenadas_seleccionadas = columns.filter((col) =>
      columnas_seleccionadas.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(columnas_ordenadas_seleccionadas);
  };

  const buscador = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const items_filtrados = dataRoles.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(value) ||
        item.descripcion.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
  };

  const mostrar_modal_eliminar = (row) => {
    setVerEliminarRestaurar(true);
    setRolAgg(row);
  };

  const header = (
    <MultiSelect
      value={visibleColumns}
      options={columns}
      optionLabel="header"
      onChange={filtrar_columnas}
      className="w-full sm:w-20rem"
      display="chip"
    />
  );

  const columna_acciones = (rowData) => {
    return (
      <div className="text-center flex gap-x-3">
        {permisosRoles.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
          <PButton
            tooltip="Editar"
            tooltipOptions={{ position: "top" }}
            className="p-button-rounded p-mr-2"
            onClick={() => {
              setModalVisible(true);
              buscar_rol(rowData.id_rol);
            }}
          >
            {Edit_Icono}
          </PButton>
        )}
        {permisosRoles.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR
        ).length > 0 && (
          <PButton
            tooltip="Eliminar"
            className="p-button-rounded p-button-danger p-mr-2"
            tooltipOptions={{ position: "top" }}
            onClick={(e) => mostrar_modal_eliminar(rowData)}
          >
            {Trash_Icono}
          </PButton>
        )}
      </div>
    );
  };

  const main = () => (
    <div className="w-5/6">
      <Toast ref={toast} />
      {modalVisible && (
        <ModalPrinRoles
          visible={modalVisible}
          onClose={cambiar_visibilidad_modal}
        />
      )}
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"ELIMINAR"}
          funcion={(e) => eliminar_rol(rolAgg.id_rol, e)}
        />
      )}

      <div className="flex justify-center items-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Roles</h1>
        {Rol_Icono}
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        {permisosRoles.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
          <Button tipo={"PRINCIPAL"} funcion={(e) => setModalVisible(true, e)}>
            {Add_Icono} Agregar{" "}
          </Button>
        )}
        {permisosRoles.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
        ).length > 0 && (
          <div className="h-full flex justify-center items-center">
            <BLink url={"/configuracion/roles/inactivos"} tipo={"INACTIVOS"}>
              Inactivos
            </BLink>
          </div>
        )}
        <span className="p-input-icon-left sm:ml-auto md:ml-auto  lg:ml-auto  xl:ml-auto border rounded-md">
          <i className="pi pi-search" />
          <InputText
            className="h-10 pl-8 rounded-md"
            placeholder="Buscar"
            onChange={(e) => buscador(e)}
            value={searchTerm}
          />
        </span>
      </div>

      <div className="card">
        <DataTable
          className="custom-datatable"
          stripedRows
          value={filteredData}
          paginator={true}
          rows={5}
          header={header}
          emptyMessage="No se han encontrado resultados"
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          tableStyle={{ minWidth: "50rem" }}
        >
          {visibleColumns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}

          <Column
            key="actions"
            style={{ width: "10%" }}
            body={(rowData) => columna_acciones(rowData)}
          />
        </DataTable>
      </div>
    </div>
  );

  return (
    <>
      {permisosRoles.length === 0 ? (
        <Loader />
      ) : permisosRoles.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
        ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default Roles;
