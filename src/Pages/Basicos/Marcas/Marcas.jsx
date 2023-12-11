import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import {
  Add_Icono,
  Edit_Icono,
  Marca_Icono,
} from "../../../components/Icons/Iconos";
import { Button as PButton } from "primereact/button";
import useMarcas from "../../../hooks/Basicos/useMarcas";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import Button from "../../../components/Botones/Button";
import useAuth from "../../../hooks/useAuth";
import ModalAgregarMarcas from "../../../components/Modales/Basicos/Marcas/ModalAgregarMarcas";

const Marcas = () => { 

  const columns = [
    { field: "id_marca", header: "ID" },
    { field: "marca", header: "Marca" },
  ];
  const { dataMarcas, permisosMarcas, setPermisosMarcas, buscar_marca } =
    useMarcas();
  const { authPermisos, Permisos_DB } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dataMarcas);

  const editar_marca = async (e, id_marca) => {
    e.preventDefault();
    setModalVisible(true);
    await buscar_marca(id_marca);
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

    const items_filtrados = dataMarcas.filter((item) => {
      return item.marca.toLowerCase().includes(value);
    });
    setFilteredData(items_filtrados);
  };

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    setFilteredData(dataMarcas);
  }, [dataMarcas]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosMarcas(authPermisos);
      }
    }, 10);
  }, [authPermisos]);
  

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
        {permisosMarcas.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <PButton
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
              onClick={(e) => editar_marca(e, rowData.id_marca)}
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
        <ModalAgregarMarcas
          visible={modalVisible}
          onClose={cambiar_visibilidad_modal}
        />
      )}

      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Marcas</h1>
        {Marca_Icono}
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        {permisosMarcas.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <Button
              tipo={"PRINCIPAL"}
              funcion={(e) => setModalVisible(true, e)}
            >
              {Add_Icono} Agregar
            </Button>
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
      {permisosMarcas.length === 0 ? (
        <Loader />
      ) : permisosMarcas.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default Marcas;
