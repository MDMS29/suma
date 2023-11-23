import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext"
import { Add_Icono, Edit_Icono, Trash_Icono } from "../../../components/Icons/Iconos"
import BLink from "../../../components/Botones/BLink"
import useProveedores from "../../../hooks/Compras/useProveedores"
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import useAuth from "../../../hooks/useAuth";
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import { useNavigate } from "react-router-dom";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";


const Proveedores = () => {
    const toast = useRef(null);
    const navigate = useNavigate();


    const { dataProveedores, permisosProveedor, setPermisosProveedor, buscar_proveedor, proveedorState, setProveedorState, eliminar_restablecer_proveedor } = useProveedores()
    const { authPermisos, Permisos_DB, alerta, setAlerta, setVerEliminarRestaurar, verEliminarRestaurar } = useAuth()

    const columns = [
        { field: "nombre", header: "Nombre" },
        { field: "tipo_doc", header: "Tipo Doc." },
        { field: "documento", header: "Documento" },
        { field: "telefono", header: "Telefono" },
        { field: "correo", header: "Correo" }
    ];
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [filteredData, setFilteredData] = useState(dataProveedores);

    const buscador = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const items_filtrados = dataProveedores.filter((item) => {
            return (
                item.nombre.toLowerCase().includes(value) ||
                item.tipo_doc.toLowerCase().includes(value) ||
                item.documento.includes(value) ||
                item.telefono.includes(value) ||
                item.correo.toLowerCase().includes(value)
            )
        });
        setFilteredData(items_filtrados);
    };

    const filtrar_columnas = (event) => {
        let columnas_seleccionadas = event.value;
        let columnas_ordenadas_seleccionadas = columns.filter((col) =>
            columnas_seleccionadas.some((sCol) => sCol.field === col.field)
        );
        setVisibleColumns(columnas_ordenadas_seleccionadas);
    };

    const editar_proveedores = async (e, id_proveedor) => {
        e.preventDefault();
        navigate("/compras/requisiciones/agregar");
        await buscar_proveedor(id_proveedor);
    };

    const modal_eliminar_proveedor = (e, proveedor) => {
        e.preventDefault();
        setProveedorState(proveedor);
        setVerEliminarRestaurar(true);
    };

    useEffect(() => {
        setFilteredData(dataProveedores);
    }, [dataProveedores]);

    useEffect(() => {
        setTimeout(() => {
            if (authPermisos !== undefined) {
                return setPermisosProveedor(authPermisos);
            }
        }, 10);
    }, [authPermisos]);

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
                {permisosProveedor.filter(
                    (permiso) =>
                        permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                ).length > 0 && (
                        <PButton
                            tooltip="Editar"
                            tooltipOptions={{ position: "top" }}
                            className="p-button-rounded p-mr-2"
                            onClick={(e) => editar_proveedores(e, rowData.id_proveedor)}
                        >
                            {Edit_Icono}
                        </PButton>
                    )}
                {permisosProveedor.filter(
                    (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.BORRAR
                ).length > 0 && (
                        <PButton
                            tooltip="Eliminar"
                            className="p-button-rounded p-button-danger p-mr-2"
                            tooltipOptions={{ position: "top" }}
                            onClick={(e) => modal_eliminar_proveedor(e, rowData)}
                        >
                            {Trash_Icono}
                        </PButton>
                    )}
            </div>
        );
    };

    const main = () => (
        <div className="w-5/6">
            {verEliminarRestaurar && (
                <EliminarRestaurar
                    tipo={"ELIMINAR"}
                    funcion={(e) =>
                        eliminar_restablecer_proveedor(proveedorState.id_proveedor, e)
                    }
                />
            )}
            <div className="flex justify-center gap-x-4 m-2 p-3">
                <h1 className="text-3xl">Proveedores</h1>
                <i className="pi pi-users" style={{ fontSize: "2rem" }}></i>
            </div>
            <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
                {permisosProveedor.filter(
                    (permiso) =>
                        permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                ).length > 0 && (
                        <BLink
                            tipo={"PRINCIPAL"}
                            url={"/compras/proveedores/agregar"}
                        >
                            {Add_Icono} Agregar
                        </BLink>
                    )}

                {permisosProveedor.filter(
                    (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
                ).length > 0 && (
                        <div className="h-full flex justify-center items-center">
                            <BLink tipo={"INACTIVOS"} url={"/compras/proveedores/inactivos"}>
                                Inactivos
                            </BLink>
                        </div>
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
    )

    return (
        <>
            {permisosProveedor.length === 0 ? (
                <Loader />
            ) : permisosProveedor.filter(
                (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
            ).length > 0 ? (
                main()
            ) : (
                <Forbidden />
            )}
        </>
    );
}

export default Proveedores