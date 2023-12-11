import { Column } from "primereact/column";
import useAuditoria from "../../hooks/Auditorias/useAuditoria";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";
import { useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Historial_Icono } from "../../components/Icons/Iconos";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Forbidden from "../Errors/Forbidden";

const Auditoria = () => {
  const {
    dataAuditoria,
    permisosAuditoria,
    setPermisosAuditoria,
    filtrar_auditoria,
    auditoriasFiltradas,
  } = useAuditoria();

  const { authPermisos, Permisos_DB } = useAuth();
  const columns = [
    { field: "schema_name", header: "Esquema" },
    { field: "table_name", header: "Tabla" },
    { field: "user_name", header: "Usuario" },
    { field: "action_tstamp", header: "Fecha de la accion" },
    { field: "acciones", header: "Accion" },
    { field: "original_data", header: "Data original" },
    { field: "new_data", header: "Nueva data" },
    { field: "query", header: "Consulta" },
  ];
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataAuditoria);

  const filtrar_columnas = (event) => {
    let columnas_seleccionadas = event.value;
    let columnas_ordenadas_seleccionadas = columns.filter((col) =>
      columnas_seleccionadas.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(columnas_ordenadas_seleccionadas);
  };

  useEffect(() => {
    setFilteredData(dataAuditoria);
  }, [dataAuditoria]);

  useEffect(() => {
    setFilteredData(auditoriasFiltradas);
  }, [auditoriasFiltradas]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosAuditoria(authPermisos);
      }
    }, 10);
  }, [authPermisos]);

  const renderCell = (rowData, column) => {
    const text = rowData[column.field];

    // Definir el máximo de caracteres permitidos
    const maxLength = 100;

    // Limitar el texto a la longitud máxima
    const truncatedText =
      text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

    return <span title={text}>{truncatedText}</span>;
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

  const main = () => (
    <div className="w-10/12">
      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Auditoria</h1>
        <div className="max-sm:hidden">
          {Historial_Icono}
        </div>
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap ">
        <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
          <i className="pi pi-search" />
          <InputText
            className="h-10 pl-8 rounded-md"
            placeholder="Buscar"
            onChange={(e) => filtrar_auditoria(e)}
          />
        </span>
      </div>

      <div className="card">
        <DataTable
          className="custom-datatable"
          stripedRows
          value={filteredData}
          header={header}
          emptyMessage="No se han encontrado resultados"
          paginator={true}
          rows={25}
          rowsPerPageOptions={[25, 50]}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          tableStyle={{ minWidth: "50rem" }}
        >
          {visibleColumns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={(rowData) => renderCell(rowData, col)}
              className={
                col.field === "original_data" ||
                  col.field === "new_data" ||
                  col.field === "acciones"
                  ? "max-w-xs"
                  : ""
              }
            />
          ))}
        </DataTable>
      </div>
    </div>
  );

  return (
    <>
      {permisosAuditoria?.length === 0 ? (
        <Loader />
      ) : permisosAuditoria.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default Auditoria;
