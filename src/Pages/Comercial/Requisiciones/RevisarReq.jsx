import React, { useRef, useState } from 'react'
import useRequisiciones from '../../../hooks/Compras/useRequisiciones';
import { Toast } from 'primereact/toast';
import { Req_Icono } from '../../../components/Icons/Iconos';
import BLink from '../../../components/Botones/BLink';
import { InputText } from 'primereact/inputtext';
import useAuth from '../../../hooks/useAuth';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';

const RevisarReq = () => {
    const toast = useRef(null);
    const { authUsuario } = useAuth()
    const { dataRequisiciones } = useRequisiciones();

    // const [visibleColumns, setVisibleColumns] = useState(columns);
    // const columns = [
    //     { field: "referencia", header: "Referencia" },
    //     { field: "nombre_producto", header: "Nombre" },
    //     { field: "marca", header: "Marca" },
    //     { field: "nombre_familia", header: "Familia" },
    //     { field: "tipo_producto", header: "Tipo Producto" },
    //     { field: "unidad", header: "Unidad Medida" },
    //     { field: "critico_con", header: "Critico" }
    // ];

    // const filtrar_columnas = (event) => {
    //     let columnas_seleccionadas = event.value;
    //     let columnas_ordenadas_seleccionadas = columns.filter((col) =>
    //         columnas_seleccionadas.some((sCol) => sCol.field === col.field)
    //     );
    //     setVisibleColumns(columnas_ordenadas_seleccionadas);
    // };

    // const header = (
    //     <MultiSelect
    //         value={visibleColumns}
    //         options={columns}
    //         optionLabel="header"
    //         onChange={filtrar_columnas}
    //         className="w-full sm:w-20rem"
    //         display="chip"
    //     />
    // );
    const main = () => (
        <div className="w-5/6">
            <Toast ref={toast} />
            <div className="flex justify-center gap-x-4 m-2 p-3">
                <h1 className="text-3xl">{`Revision Requisicion ${dataRequisiciones.requisicion}`}</h1>
                {Req_Icono}
            </div>
            <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
                {authUsuario.perfiles?.some((perfil) => perfil.id_perfil !== 46) &&
                    <>
                        <div className="h-full flex justify-center items-center">
                            <BLink tipo={"PRINCIPAL"} url={"/compras/requisiciones/agregar"}>
                                <i className="pi pi-plus mx-2 font-medium"></i>
                                Agregar
                            </BLink>
                        </div>
                        <div className="h-full flex justify-center items-center">
                            <BLink url={"/compras/requisiciones/anuladas"} tipo={"INACTIVOS"}>
                                Anulados
                            </BLink>
                        </div>
                        <div className="h-full flex justify-center items-center">
                            <BLink url={"/compras/requisiciones/aprobadas"} tipo={"APROBADO"}>
                                Aprobados
                            </BLink>
                        </div>
                    </>
                }

                <div className="h-full flex justify-center items-center">
                    <BLink url={"/compras/requisiciones/aprobadas"} tipo={"APROBADO"}>
                        Revisados
                    </BLink>
                </div>
                <div className="h-full flex justify-center items-center">
                    <BLink url={"/compras/requisiciones/anuladas"} tipo={"INACTIVOS"}>
                        Eliminados
                    </BLink>
                </div>


                <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
                    <i className="pi pi-search" />
                    <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" />
                </span>
            </div>
            <div className="card">
                {/* <DataTable
                    className="custom-datatable"
                    stripedRows
                    value={dataRequisiciones}
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
                        // body={(rowData) => columna_acciones(rowData)}
                    />
                </DataTable> */}
            </div>

        </div>
    )

    return <>{main()}</>;

}

export default RevisarReq