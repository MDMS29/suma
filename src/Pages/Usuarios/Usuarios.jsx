import { useState, useRef, useEffect } from "react";
import { Toast } from 'primereact/toast';

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Key_Icono, Trash_Icono, Edit_Icono } from "../../../public/Icons/Iconos";

import Confirmar from "../../components/Modales/Confirmar";
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import useUsuarios from '../../hooks/useUsuarios';
import ModalAgregarUsuarios from '../../components/Usuarios/ModalAgregarUsuarios'

const Usuarios = () => {
  const toast = useRef(null);

  const [modalEliminar, setModalEliminar] = useState(false)

  const mensajeEliminado = () => {
    toast.current.show({ severity: 'success', detail: 'El registro se ha inactivado correctamente. ', life: 5000 });
  }

  const { dataUsuarios, setEliminarUsuario } = useUsuarios();

  const columns = [
    { field: "id_usuario", header: "ID" },
    { field: "nombre_completo", header: "Nombre" },
    { field: "usuario", header: "Usuario" },
    { field: "correo", header: "Correo" },
    { field: "estado_usuario", header: "Estado" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataUsuarios);
  const [searchTerm, setSearchTerm] = useState('');

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
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

  const confirmDeleteProduct = (e, usuario) => {
    e.preventDefault();
    setModalEliminar(true);
    setEliminarUsuario(usuario);
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
    setFilteredData(dataUsuarios);
  }, [dataUsuarios]);


  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <div className="w-5/6">
      <Toast ref={toast} />
      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Usuarios</h1>
        <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
      </div>
      {modalEliminar ? <Confirmar modalEliminar={modalEliminar} setModalEliminar={setModalEliminar} mensajeEliminado={mensajeEliminado} /> : ""}
      <div className="bg-neutral-100 my-3 p-3 rounded-md w-full flex">
        <div>
          <button className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500" onClick={e => setModalVisible(true)}>
            <i className="pi pi-plus mx-2 font-medium"></i>
            Agregar
          </button>
          <Link
            className="px-4 p-2 mx-2 rounded-md text-red-500 border-2 border-red-500 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out"
            to="/home/config/usuarios/inactivos"
          >
            Inactivos
          </Link>
          <ModalAgregarUsuarios visible={modalVisible} onClose={toggleModal} />
        </div>
        <span className="p-input-icon-left ml-auto">
          <i className="pi pi-search" />
          <InputText className="h-10 pl-8" placeholder="Buscar" onChange={e => handleSearch(e)} value={searchTerm} />
        </span>
      </div>

      <div className="card">
        <DataTable
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
            body={(rowData) => (
              <div className="text-center flex gap-x-3">
                <Button
                  tooltip="Editar"
                  tooltipOptions={{ position: "top" }}
                  className="p-button-rounded p-mr-2 "
                >
                  {Edit_Icono}
                </Button>

                <Button
                  tooltip="Eliminar"
                  className="p-button-rounded p-button-danger p-mr-2"
                  tooltipOptions={{ position: "top" }}
                  onClick={e => confirmDeleteProduct(e, rowData)}
                >
                  {Trash_Icono}
                </Button>

                <Button
                  tooltip="Restablecer"
                  className="p-button-rounded p-button-info"
                  tooltipOptions={{ position: "top" }}
                >
                  {Key_Icono}
                </Button>
              </div>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Usuarios;