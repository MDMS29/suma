import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import {
  Trash_Icono,
  Edit_Icono,
} from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext"
import usePerfiles from "../../../hooks/Configuracion/usePerfiles";
import ModalAgregarPerfil from "../../../components/Perfiles/ModalAgregarPerfil";
import BLink from "../../../components/Botones/BLink";

import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/Forbidden";
import useAuth from "../../../hooks/useAuth";

// import { Dropdown } from 'primereact/dropdown';

import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import Button from "../../../components/Botones/Button";


const Perfiles = () => {
  const toast = useRef(null);

  const columns = [
    { field: "id_perfil", header: "ID" },
    { field: "nombre_perfil", header: "Nombre" },
  ];

  const { dataPerfiles, permisosPerfil, setPermisosPerfil, perfilState, setPerfilState, buscar_perfil, eliminar_restablecer_perfil } = usePerfiles();
  const { authPermisos, Permisos_DB, alerta, setAlerta, verEliminarRestaurar, setVerEliminarRestaurar } = useAuth()

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataPerfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const modal_eliminar_perfil = (e, perfil) => {
    e.preventDefault();
    setPerfilState(perfil);
    setVerEliminarRestaurar(true);
  };

  const editar_perfil = async (e, id_perfil) => {
    e.preventDefault()
    setModalVisible(true)
    await buscar_perfil(id_perfil)
  }

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

    const items_filtrados = dataPerfiles.filter((item) => {
      return item.nombre_perfil.toLowerCase().includes(value);
    });
    setFilteredData(items_filtrados);
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

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
  };
  //MOSTRAR ALERTA
  useEffect(() => {
    if (alerta.show) {
      const show_alert = () => {
        toast.current.show({
          severity: alerta.error ? 'error' : 'success',
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500)
      }
      show_alert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const columna_acciones = rowData => {
    return (
      (
        <div className="text-center flex gap-x-3">
          {
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR).length > 0 && (
              <PButton
                tooltip="Editar"
                tooltipOptions={{ position: "top" }}
                className="p-button-rounded p-mr-2"
                onClick={e => editar_perfil(e, rowData.id_perfil)}
              >{Edit_Icono}</PButton>
            )}
          {permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR).length > 0 && (
            <PButton
              tooltip="Eliminar"
              className="p-button-rounded p-button-danger p-mr-2"
              tooltipOptions={{ position: "top" }}
              onClick={(e) => modal_eliminar_perfil(e, rowData)}
            >
              {Trash_Icono}
            </PButton>
          )
          }

        </div>
      ))
  }

  const main = () => (
    <>
      <div className="w-5/6">
        <Toast ref={toast} />
        {modalVisible && <ModalAgregarPerfil visible={modalVisible} onClose={cambiar_visibilidad_modal} />}
        {verEliminarRestaurar && <EliminarRestaurar tipo={'ELIMINAR'} funcion={e => eliminar_restablecer_perfil(perfilState.id_perfil, e)} />}

        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Perfiles</h1>
          <i className="pi pi-user" style={{ fontSize: "2rem" }}></i>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">

          {
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR).length > 0 && (
              <Button
                tipo={'PRINCIPAL'}
                funcion={(e) => setModalVisible(true, e)}
              >
                <i className="pi pi-plus mx-2 font-medium"></i>
                Agregar
              </Button>
            )
          }
          {
            permisosPerfil.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0 && (
              <div className="h-full flex justify-center items-center">
                <BLink
                  tipo={'INACTIVOS'}
                  url="/configuracion/perfiles/inactivos"
                >
                  Inactivos
                </BLink>
              </div>
            )
          }
          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" onChange={e => buscador(e)} value={searchTerm} />
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

export default Perfiles;
