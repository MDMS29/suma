import { Column } from "primereact/column";
import useHistorial from "../../hooks/Auditorias/useHistorial";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";

const Historial = () => {
  const { dataHistorial } = useHistorial();

  const columns = [
    { field: "schema_name", header: "Esquema" },
    { field: "table_name", header: "Tabla" },
    { field: "user_name", header: "Usuario" },
    { field: "action_tstamp", header: "Fecha de la accion" },
    { field: "action", header: "Accion" },
    { field: "original_data", header: "Data original" },
    { field: "new_data", header: "Nueva data" },
    { field: "query", header: "Consulta" },
  ];
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [filteredData, setFilteredData] = useState(dataHistorial);
  const [searchTerm, setSearchTerm] = useState("");

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

    const items_filtrados = dataHistorial.filter((item) => {
      return (
        item.schema_name.toLowerCase().includes(value) ||
        item.table_name.toLowerCase().includes(value) ||
        item.user_name.toLowerCase().includes(value) ||
        item.action_tstamp.toLowerCase().includes(value) ||
        item.action.toLowerCase().includes(value) ||
        item.original_data.toLowerCase().includes(value) ||
        item.new_data.toLowerCase().includes(value) ||
        item.query.toLowerCase().includes(value)
      );
    });
    setFilteredData(items_filtrados);
  };

  useEffect(() => {
    setFilteredData(dataHistorial);
  }, [dataHistorial]);

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
      <div className="flex justify-center gap-x-4 m-2 p-3">
        <h1 className="text-3xl">Historial</h1>
        {Centro_Icono}
      </div>
      <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
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
          header={header}
          emptyMessage="No se han encontrado resultados"
          tableStyle={{ minWidth: "50rem" }}
        >
          {visibleColumns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
        </DataTable>
      </div>
    </div>
  );

  return <>{main()} </>;
};

export default Historial;
