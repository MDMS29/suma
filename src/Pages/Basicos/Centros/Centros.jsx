import { useEffect, useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { MultiSelect } from "primereact/multiselect";
import { Button as PButton } from "primereact/button";
import { Toast } from "primereact/toast";
import { Centro_Icono, Edit_Icono, FliaProd_Icono } from "../../../components/Icons/Iconos";
// import ModalAgregarProcesos from "../../../components/Modales/Basicos/Procesos/ModalAgregarProcesos";
import Button from "../../../components/Botones/Button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/Forbidden";
import useCentros from "../../../hooks/Basicos/useCentros";
import ModalAgregarCentro from "../../../components/Modales/Basicos/Centros/ModalAgregarCentro";

const Centros = () => {
  const toast = useRef(null);

  const { dataCentros, permisosCentros, setPermisosCentros, buscar_centro_costo } = useCentros();

  const { authPermisos, Permisos_DB, alerta, setAlerta } = useAuth();

  const columns = [
    { field: "codigo", header: "Codigo" },
    { field: "centro_costo", header: "Centro de Costo" },
    { field: "correo_responsable", header: "Correo" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataCentros);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const editar_centro_costos = async (e, id_centro) => {
    e.preventDefault();
    setModalVisible(true);
    await buscar_centro_costo(id_centro);
  };

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

    const items_filtrados = dataCentros.filter((item) => {
      return (
        item.codigo.toLowerCase().includes(value) ||
        item.centro_costo.toLowerCase().includes(value) ||
        item.correo_responsable.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };

  useEffect(() => {
    setFilteredData(dataCentros);
  }, [dataCentros]);

  useEffect(() => {
    setTimeout(() => {
      if (authPermisos !== undefined) {
        return setPermisosCentros(authPermisos);
      }
    }, 10);
  }, [authPermisos]);

  const cambiar_visibilidad_modal = () => {
    setModalVisible(!modalVisible);
  };

  // MOSTRAR ALERTA

  useEffect(() => {
    if (alerta.show) {
      const show_alert = () => {
        toast.current.show({
          severity: alerta.error ? "error" : "success",
          detail: alerta.message,
          life: 1500,
        });
        setTimeout(() => setAlerta({}), 1500);
      };
      show_alert();
    }
  }, [alerta]);

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
        {permisosCentros?.filter(
          (permiso) =>
            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
        ).length > 0 && (
            <PButton
              tooltip="Editar"
              tooltipOptions={{ position: "top" }}
              className="p-button-rounded p-mr-2"
              onClick={e => editar_centro_costos(e, rowData.id_centro)}
            >
              {Edit_Icono}
            </PButton>
          )}
      </div>
    );
  };

  const main = () => (
    <div className="w-5/6">
      <Toast ref={toast} />
      {modalVisible && (
        <ModalAgregarCentro
          visible={modalVisible}
          onClose={cambiar_visibilidad_modal}
        />
      )}

        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Centro de Costos</h1>
          {Centro_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
          {permisosCentros.filter(
            (permiso) =>
              permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
          ).length > 0 && (
            <Button
              tipo={"PRINCIPAL"}
              funcion={(e) => setModalVisible(true, e)}
            >
              <i className="pi pi-plus mx-2 font-medium"></i>
              Agregar
            </Button>
          )}
        <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
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
  );

  return (
    <>
      {permisosCentros?.length === 0 ? (
        <Loader />
      ) : permisosCentros.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default Centros;
