/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import useModulos from "../../hooks/useModulos";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import useAuth from "../../hooks/useAuth";
import ModalAgregarModulo from "../../components/Modulos/ModalAgregarModulo";
import Loader from "../../components/Loader";
import Forbidden from "../Errors/forbidden";

import { Button as PButton } from "primereact/button";
import { Edit_Icono, Trash_Icono, Menu_Icono } from "../../components/Icons/Iconos";
import BLink from "../../components/Botones/BLink";
import Button from "../../components/Botones/Button";

import EliminarRestaurar from "../../components/Modales/EliminarRestaurar";
import ModalAsignarMenu from "../../components/Modulos/ModalAsignarMenu";

const Modulos = () => {
  const toast = useRef(null);

  const columns = [
    { field: "cod_modulo", header: "Codigo" },
    { field: "nombre_modulo", header: "Nombre" },
    { field: "icono", header: "Icono" },
  ];

  const {
    authPermisos,
    Permisos_DB,
    alerta,
    setAlerta,
    verEliminarRestaurar,
    setVerEliminarRestaurar,
  } = useAuth();

  const {
    dataModulos,
    setDataModulos,
    ModuloState,
    permisosModulo,
    setPermisosModulo,
    buscarModulo,
    guardarModulo,
    setModuloState,
    eliminarRestablecerModulo,
    obtenerMenus,
    eliminarRestablecerMenu,
    MenuState
  } = useModulos();
  const [modalEliminar, setModalEliminar] = useState(false);
  const [botonModulo, setBotonModulo] = useState();
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataModulos);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [modalAsignarMenuVisible, setModalAsignarMenuVisible] = useState(false);

  // const handleAsignarMenuClick = () => {
  //   setModalAsignarMenuVisible(true);
  // };

  const handleAsignarMenuClick = (modulo, e) => {
    e.preventDefault();
    setModuloState(modulo);
    obtenerMenus(modulo);
    setModalAsignarMenuVisible(true);
  };

  useEffect(() => {
    setFilteredData(dataModulos);
  }, [dataModulos]);
  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosModulo(authPermisos);
      }
    }, 10);
  }, [authPermisos]);

  //MOSTRAR ALERTA
  useEffect(() => {
    if (alerta.show) {
      const show_alert = () => {
        toast.current.show({
          severity: alerta.error ? "error" : "success",
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500);
      };
      show_alert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerta]);

  const editarModulo = async (e, id_modulo) => {
    e.preventDefault();
    setModalVisible(true);
    await buscarModulo(id_modulo);
  };

  const modalEliminarModulo = (e, modulo) => {
    e.preventDefault();
    setModuloState(modulo);
    setVerEliminarRestaurar(true);
  };

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredItems = dataModulos.filter((item) => {
      return item.nombre_modulo.toLowerCase().includes(value);
    });
    setFilteredData(filteredItems);
  };

  useEffect(() => {
    setFilteredData(dataModulos);
  }, [dataModulos]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const header = (
    <MultiSelect
      value={visibleColumns}
      options={columns}
      optionLabel="header"
      onChange={onColumnToggle}
      className="w-full sm:w-20rem"
      display="chip"
    />
  );

  const columnAcciones = (rowData) => {
    return (
      <div className="text-center flex gap-x-3">
        {permisosModulo.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <PButton
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
              onClick={(e) => editarModulo(e, rowData.id_modulo)}
            >
              {Edit_Icono}
            </PButton>
          )}
        {permisosModulo.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR
        ).length > 0 && (
            <PButton
              tooltip="Eliminar"
              className="p-button-rounded p-button-danger p-mr-2"
              tooltipOptions={{ position: "top" }}
              onClick={(e) => modalEliminarModulo(e, rowData)}
            >
              {Trash_Icono}
            </PButton>
          )}
           <PButton
              tooltip="Asignar Menú"
              className="p-button-rounded p-mr-2"
              tooltipOptions={{ position: "top" }}
              onClick={(e) => handleAsignarMenuClick(rowData.id_modulo, e)}
            >
              {Menu_Icono}
            </PButton>
      </div>
    );
  };

  const main = () => (
    <>
      <div className="w-5/6">
        <Toast ref={toast} />

        {modalVisible && (
          <ModalAgregarModulo visible={modalVisible} onClose={toggleModal} />
        )}
        {modalAsignarMenuVisible && (
          <ModalAsignarMenu
            visible={modalAsignarMenuVisible}
            onClose={() => setModalAsignarMenuVisible(false)}
          />
        )}
        {verEliminarRestaurar && (
          <EliminarRestaurar
            tipo={"ELIMINAR"}
            funcion={(e) => MenuState?.id_menu ? eliminarRestablecerMenu(MenuState.id_menu, e) : eliminarRestablecerModulo(ModuloState.id_modulo, e)}
          />
        )}

        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Modulos</h1>
          <i className="pi pi-folder" style={{ fontSize: "2rem" }}></i>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          {permisosModulo.filter(
            (permiso) =>
              permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
          ).length > 0 && (
            <Button
                tipo={'PRINCIPAL'}
                funcion={(e) => setModalVisible(true, e)}
              >
                <i className="pi pi-plus mx-2 font-medium"></i>
                Agregar
              </Button>
            )}
          {permisosModulo.filter(
            (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
          ).length > 0 && (
              <div className="h-full flex justify-center items-center">
              <BLink
                  tipo={'INACTIVOS'}
                  url="/configuracion/modulos/inactivos"
                >
                  Inactivos
                </BLink>
              </div>
            )}
          <span className="p-input-icon-left sm:ml-auto md:ml-auto  lg:ml-auto  xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText
              className="h-10 pl-8 rounded-md"
              placeholder="Buscar"
              onChange={(e) => handleSearch(e)}
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
              body={(rowData) => columnAcciones(rowData)}
            />
          </DataTable>
        </div>
      </div>
    </>
  );

  return (
    <>
      {permisosModulo.length === 0 ? (
        <Loader />
      ) : permisosModulo.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
        ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default Modulos;
