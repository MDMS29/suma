import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Button from "../Botones/Button";
import { Edit_Icono, Trash_Icono, menu_Icono } from "../Icons/Iconos";
import useModulos from "../../hooks/useModulos";
import { MultiSelect } from "primereact/multiselect";

const ModalAsignarMenu = ({ visible, onClose }) => {

  const {
    menus,
    dataMenus,
  } = useModulos();

  const [filteredData, setFilteredData] = useState(menus);
  const columns = [
    { field: "id_menu", header: "ID" },
    { field: "nombre_menu", header: "Nombre de Menu" },
    { field: "link_menu", header: "Enlace" },
  ];

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

  useEffect(() => {
    setFilteredData(dataMenus);
    console.log(dataMenus)
  }, [dataMenus]);
  
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const header = (
    <MultiSelect
    options={columns}
      value={visibleColumns}
      optionLabel="header"
      onChange={onColumnToggle}
      className="w-full sm:w-20rem"
      display="chip"
    />
  );

  const handleClose = () => {
    onClose();
  };

  const columnAcciones = () => {
    return (
      <div className="text-center flex gap-x-3">
            <Button
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
            >
              {Edit_Icono}
            </Button>
            <Button
              tooltip="Eliminar"
              className="p-button-rounded p-button-danger p-mr-2"
              tooltipOptions={{ position: "top" }}
            >
              {Trash_Icono}
            </Button>
      </div>
    );
  };


  return (
    <Dialog
      header={<h1>Asignar Menú</h1>}
      visible={visible}
      onHide={handleClose}
    >
      <div className="flex flex-col">
        <label className="text-gray-600 pb-2 font-semibold">
          Nombre de Menú
        </label>
        <InputText className="border-1 h-10 rounded-md px-3 py-2  border-gray-300" />
      </div>
      <div className="card mt-5">
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
    </Dialog>
  );
};

export default ModalAsignarMenu;
