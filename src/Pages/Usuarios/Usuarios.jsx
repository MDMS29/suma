import { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {
  Key_Icono,
  Trash_Icono,
  Edit_Icono,
} from "../../../public/Icons/Iconos";
import { InputText } from "primereact/inputtext";

import Confirmar from "../../components/Modales/Confirmar";
import { Link } from "react-router-dom";
import { MultiSelect } from "primereact/multiselect";
import useUsuarios from "../../hooks/useUsuarios";
import ModalAgregarUsuario from "../../components/Usuarios/ModalAgregarUsuario";
import useAuth from "../../hooks/useAuth";
import Forbidden from "../Errors/forbidden";
import Loader from "../../components/Loader";

const Usuarios = () => {
  const toast = useRef(null);

  const columns = [
    { field: "id_usuario", header: "ID" },
    { field: "nombre_completo", header: "Nombre" },
    { field: "usuario", header: "Usuario" },
    { field: "correo", header: "Correo" },
    { field: "estado_usuario", header: "Estado" },
  ];


  const { dataUsuarios, setUsuarioState, buscarUsuario, setPerfilesEdit, setPermisosEdit, permisosUsuario, setPermisosUsuario } = useUsuarios();

  const { authPermisos, Permisos_DB } = useAuth()

  const [modalEliminar, setModalEliminar] = useState(false);
  const [botonUsuario, setBotonUsuario] = useState();

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
        return setPermisosUsuario(authPermisos)
      }
    }, 10)
  }, [authPermisos])

  const mensajeRestablecido = () => {
    toast.current.show({ severity: 'success', detail: 'Se ha restablecido la clave del usuario correctamente. ', life: 1500 });
  }

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
  };

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

  const confirmDeleteUsuario = (e, usuario) => {
    e.preventDefault();
    setModalEliminar(true);
    setUsuarioState(usuario);
    setBotonUsuario(1);
  };

  const confirmRestablecer = (e, usuario) => {
    e.preventDefault();
    setModalEliminar(true);
    setUsuarioState(usuario);
    setBotonUsuario(2);
  };

  const toggleModal = () => {
    setPerfilesEdit([])
    setPermisosEdit([])
    setModalVisible(!modalVisible)
  };

  const editarUsuario = async (e, id_usuario) => {
    e.preventDefault();
    setModalVisible(true)
    await buscarUsuario(id_usuario)
  }

  const mensajeEliminado = () => {
    toast.current.show({
      severity: "success",
      detail: "El registro se ha inactivado correctamente. ",
      life: 1500,
    });
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

  const columnAcciones = rowData => {
    return (
      (
        <div className="text-center flex gap-x-3">
          {
            permisosUsuario.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR).length > 0 && (
              <Button
                tooltip="Editar"
                tooltipOptions={{ position: "top" }}
                className="p-button-rounded p-mr-2"
                onClick={e => editarUsuario(e, rowData.id_usuario)}
              >
                {Edit_Icono}
              </Button>

            )
          }
          {
            permisosUsuario.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR).length > 0 && (
              <Button
                tooltip="Eliminar"
                className="p-button-rounded p-button-danger p-mr-2"
                tooltipOptions={{ position: "top" }}
                onClick={e => confirmDeleteUsuario(e, rowData)}
              >
                {Trash_Icono}
              </Button>
            )
          }
          {
            permisosUsuario.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR).length > 0 && (
              <Button
                tooltip="Restablecer"
                className="p-button-rounded p-button-info"
                tooltipOptions={{ position: "top" }}
                onClick={e => confirmRestablecer(e, rowData)}
              >
                {Key_Icono}
              </Button>
            )
          }
        </div>
      )
    )
  }

  const main = () => (
    <>
      <div className="w-5/6">
        <Toast ref={toast} />
        {modalVisible && <ModalAgregarUsuario visible={modalVisible} onClose={toggleModal} />}
        {modalEliminar ? 
        <Confirmar 
        modalEliminar={modalEliminar} 
        setModalEliminar={setModalEliminar} 
        mensajeEliminado={mensajeEliminado} 
        botonUsuario={botonUsuario} 
        mensajeRestablecido={mensajeRestablecido} /> : ""}
        
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Usuarios</h1>
          <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
        </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
        
          {
            permisosUsuario.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR).length > 0 && (
              <button
                className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500"
                onClick={(e) => setModalVisible(true, e)}
              >
                <i className="pi pi-plus mx-2 font-medium"></i>
                Agregar
              </button>
            )
          }
          {
            permisosUsuario.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <Link
                  className="px-4 p-2 mx-2 rounded-md text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
                  to="/configuracion/usuarios/inactivos"
                >
                  Inactivos
                </Link>
              </div>
            )
          }
          <span className="p-input-icon-left sm:ml-auto md:ml-auto  lg:ml-auto  xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" onChange={e => handleSearch(e)} value={searchTerm} />
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
              body={(rowData) => columnAcciones(rowData)}
            />
          </DataTable>
        </div>
      </div>
    </>
  )

  return (
    <>
      {
        permisosUsuario.length === 0
          ?
          (<Loader />)
          :
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
