import { useEffect, useState } from 'react'
import useRequisiciones from '../../../hooks/Compras/useRequisiciones';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import Button from '../../Botones/Button';
import useProcesos from '../../../hooks/Basicos/useProcesos';

const ModalRevisarReq = ({ visible, onClose }) => {
    const {
        RequiAgg,
        setRequiAgg,
        filtar_tipo_requ,
        obtener_centro_costo,
        productosData,
        obtener_tipo_requisicion,
        revisar_requisicion } = useRequisiciones();

    const { obtener_procesos } = useProcesos();



    const columns = [
        { field: "nombre_producto", header: "Producto" },
        { field: "unidad", header: "Unidad" },
        { field: "cantidad", header: "Cantidad" },
        { field: "justificacion", header: "Justificación" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [filteredData, setFilteredData] = useState(productosData);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [aprobarTodo, setAprobarTodo] = useState(false);

    useEffect(() => {
        setProductosSeleccionados(productosData)
        if (RequiAgg.fecha_requisicion !== "") {
            setRequiAgg({
                ...RequiAgg,
                fecha_requisicion: RequiAgg.fecha_requisicion.split("T")[0],
            });
        }
    }, [productosData])

    const filtrar_columnas = (event) => {
        let columnas_seleccionadas = event.value;
        let columnas_ordenadas_seleccionadas = columns.filter((col) =>
            columnas_seleccionadas.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(columnas_ordenadas_seleccionadas);
    };

    const columna_acciones = (rowData) => (
        <label
            className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${rowData.id_estado == 4 || aprobarTodo ? "bg-primaryYellow" : "bg-gray-300"}`}>
            <input
                type="checkbox"
                className="sr-only peer"
                checked={rowData.id_estado === 4 || aprobarTodo}
                onChange={() => chk_producto(rowData.id_detalle)}
                disabled={aprobarTodo && rowData.id_estado === 4}
            />
            <span
                className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
        </label>
    )

    const chk_producto = (rowData) => {
        const producto_id = rowData;
        if (productosSeleccionados.find(producto => producto.id_detalle == producto_id)) {
            const [productos] = productosSeleccionados.filter(producto => producto.id_detalle == producto_id)
            if (productos.id_estado == 4) {
                productos.id_estado = 5
            } else {
                productos.id_estado = 4
            }
            const productosActualizados = productosSeleccionados.map(productoState => productoState.id_detalle == productos.id_detalle ? productos : productoState)
            setProductosSeleccionados(productosActualizados)
        } else {
            setProductosSeleccionados([...productosSeleccionados], { id_estado: 5 })
        }
    }
    console.log(productosSeleccionados);

    const aprobar_todo_cambio = () => {
        setAprobarTodo(!aprobarTodo);
        // Actualiza el estado de todos los productos según aprobarTodo
        const productosActualizados = productosSeleccionados.map((producto) => ({
            ...producto,
            id_estado: aprobarTodo ? 5 : 4
        }));
        setProductosSeleccionados(productosActualizados);
    };

    const guardar_lista = () => {
        revisar_requisicion(productosSeleccionados)
        onClose()
    }

    useEffect(() => {
        setFilteredData(productosData);
        if (RequiAgg.id_proceso != 0) {
            obtener_centro_costo(RequiAgg.id_proceso);
        }
        if (RequiAgg.id_tipo_producto != 0) {
            filtar_tipo_requ(RequiAgg.id_tipo_producto);
        }
    }, [productosData]);

    useEffect(() => {
        obtener_procesos();
        obtener_tipo_requisicion();
    }, []);

    const header = (
        <>
            <div className='flex gap-3 m-3 items-center'>
                <span>Aprobar todo</span>
                <label
                    className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${aprobarTodo ? "bg-primaryYellow" : "bg-gray-300"}`}
                >
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={aprobarTodo}
                        onChange={aprobar_todo_cambio}
                    />
                    <span className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                </label>
            </div>

            <MultiSelect
                value={visibleColumns}
                options={columns}
                optionLabel="header"
                onChange={filtrar_columnas}
                className="w-full sm:w-20rem"
                display="chip"
            />
        </>
    );

    const footerContent = (
        <div className="mt-3">
            <Button
                tipo={'PRINCIPAL'}
                funcion={guardar_lista}
            > Confirmar
            </Button>
        </div>
    );

    return (
        <Dialog
            header={<h1>Revision Requisicion <label className='font-mono text-2xl'>{RequiAgg.consecutivo}</label></h1>}
            visible={visible}
            onHide={onClose}
            className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
            footer={footerContent}
            maximizable
        >
            <div className="flex flex-col pt-3 flex-wrap sm:w-full">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Proceso</label>
                        <p
                            name="id_proceso"
                            className="w-full text-base"
                        >{RequiAgg.proceso}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Centro de Costo</label>
                        <p
                            name="id_centro"
                            className="w-full text-base"
                        >{RequiAgg.centro}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Fecha</label>
                        <p
                            name="fecha_requisicion"
                            className="w-full text-base"
                        >{RequiAgg.fecha_requisicion}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Tipo de Requisicion</label>
                        <p
                            name="id_tipo_producto"
                            className="w-full text-base"
                        >{RequiAgg.tipo_productos}</p>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label className="text-gray-600 pb-2 font-semibold">Observaciones</label>
                        <p
                            name="comentarios"
                            className="border h-20 overflow-y-scroll p-2 border-gray-300 w-full card text-base"
                        >{RequiAgg.comentarios}</p>
                    </div>
                </div>
            </div>
            <div className="card mt-4">
                <DataTable
                    className="custom-datatable"
                    stripedRows
                    paginator={true}
                    value={filteredData}
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
                        style={{ width: "10%", textAlign: "center" }}
                        body={(rowData) => columna_acciones(rowData)}
                    />

                </DataTable>
            </div>

        </Dialog>
    );

}

export default ModalRevisarReq