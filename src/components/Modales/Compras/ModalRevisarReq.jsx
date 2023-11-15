import { useEffect, useState } from 'react'
import useRequisiciones from '../../../hooks/Compras/useRequisiciones';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Dialog } from 'primereact/dialog';
import Button from '../../Botones/Button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import useProcesos from '../../../hooks/Basicos/useProcesos';
import { Mention } from 'primereact/mention';
import { check_Icono, x_Icono } from '../../Icons/Iconos';

const ModalRevisarReq = ({ visible, onClose }) => {
    const {
        dataRequisiciones,
        RequiAgg,
        centroCostoAgg,
        filtar_tipo_requ,
        obtener_centro_costo,
        productosData,
        tipoRequiAgg,
        obtener_tipo_requisicion,
        revisar_requisicion } = useRequisiciones();

    const { dataProcesos, obtener_procesos } = useProcesos();
    console.log(RequiAgg);

    const columns = [
        { field: "nombre_producto", header: "Producto" },
        { field: "unidad", header: "Unidad" },
        { field: "cantidad", header: "Cantidad" },
        { field: "justificacion", header: "Justificación" },
    ];

    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [filteredData, setFilteredData] = useState(productosData);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);

    useEffect(() => {
        setProductosSeleccionados(productosData)
    }, [])
    console.log(productosSeleccionados);

    const filtrar_columnas = (event) => {
        let columnas_seleccionadas = event.value;
        let columnas_ordenadas_seleccionadas = columns.filter((col) =>
            columnas_seleccionadas.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(columnas_ordenadas_seleccionadas);
    };

    const guardar_lista = () => {
        revisar_requisicion()
    }
    console.log(RequiAgg);

    // const btn_producto_seleccionado = (rowData) => {
    //     const producto_id = rowData;
    //     if (productosSeleccionados.find(producto => producto.id_producto == producto_id)) {
    //         const [producto] = productosSeleccionados.filter(producto => producto.id_producto == producto_id)
    //         if (producto.id_estado == 1) {
    //             producto.id_estado = 2
    //         } else {
    //             producto.id_estado = 1
    //         }

    //         const perfiles = productosSeleccionados.filter(producto => producto.id_producto !== producto_id)
    //         productosSeleccionados(perfiles)

    //     } else {
    //         setProductosSeleccionados([...productosSeleccionados, { id_perfil: perfil_id, estado_perfil: 1 }])

    //     }
    // }

    const btn_producto = (id_producto) => {

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
        <div className=''>
            <div className='flex gap-3 m-3 items-center'>
                <span>Aprobar todo</span>
                <label
                    className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full bg-gray-300
                    }`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"

                    />
                    <span
                        className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                </label>

                <span className='ml-5'>Rechazar todo</span>
                <label
                    className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full bg-gray-300
                    }`}>
                    <input
                        type="checkbox"
                        className="sr-only peer"

                    />
                    <span
                        className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
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
        </div>
    );

    const footerContent = (
        <div className="mt-3">
            <Button
                tipo={'PRINCIPAL'}
                funcion={guardar_lista}
            > Revisar
            </Button>
        </div>
    );

    return (
        <Dialog
            header={<h1>Revision Requisicion <label className='font-mono text-2xl'>{RequiAgg.consecutivo}</label> </h1>}
            visible={visible}
            onHide={onClose}
            className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
            footer={footerContent}
            maximizable
        >
            <div className="flex flex-col pt-3 flex-wrap sm:w-full">
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Procesos</label>
                        <p
                            name="id_proceso"
                            className="w-full px-2 text-base"
                        >{RequiAgg.proceso}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Centro de Costos</label>
                        <p
                            name="id_centro"
                            className="w-full px-2 text-base"
                        >{RequiAgg.centro}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Fecha</label>
                        <Calendar
                            value={RequiAgg.fecha_requisicion}
                            name="fecha_requisicion"
                            showIcon
                            minDate={new Date()}
                            disabled
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-600 pb-2 font-semibold">Tipo de Requisiciones</label>
                        <p
                            name="id_tipo_producto"
                            className="w-full px-2 text-base"
                        >{RequiAgg.tipo_productos}</p>
                    </div>
                    <div className="flex flex-col col-span-2">
                        <label className="text-gray-600 pb-2 font-semibold">Observaciones</label>
                        <Mention
                            value={RequiAgg.comentarios}
                            name="comentarios"
                            disabled
                            className="w-full card pl-2 pt-2 border-gray-300"
                        />
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
                        style={{ width: "10%" }}
                        header='Opciones'
                        body={(rowData) =>
                        (<div className="flex justify-around">
                            <button >
                                {check_Icono}
                            </button>
                            <button >
                                {x_Icono}
                            </button>
                        </div>)
                        }
                    />

                </DataTable>
            </div>

        </Dialog>
    );

}

export default ModalRevisarReq