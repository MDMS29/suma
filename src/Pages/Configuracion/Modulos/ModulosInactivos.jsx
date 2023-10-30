import { useEffect, useRef, useState } from "react";
import { Restore_Icono, Return_Icono } from "../../../components/Icons/Iconos";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import useModulos from "../../../hooks/Configuracion/useModulos";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/Botones/Button";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";

const ModulosInactivos = () => {
  const toast = useRef(null);

  const {
    dataModulos,
    setModuloState,
    permisosModulo,
    eliminar_restablecer_modulo,
    ModuloState,
  } = useModulos();
  const {
    Permisos_DB,
    verEliminarRestaurar,
    setVerEliminarRestaurar,
    setAlerta,
    alerta,
  } = useAuth();
  
  const mostrar_modal_eliminar = (modulo) => {
    setVerEliminarRestaurar(true);
    setModuloState(modulo);
  };
  
  const columns = [
    { field: "id_modulo", header: "ID" },
    { field: "nombre_modulo", header: "Nombre" },
    { field: "icono", header: "Icono" },
  ];
  
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataModulos);
  const [searchTerm, setSearchTerm] = useState("");

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

    const items_filtrados = dataModulos.filter((item) => {
      return item.nombre_modulo.toLowerCase().includes(value);
    });
    setFilteredData(items_filtrados);
  };

  useEffect(() => {
    setFilteredData(dataModulos);
  }, [dataModulos]);

  useEffect(() => {
    if (alerta.show) {
      (() => {
        toast.current.show({
          severity: alerta.error ? 'error' : 'success',
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500)
      })()
    }
  }, [alerta])

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
      <Toast ref={toast} />
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"RESTAURAR"}
          funcion={(e) => eliminar_restablecer_modulo(ModuloState.id_modulo, e)}
        />
      )}
      <div className="flex  justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Modulos Inactivos</h1>
        <i className="pi pi-folder" style={{ fontSize: "2rem" }}></i>
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        <div>
          <Button tipo={'PRINCIPAL'} funcion={e => window.history.back()}>
            {Return_Icono} Regresar
          </Button>
        </div>

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
          {/*columna Acciones */}
          <Column
            key="actions"
            style={{ width: "10%" }}
            body={(rowData) =>
              permisosModulo.filter(
                (permiso) =>
                  permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR
              ).length > 0 ? (
                <div className="text-center flex gap-x-3">
                  <PButton
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    onClick={(e) => mostrar_modal_eliminar(rowData)}
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

export default ModulosInactivos;
