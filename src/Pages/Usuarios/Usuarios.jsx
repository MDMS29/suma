import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import { Key_Icono, Trash_Icono, Edit_Icono } from "../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";

// import { Link } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import useUsuarios from "../../hooks/useUsuarios";
import ModalAgregarUsuario from "../../components/Usuarios/ModalAgregarUsuario";
import useAuth from "../../hooks/useAuth";
import Forbidden from "../Errors/forbidden";
import Loader from "../../components/Loader";
import EliminarRestaurar from "../../components/Modales/EliminarRestaurar";
import Button from "../../components/Botones/Button";
import BLink from "../../components/Botones/BLink";

const Usuarios = () => {
  const toast = useRef(null);

  const columns = [
    { field: "id_usuario", header: "ID" },
    { field: "nombre_completo", header: "Nombre" },
    { field: "usuario", header: "Usuario" },
    { field: "correo", header: "Correo" },
    // { field: "estado_usuario", header: "Estado" },
  ];

  const {
    dataUsuarios,
    usuarioState,
    setUsuarioState,
    buscar_usuario,
    setPerfilesEdit,
    restablecer_usuario_provider,
    setPermisosEdit,
    permisosUsuario,
    setPermisosUsuario,
    eliminar_restablecer_usuario,
    resClave,
    setResClave
  } = useUsuarios();

  const { authPermisos, Permisos_DB, alerta, setAlerta, verEliminarRestaurar, setVerEliminarRestaurar } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataUsuarios);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(dataUsuarios);
  }, [dataUsuarios]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosUsuario(authPermisos);
      }
    }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authPermisos]);

  //MOSTRAR ALERTA
  useEffect(() => {
    if (alerta.show) {
      const show_alert = () => {
        toast.current.show({
          severity: alerta.error && !resClave ? "error" : resClave ? "info" : "success",
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500);
      };
      show_alert();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alerta]);

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

  const modal_eliminar_usuario = (e, usuario) => {
    e.preventDefault();
    setUsuarioState(usuario);
    setVerEliminarRestaurar(true);
    setResClave(false)
  };

  const btn_restablecer = (e, usuario) => {
    e.preventDefault();
    setVerEliminarRestaurar(true);
    setUsuarioState(usuario);
    setResClave(true)
  };

  const cambiar_visibilidad_modal = () => {
    setResClave(false)
    setPerfilesEdit([]);
    setPermisosEdit([]);
    setModalVisible(!modalVisible);
  };

  const editar_usuario = async (e, id_usuario) => {
    e.preventDefault();
    setModalVisible(true);
    await buscar_usuario(id_usuario);
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
        {permisosUsuario.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <PButton
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
              onClick={(e) => editar_usuario(e, rowData.id_usuario)}
            >{Edit_Icono}</PButton>
          )}
        {permisosUsuario.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR
        ).length > 0 && (
            <PButton
              tooltip="Eliminar"
              className="p-button-rounded p-button-danger p-mr-2"
              tooltipOptions={{ position: "top" }}
              onClick={(e) => modal_eliminar_usuario(e, rowData)}
            >
              {Trash_Icono}
            </PButton>
          )}
        {permisosUsuario.filter(
          (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR
        ).length > 0 && (
            <PButton
              tooltip="Restablecer"
              className="p-button-rounded p-button-info"
              tooltipOptions={{ position: "top" }}
              onClick={(e) => btn_restablecer(e, rowData)}
            >
              {Key_Icono}
            </PButton>
          )}
      </div>
    );
  };

  const main = () => (
    <>
      <div className="w-5/6">
        <Toast ref={toast} />

        {modalVisible && <ModalAgregarUsuario visible={modalVisible} onClose={cambiar_visibilidad_modal} />}
        {verEliminarRestaurar && <EliminarRestaurar tipo={resClave ? 'RESTABLECER_CLAVE' : 'ELIMINAR'} funcion={e => resClave ? restablecer_usuario_provider(usuarioState.id_usuario, e) : eliminar_restablecer_usuario(usuarioState.id_usuario, e)} />}


        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Usuarios</h1>
          <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          {permisosUsuario.filter(
            (permiso) =>
              permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
          ).length > 0 && (
              <Button
                tipo={'PRINCIPAL'}
                funcion={(e) => setModalVisible(true, e)}
              >
                <i className="pi pi-plus mx-2 font-medium"></i>
                Agregar
              </Button>
            )}
          {permisosUsuario.filter(
            (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
          ).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <BLink
                  tipo={'INACTIVOS'}
                  url="/configuracion/usuarios/inactivos"
                >
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
    </>
  );

  return (
    <>
      {
        permisosUsuario.length === 0 ?
          (<Loader />) :
          (permisosUsuario.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0
            ?
            (main())
            :
            (<Forbidden />))
      }
    </>
  );
};

export default Usuarios;
