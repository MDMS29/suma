import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button"; 
import {
  Edit_Icono,
  Trash_Icono,
  Menu_Icono,
  Add_Icono,
  Modulo_Icono
} from "../../../components/Icons/Iconos";
import useModulos from "../../../hooks/Configuracion/useModulos";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import BLink from "../../../components/Botones/BLink";
import Button from "../../../components/Botones/Button";
import ModalAgregarModulo from "../../../components/Modales/Configuracion/Modulos/ModalAgregarModulo";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import ModalAsignarMenu from "../../../components/Modales/Configuracion/Modulos/ModalAsignarMenu";

const Modulos = () => {

  const columns = [
    { field: "cod_modulo", header: "Codigo" },
    { field: "nombre_modulo", header: "Nombre" },
    { field: "icono", header: "Icono" },
  ];

  const {
    authPermisos,
    Permisos_DB,
    verEliminarRestaurar,
    setVerEliminarRestaurar,
  } = useAuth();

  const {
    dataModulos,
    ModuloState,
    permisosModulo,
    setPermisosModulo,
    buscar_modulo,
    setModuloState,
    eliminar_restablecer_modulo,
    obtener_menus,
    eliminar_restablecer_menu,
    MenuState,
    setTextoBotonIcon,
  } = useModulos();

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataModulos);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAsignarMenuVisible, setModalAsignarMenuVisible] = useState(false);

  const modal_asignar_menu = (modulo, e) => {
    e.preventDefault();
    setModuloState(modulo);
    obtener_menus(modulo);
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

  const editar_modulo = async (e, id_modulo) => {
    e.preventDefault();
    setModalVisible(true);
    setTextoBotonIcon("Cambiar");
    await buscar_modulo(id_modulo);
  };

  const mostrar_modal_eliminar = (e, modulo) => {
    e.preventDefault();
    setModuloState(modulo);
    setVerEliminarRestaurar(true);
  };

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
    setTextoBotonIcon("Seleccionar");
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
        {permisosModulo.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <PButton
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
              onClick={(e) => editar_modulo(e, rowData.id_modulo)}
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
              onClick={(e) => mostrar_modal_eliminar(e, rowData)}
            >
              {Trash_Icono}
            </PButton>
          )}
        <PButton
          tooltip="Asignar Menú"
          className="p-button-rounded p-mr-2"
          tooltipOptions={{ position: "top" }}
          onClick={(e) => modal_asignar_menu(rowData.id_modulo, e)}
        >
          {Menu_Icono}
        </PButton>
      </div>
    );
  };

  const main = () => (
    <div className="w-5/6">
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
          funcion={(e) =>
            MenuState?.id_menu
              ? eliminar_restablecer_menu(MenuState.id_menu, e)
              : eliminar_restablecer_modulo(ModuloState.id_modulo, e)
          }
        />
      )}

      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Modulos</h1>
        <div className="max-sm:hidden">
          {Modulo_Icono}
        </div>
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        {permisosModulo.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <Button
              tipo={"PRINCIPAL"}
              funcion={(e) => setModalVisible(true, e)}
            >
              {Add_Icono} Agregar{" "}
            </Button>
          )}
        {permisosModulo.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
        ).length > 0 && (
            <div className="h-full flex justify-center items-center">
              <BLink tipo={"INACTIVOS"} url="/configuracion/modulos/inactivos">
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