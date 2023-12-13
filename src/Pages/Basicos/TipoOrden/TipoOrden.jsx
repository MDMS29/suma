import { DataTable } from "primereact/datatable";
import useTipoOrden from "../../../hooks/Basicos/useTipoOrden";
import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import {
  Add_Icono,
  Edit_Icono,
  Tipo_Orden,
} from "../../../components/Icons/Iconos";
import Button from "../../../components/Botones/Button";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import Loader from "../../../components/Loader";
import { Button as PButton } from "primereact/button";
import Forbidden from "../../Errors/Forbidden";
import useAuth from "../../../hooks/useAuth";
import ModalAgregarTipoOrden from "../../../components/Modales/Basicos/Tipos Ordenes/ModalAgregarTipoOrden";

const TipoOrden = () => {
  const {
    dataTipoOrden,
    setPermisosTipoOrden,
    permisosTipoOrden,
    buscar_tipo_orden,
  } = useTipoOrden();
  const { authPermisos, Permisos_DB } = useAuth();

  const columns = [
    { field: "id_tipo_orden", header: "ID" },
    { field: "tipo_orden", header: "Tipo de Orden" },
    { field: "consecutivo", header: "Consecutivo" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataTipoOrden);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const filtrar_columnas = (event) => {
    let columnas_seleccionadas = event.value;
    let columnas_ordenadas_seleccionadas = columns.filter((col) =>
      columnas_seleccionadas.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(columnas_ordenadas_seleccionadas);
  };

  const editar_tipo_orden = async (e, id_tipo_orden) => {
    e.preventDefault();
    setModalVisible(true);
    await buscar_tipo_orden(id_tipo_orden);
  };

  const buscador = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const items_filtrados = dataTipoOrden.filter((item) => {
      return (
        String(item.id_tipo_orden).toLowerCase().includes(value) ||
        item.tipo_orden.toLowerCase().includes(value) ||
        item.consecutivo.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };


  useEffect(() => {
    setFilteredData(dataTipoOrden);
  }, [dataTipoOrden]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosTipoOrden(authPermisos);
      }
    }, 10);
  }, [authPermisos]);

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
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
        {permisosTipoOrden.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <PButton
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
              onClick={(e) => editar_tipo_orden(e, rowData.id_tipo_orden)}
            >
              {Edit_Icono}
            </PButton>
          )}
      </div>
    );
  };

  const main = () => (
    <div className="w-5/6">
      {modalVisible && (
        <ModalAgregarTipoOrden
          visible={modalVisible}
          onClose={cambiar_visibilidad_modal}
        />
      )}
      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Tipos de Ordenes</h1>
        {Tipo_Orden}
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        {permisosTipoOrden.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <Button tipo={"PRINCIPAL"} funcion={(e) => setModalVisible(true, e)}>
              {Add_Icono} Agregar
            </Button>
          )}
        <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
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
      {permisosTipoOrden?.length === 0 ? (
        <Loader />
      ) : permisosTipoOrden.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default TipoOrden;
