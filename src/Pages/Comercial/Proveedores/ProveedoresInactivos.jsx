import { InputText } from "primereact/inputtext";
import { Button as PButton } from "primereact/button";
import { useEffect, useState } from "react";
import Button from "../../../components/Botones/Button";
import { Restore_Icono, Return_Icono, Proveedores_Icon, } from "../../../components/Icons/Iconos";
import useProveedores from "../../../hooks/Compras/useProveedores";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import useAuth from "../../../hooks/useAuth";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";

const ProveedoresInactivos = () => {
  const { dataProveedores, 
    permisosProveedor, 
    proveedorState, 
    setProveedorState, 
    eliminar_restablecer_proveedor 
  } = useProveedores()

  const { Permisos_DB, 
    setVerEliminarRestaurar, 
    verEliminarRestaurar  
  } = useAuth()

  const columns = [
    { field: "documento", header: "Documento" },
    { field: "tipo_doc", header: "Tipo Doc." },
    { field: "nombre", header: "Nombre" },
    { field: "telefono", header: "Telefono" },
    { field: "correo", header: "Correo" }
  ];
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(dataProveedores);

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

    const items_filtrados = dataProveedores.filter((item) => {
      return (
        item.nombre.toLowerCase().includes(value) ||
        item.tipo_doc.toLowerCase().includes(value) ||
        item.documento.includes(value) ||
        item.telefono.includes(value) ||
        item.correo.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };

  const modal_restaurar_proveedor = (proveedor) => {
    setVerEliminarRestaurar(true);
    setProveedorState(proveedor);
  }; 

  useEffect(() => {
    setFilteredData(dataProveedores);
  }, [dataProveedores]);

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
    <div className="w-5/6">
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"RESTAURAR"}
          funcion={(e) =>
            eliminar_restablecer_proveedor(proveedorState.id_tercero, e)
          }
        />
      )}
      <div className="flex  justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Proveedores Inactivos</h1>
        {Proveedores_Icon}
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        <Button tipo={"PRINCIPAL"} funcion={(e) => window.history.back()}>
          {Return_Icono} Regresar
        </Button>
        <span className="p-input-icon-left sm:ml-auto md:ml-auto  lg:ml-auto  xl:ml-auto border rounded-md">
          <i className="pi pi-search" />
          <InputText
            className="h-10 pl-8 w-auto rounded-md"
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
            body={(rowData) =>
              permisosProveedor.filter(
                (permiso) =>
                  permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR
              ).length > 0 ? (
                <div className="text-center flex gap-x-3">
                  <PButton
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    onClick={(e) => modal_restaurar_proveedor(rowData)}
                  >
                    {Restore_Icono}
                  </PButton>
                </div>
              ) : (
                ""
              )
            }
          />
        </DataTable>
      </div>
    </div>)

  return (
    <>
      {permisosProveedor.length === 0 ? (
        <Loader />
      ) : permisosProveedor.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}</>
  )
}

export default ProveedoresInactivos