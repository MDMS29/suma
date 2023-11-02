import { Button as PButton } from "primereact/button";
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useRef, useState } from 'react'
import { Edit_Icono, Producto_Icono, Trash_Icono } from '../../../components/Icons/Iconos';
import Loader from "../../../components/Loader";
import Forbidden from "../../Errors/forbidden";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import Button from "../../../components/Botones/Button";
import BLink from "../../../components/Botones/BLink";
import useProductos from "../../../hooks/Basicos/useProductos";
import useAuth from "../../../hooks/useAuth";
import ModalAgregarProducto from "../../../components/Modales/Basicos/Productos/ModalAgregarProducto";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";

const Productos = () => {
    const toast = useRef(null);

    const columns = [
        { field: "referencia", header: "referencia" },
        { field: "marca", header: "Marca" },
        { field: "nombre_familia", header: "Familia" },
        { field: "nombre_producto", header: "Descripcion" },
        { field: "unidad", header: "Unidad" },
        { field: "precio_costo", header: "Costo" },
        { field: "precio_venta", header: "Venta" },
        { field: "tipo_producto", header: "Tipo de producto" },
        { field: "critico_con", header: "Producto Critico" },
        { field: "inventariable_con", header: "Inventariable" },
        { field: "compuesto_con", header: "Producto Compuesto" },
        { field: "ficha_con", header: "Ficha" },
        { field: "certificado_con", header: "Certificado" }
    ];

    const { permisosProductos, setPermisosProductos, dataProductos, buscar_producto, setProductoState, productoState, eliminar_restablecer_producto } = useProductos()
    const { authPermisos, Permisos_DB, alerta, setAlerta, setVerEliminarRestaurar, verEliminarRestaurar } = useAuth();

    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState(dataProductos);
    const [modalVisible, setModalVisible] = useState(false);

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
                item.referencia.toLowerCase().includes(value) ||
                item.id_marca.toLowerCase().includes(value) ||
                item.familia.toLowerCase().includes(value) ||
                item.nombre_producto.toLowerCase().includes(value) ||
                item.unidad.toLowerCase().includes(value) ||
                item.precio_costo.toLowerCase().includes(value) ||
                item.precio_venta.toLowerCase().includes(value) ||
                item.tipo_producto.toLowerCase().includes(value) ||
                item.compuesto.toLowerCase().includes(value) ||
                item.ficha.toLowerCase().includes(value) ||
                item.certificado.toLowerCase().includes(value) ||
                item.estado.toLowerCase().includes(value)
            );
        });
        setFilteredData(items_filtrados);
    };

    const editar_producto = async (e, id_producto) => {
        e.preventDefault();
        setModalVisible(true);
        await buscar_producto(id_producto);
    };

    const modal_eliminar_producto = (e, producto) => {
        e.preventDefault();
        setProductoState(producto);
        setVerEliminarRestaurar(true);
    };

    function formatMoney(number) {
        const roundedNumber = parseFloat(number).toFixed(2);
        const formattedMoney = `$${roundedNumber}`;
        return formattedMoney;
    }

    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'Subido con exito' });
    };

    const cambiar_visibilidad_modal = () => {
        setModalVisible(!modalVisible);
    };

    useEffect(() => {
        setFilteredData(dataProductos);
    }, [dataProductos]);

    useEffect(() => {
        setTimeout(() => {
            if (authPermisos !== undefined) {
                return setPermisosProductos(authPermisos);
            }
        }, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authPermisos]);

    //MOSTRAR ALERTA
    useEffect(() => {
        if (alerta.show) {
            const show_alert = () => {
                toast.current.show({
                    severity: alerta.error ? 'error' : 'success',
                    detail: alerta.message,
                    life: 1500,
                });
                setTimeout(() => setAlerta({}), 1500);
            };
            show_alert();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <div className="p-frozen">
                <div className="text-center flex gap-x-3">
                    {permisosProductos.filter(
                        (permiso) =>
                            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                    ).length > 0 && (
                            <PButton
                                tooltip="Editar"
                                tooltipOptions={{ position: "top" }}
                                className="p-button-rounded p-mr-2"
                                onClick={e => editar_producto(e, rowData.id_producto)}
                            >{Edit_Icono}</PButton>
                        )}

                    {permisosProductos.filter(
                        (permiso) =>
                            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                    ).length > 0 && (
                            <PButton
                                tooltip="Eliminar"
                                tooltipOptions={{ position: "top" }}
                                className="p-button-rounded p-mr-2"
                                onClick={e => modal_eliminar_producto(e, rowData)}
                            >{Trash_Icono}</PButton>
                        )}
                </div>
            </div>
        );
    };

    const main = () => (
        <>
            <div className="w-5/6">
                <Toast ref={toast} />

                {modalVisible && <ModalAgregarProducto visible={modalVisible} onClose={cambiar_visibilidad_modal} onUpload={onUpload} />}
                {verEliminarRestaurar && <EliminarRestaurar tipo={'ELIMINAR'} funcion={e => eliminar_restablecer_producto(productoState.id_producto, e)} />}

                <div className="flex justify-center gap-x-4 m-2 p-3">
                    <h1 className="text-3xl">Productos</h1>
                    {Producto_Icono}
                </div>
                <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
                    {permisosProductos.filter(
                        (permiso) =>
                            permiso.permiso.toLowerCase() === Permisos_DB.CREAR_EDITAR
                    ).length > 0 && (
                            <Button
                                tipo={'PRINCIPAL'}
                                funcion={(e) => setModalVisible(true, e)}
                            >
                                <i className="pi pi-plus mx-2 font-medium"></i>
                                Agregar
                            </Button>
                        )}
                    {permisosProductos.filter(
                        (permiso) => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR
                    ).length > 0 && (
                            <div className="h-full flex justify-center items-center">
                                <BLink
                                    tipo={'INACTIVOS'}
                                    url="/basicos/productos/inactivos"
                                >
                                    Inactivos
                                </BLink>
                            </div>
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
                        scrollable
                        scrollHeight="400px"
                        tableStyle={{ minWidth: "50rem" }}
                    >
                        {visibleColumns.map((col) => (
                            <Column key={col.field} field={col.field} header={col.header}
                                body={col.field === 'precio_costo' || col.field === "precio_venta" ? (rowData) => formatMoney(rowData[col.field]) : null}
                            />))}

                        <Column
                            header="Foto"
                            key="foto"
                            style={{ width: "10%" }}
                            body={(rowData) => <img className="h-24 w-24" src={rowData.foto_con} />}
                        />
                        <Column
                            key="actions"
                            style={{ width: "10%" }}
                            body={(rowData) => columna_acciones(rowData)}
                            frozen
                            alignFrozen="right"
                        />
                    </DataTable>
                </div>
            </div>
        </>
    );


    return (
        <>
            {
                permisosProductos.length === 0 ?
                    (<Loader />) :
                    (permisosProductos.filter(permiso => permiso.permiso.toLowerCase() === Permisos_DB.CONSULTAR).length > 0
                        ?
                        (main())
                        :
                        (<Forbidden />))
            }
        </>
    )
}

export default Productos