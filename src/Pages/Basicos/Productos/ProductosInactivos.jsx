import { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import Button from "../../../components/Botones/Button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import {
  Producto_Icono,
  Restore_Icono,
  Return_Icono,
} from "../../../components/Icons/Iconos";
import useProductos from "../../../hooks/Basicos/useProductos";
import useAuth from "../../../hooks/useAuth";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";

const ProductosInactivos = () => {

  const {
    permisosProductos,
    dataProductos,
    eliminar_restablecer_producto,
    productoState,
    setProductoState,
  } = useProductos();
  const {
    Permisos_DB,
    setVerEliminarRestaurar,
    verEliminarRestaurar,
  } = useAuth();

  const columns = [
    { field: "referencia", header: "Referencia" },
    { field: "nombre_producto", header: "Nombre" },
    { field: "marca", header: "Marca" },
    { field: "nombre_familia", header: "Familia" },
    { field: "tipo_producto", header: "Tipo Producto" },
    { field: "unidad", header: "Unidad Medida" },
    { field: "critico_con", header: "Critico" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataProductos);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(dataProductos);
  }, [dataProductos]);

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

    const items_filtrados = dataProductos.filter((item) => {
      return (
        item.referencia.includes(value) ||
        item.nombre_producto.toLowerCase().includes(value) ||
        item.marca.toLowerCase().includes(value) ||
        item.nombre_familia.toLowerCase().includes(value) ||
        item.tipo_producto.toLowerCase().includes(value) ||
        item.unidad.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };

  const modal_restaurar_producto = (producto) => {
    setVerEliminarRestaurar(true);
    setProductoState(producto);
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

  const main = () => (
    <div className="w-5/6">
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"RESTAURAR"}
          funcion={(e) =>
            eliminar_restablecer_producto(productoState.id_producto, e)
          }
        />
      )}

      <div className="flex  justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Productos Inactivos</h1>
        <div className="max-sm:hidden">
          {Producto_Icono}
        </div>
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
              permisosProductos.filter(
                (permiso) =>
                  permiso.permiso.toLowerCase() === Permisos_DB.RESTAURAR
              ).length > 0 ? (
                <div className="text-center flex gap-x-3">
                  <PButton
                    tooltip="Restaurar"
                    tooltipOptions={{ position: "top" }}
                    onClick={(e) => modal_restaurar_producto(rowData)}
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
      {permisosProductos.length === 0 ? (
        <Loader />
      ) : permisosProductos.filter(
        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
      ).length > 0 ? (
        main()
      ) : (
        <Forbidden />
      )}
    </>
  );
};

export default ProductosInactivos;
