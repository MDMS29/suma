import { useState, useEffect, useRef } from "react";
import usePerfiles from "../../hooks/usePerfiles";
import { MultiSelect } from "primereact/multiselect";
import Confirmar from "../../components/Modales/Confirmar";



import { Toast } from "primereact/toast";
import Loader from "../../components/Loader";
import Forbidden from "../Errors/forbidden";
import useAuth from "../../hooks/useAuth";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Restore_Icono } from "../../../public/Icons/Iconos";

import { InputText } from "primereact/inputtext"

const PerfilesInactivos = () => {
  const toast = useRef(null);
  const { dataPerfiles, permisosPerfil, setPerfilState } = usePerfiles();
  const { Permisos_DB } = useAuth()
  const redirectToPreviousPage = () => {
    window.history.back();
  };

  const mensajeRestauradoPerfil = () => {
    toast.current.show({ severity: 'success', detail: 'El registro se ha activado correctamente. ', life: 1500 });
  }

  const confirmRestaurarPerfil = (e, perfil) => {
    e.preventDefault();
    setModalEliminar(true);
    setPerfilState(perfil);
  };

  const columns = [
    { field: "id_perfil", header: "ID" },
    { field: "nombre_perfil", header: "Nombre" },
  ];

  const [modalEliminar, setModalEliminar] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataPerfiles);
  // -------------Filtro-------------
  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));

    setVisibleColumns(orderedSelectedColumns);
  };

  // -------------Buscador-------------
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredItems = dataPerfiles.filter((item) => {
      return (
        item.nombre_perfil.toLowerCase().includes(value) 
      );
    });
    setFilteredData(filteredItems);
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


  useEffect(() => {
    setFilteredData(dataPerfiles);
  }, [dataPerfiles]);


  const main = () => (
    <div className="w-5/6">
      <Toast ref={toast} />
      {modalEliminar ? <Confirmar modalEliminar={modalEliminar} setModalEliminar={setModalEliminar} mensajeRestauradoPerfil={mensajeRestauradoPerfil} /> : ""}
      <div className="flex  justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Perfiles Inactivos</h1>
        <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        <div>
          <button onClick={redirectToPreviousPage} className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500">
            <i className="pi pi-replay mx-2 font-medium"></i>
            Regresar
          </button>
        </div>

        <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto  xl:ml-auto border rounded-md">
          <i className="pi pi-search" />
          <InputText className="h-10 pl-8 w-auto rounded-md" placeholder="Buscar" onChange={e => handleSearch(e)} value={searchTerm} />
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
            body={(rowData) => (
              permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR).length > 0 ? (
                <div className="text-center flex gap-x-3">
                  <Button
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    className="p-button-rounded p-mr-2"
                    onClick={e => confirmRestaurarPerfil(e, rowData)}
                  >
                    {Restore_Icono}
                  </Button>
                </div>
              ) : '')}
          />
        </DataTable>
      </div>
    </div>
  )

  return (
    <>
      {
        permisosPerfil.length === 0
          ?
          (<Loader />)
          :
          (permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0
            ?
            (main())
            :
            (<Forbidden />))
      }
    </>
  )
};

export default PerfilesInactivos