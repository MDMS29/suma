import { useState, useEffect, useRef } from "react";
import usePerfiles from "../../hooks/usePerfiles";
import { MultiSelect } from "primereact/multiselect";
import ModalAgregarPerfil from "../../components/Perfiles/ModalAgregarPerfil";
import Confirmar from "../../components/Modales/Confirmar";

import { Link } from "react-router-dom";


import { Toast } from "primereact/toast";
import Loader from "../../components/Loader";
import Forbidden from "../Errors/forbidden";
import useAuth from "../../hooks/useAuth";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {
  Trash_Icono,
  Edit_Icono,
} from "../../../public/Icons/Iconos";
import { InputText } from "primereact/inputtext"


const Perfiles = () => {
  const toast = useRef(null);

  const mensajeEliminadoPerfil = () => {
    toast.current.show({ severity: 'success', detail: 'El registro se ha inactivado correctamente. ', life: 1500 });
  }

  const columns = [
    { field: "id_perfil", header: "ID" },
    { field: "nombre_perfil", header: "Nombre" },
  ];

  const { dataPerfiles, permisosPerfil, setPermisosPerfil, setPerfilState } = usePerfiles();
  const { authPermisos, Permisos_DB } = useAuth()


  const [modalEliminar, setModalEliminar] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataPerfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  
  const confirmDeletePerfil = (e, perfil) => {
    e.preventDefault();
    setModalEliminar(true);
    setPerfilState(perfil);
  };

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(orderedSelectedColumns);
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


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredItems = dataPerfiles.filter((item) => {
      return item.nombre_perfil.toLowerCase().includes(value);
    });
    setFilteredData(filteredItems);
  };

  useEffect(() => {
    setFilteredData(dataPerfiles);
  }, [dataPerfiles]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosPerfil(authPermisos)
      }
    }, 10)
  }, [authPermisos])

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const columnAcciones = rowData => {
    return (
      (
        <div className="text-center flex gap-x-3">
          {
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR).length > 0 && (
              <Button
                tooltip="Editar"
                tooltipOptions={{ position: "top" }}
                className="p-button-rounded p-mr-2 "
              >
                {Edit_Icono}
              </Button>

            )
          }
          {
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR).length > 0 && (
              <Button
                tooltip="Eliminar"
                className="p-button-rounded p-button-danger p-mr-2"
                tooltipOptions={{ position: "top" }}
                onClick={(e) => confirmDeletePerfil(e, rowData)}
              >
                {Trash_Icono}
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
        {modalVisible && <ModalAgregarPerfil visible={modalVisible} onClose={toggleModal} />}
        {modalEliminar ? (
          <Confirmar
            modalEliminar={modalEliminar}
            setModalEliminar={setModalEliminar}
            mensajeEliminadoPerfil={mensajeEliminadoPerfil}
          />
        ) : (
          ""
        )}
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Perfiles</h1>
          <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">

          {
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR).length > 0 && (
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
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <Link
                  className="px-4 p-2 mx-2 rounded-md text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
                  to="/configuracion/perfiles/inactivos"
                >
                  Inactivos
                </Link>
              </div>
            )
          }
          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
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

  console.log(permisosPerfil)
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

export default Perfiles;