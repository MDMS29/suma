import { MultiSelect } from "primereact/multiselect";
import { useEffect, useState } from "react";
import { Add_Icono, Edit_Icono, Iva_Icono } from "../../../components/Icons/Iconos";
import { Button as PButton } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import Button from "../../../components/Botones/Button";
import useAuth from "../../../hooks/useAuth";
import useIva from "../../../hooks/Basicos/useIva";
import Forbidden from "../../Errors/forbidden";
import Loader from "../../../components/Loader";
import ModalAgregarIva from "../../../components/Modales/Basicos/Iva/ModalAgregarIva";


const Iva = () => {
    const columns = [
        { field: "descripcion", header: "Descripcion" },
        { field: "porcentaje", header: "Porcentaje" },
    ];

    const {
        dataIva,
        setPermisosIva,
        permisosIva,
        buscar_iva
    } = useIva();

    const { authPermisos, Permisos_DB } = useAuth();

    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(dataIva);

    const filtrar_columnas = (event) => {
        let columnas_seleccionadas = event.value;
        let columnas_ordenadas_seleccionadas = columns.filter((col) =>
            columnas_seleccionadas.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(columnas_ordenadas_seleccionadas);
    };

    const editar_iva = async (e, id_iva) => {
        e.preventDefault();
        setModalVisible(true);
        await buscar_iva(id_iva);
    };

    const buscador = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const items_filtrados = dataIva.filter((item) => {
            return (
                item.porcentaje == value ||
                item.descripcion.toLowerCase().includes(value)
                // item.porcentaje == +value
            );
        });
        setFilteredData(items_filtrados);
    };

    const cambiar_visibilidad_modal = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        setFilteredData(dataIva);
    }, [dataIva]);

    useEffect(() => {
        setTimeout(() => {
            if (authPermisos !== undefined) {
                return setPermisosIva(authPermisos);
            }
        }, 10);
    }, [authPermisos]);

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
                {permisosIva.filter(
                    (permiso) =>
                        permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                ).length > 0 && (
                        <PButton
                            tooltip="Editar"
                            tooltipOptions={{ position: "top" }}
                            className="p-button-rounded p-mr-2"
                            onClick={(e) => editar_iva(e, rowData.id_iva)}
                        >
                            {Edit_Icono}
                        </PButton>
                    )}
            </div>
        );
    };

    const main = () => (
        <div className="w-5/6">
            {modalVisible && (
                <ModalAgregarIva
                    visible={modalVisible}
                    onClose={cambiar_visibilidad_modal}
                />
            )}

            <div className="flex justify-center gap-x-4 m-2 p-3">
                <h1 className="text-3xl">IVA</h1>
                <div className="max-sm:hidden">
                    {Iva_Icono}
                </div>
            </div>
            <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
                {permisosIva.filter(
                    (permiso) =>
                        permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                ).length > 0 && (
                        <Button tipo={"PRINCIPAL"} funcion={(e) => setModalVisible(true, e)}>
                            {Add_Icono} Agregar
                        </Button>
                    )}
                <span className="p-input-icon-left sm:ml-auto md:ml-auto  lg:ml-auto  xl:ml-auto border rounded-md">
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
            {permisosIva.length === 0 ? (
                <Loader />
            ) : permisosIva.filter(
                (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
            ).length > 0 ? (
                main()
            ) : (
                <Forbidden />
            )}
        </>
    )
}

export default Iva