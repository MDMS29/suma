import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";

import useUsuarios from '../../hooks/useUsuarios'
import { Restore_Icono, Return_Icono } from "../../components/Icons/Iconos";

import Loader from "../../components/Loader";
import Forbidden from "../Errors/forbidden";
import useAuth from "../../hooks/useAuth";
import EliminarRestaurar from "../../components/Modales/EliminarRestaurar";
import { Button as PButton } from "primereact/button";
import Button from "../../components/Botones/Button";

const UsuariosInactivos = () => {
  const toast = useRef(null);

  // const [modalEliminar, setModalEliminar] = useState(false);

  const { dataUsuarios, setUsuarioState, permisosUsuario, eliminarRestablecerUsuario, usuarioState } = useUsuarios();
  const { alerta, setAlerta, Permisos_DB, verEliminarRestaurar, setVerEliminarRestaurar } = useAuth();

  const mostrarModalEliminar = (usuario) => {
    setVerEliminarRestaurar(true);
    setUsuarioState(usuario);
  };

  const columns = [
    { field: "id_usuario", header: "ID" },
    { field: "nombre_completo", header: "Nombre" },
    { field: "usuario", header: "Usuario" },
    { field: "correo", header: "Correo" },
    { field: "estado_usuario", header: "Estado" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataUsuarios);
  // -------------Filtro-------------
  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );

    setVisibleColumns(orderedSelectedColumns);
  };

  // -------------Buscador-------------
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredItems = dataUsuarios.filter((item) => {
      return (
        item.nombre_completo.toLowerCase().includes(value) ||
        item.usuario.toLowerCase().includes(value) ||
        item.correo.toLowerCase().includes(value) ||
        item.estado_usuario.toLowerCase().includes(value)
      );
    });
    setFilteredData(filteredItems);
  };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerta])

  useEffect(() => {
    setFilteredData(dataUsuarios);
  }, [dataUsuarios]);

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


  const main = () => (
    <div className="w-5/6">
      <Toast ref={toast} />
      {verEliminarRestaurar && <EliminarRestaurar tipo={'RESTAURAR'} funcion={e => eliminarRestablecerUsuario(usuarioState.id_usuario, e)} />}

      <div className="flex  justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Usuarios Inactivos</h1>
        <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        <Button tipo={'PRINCIPAL'} funcion={e => window.history.back()}>
          {Return_Icono} Regresar
        </Button>

        <span className="p-input-icon-left sm:ml-auto md:ml-auto  lg:ml-auto  xl:ml-auto border rounded-md">
          <i className="pi pi-search" />
          <InputText
            className="h-10 pl-8 w-auto rounded-md"
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
          {/*columna Acciones */}
          <Column
            key="actions"
            style={{ width: "10%" }}
            body={(rowData) =>
              permisosUsuario.filter(
                (permiso) =>
                  permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR
              ).length > 0 ? (
                <div className="text-center flex gap-x-3">
                  <PButton
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    // eslint-disable-next-line no-unused-vars
                    onClick={e => mostrarModalEliminar(rowData)}
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
      {permisosUsuario.length === 0 ? (
        <Loader />
      ) : permisosUsuario.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default UsuariosInactivos;
