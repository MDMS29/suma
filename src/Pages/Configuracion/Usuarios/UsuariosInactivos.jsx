import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Restore_Icono, Return_Icono } from "../../../components/Icons/Iconos";
import { Button as PButton } from "primereact/button";
import useUsuarios from "../../../hooks/Configuracion/useUsuarios";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import useAuth from "../../../hooks/useAuth";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import Button from "../../../components/Botones/Button";

const UsuariosInactivos = () => {

  const {
    dataUsuarios,
    setUsuarioState,
    usuarioState,
    permisosUsuario,
    eliminar_restablecer_usuario,
  } = useUsuarios();

  const {
    Permisos_DB,
    verEliminarRestaurar,
    setVerEliminarRestaurar,
  } = useAuth();

  const modal_restaurar_usuario = (usuario) => {
    setVerEliminarRestaurar(true);
    setUsuarioState(usuario);
  };

  const columns = [
    { field: "nombre_completo", header: "Nombre" },
    { field: "usuario", header: "Usuario" },
    { field: "correo", header: "Correo" },
    { field: "estado_usuario", header: "Estado" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataUsuarios);

  const filtrar_columnas = (event) => {
    let columnas_seleccionadas = event.value;
    let columnas_ordenadas_seleccionadas = columns.filter((col) =>
      columnas_seleccionadas.some((sCol) => sCol.field === col.field)
    );

    setVisibleColumns(columnas_ordenadas_seleccionadas);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const buscador = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const items_filtrados = dataUsuarios.filter((item) => {
      return (
        item.nombre_completo.toLowerCase().includes(value) ||
        item.usuario.toLowerCase().includes(value) ||
        item.correo.toLowerCase().includes(value) ||
        item.estado_usuario.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };

  useEffect(() => {
    setFilteredData(dataUsuarios);
  }, [dataUsuarios]);

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
            eliminar_restablecer_usuario(usuarioState.id_usuario, e)
          }
        />
      )}
      <div className="flex  justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Usuarios Inactivos</h1>
        <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
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
              permisosUsuario.filter(
                (permiso) =>
                  permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR
              ).length > 0 ? (
                <div className="text-center flex gap-x-3">
                  <PButton
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    onClick={(e) => modal_restaurar_usuario(rowData)}
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
