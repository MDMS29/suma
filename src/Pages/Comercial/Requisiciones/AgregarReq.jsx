import { useState } from "react";
import {
  Edit_Icono,
  Req_Icono,
  Trash_Icono,
} from "../../../components/Icons/Iconos";
import { InputText } from "primereact/inputtext";
import BLink from "../../../components/Botones/BLink";
import { Dropdown } from "primereact/dropdown";
import Button from "../../../components/Botones/Button";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { Mention } from "primereact/mention";
import useProcesos from "../../../hooks/Basicos/useProcesos";
import useRequisiciones from "../../../hooks/Compras/useRequisiciones";
import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button as PButton } from "primereact/button";
import EliminarRestaurar from "../../../components/Modales/EliminarRestaurar";
import useAuth from "../../../hooks/useAuth";

import { genLlaveAleatoria } from "../../../helpers/utils";

const AgregarReq = () => {
  const columns = [
    { field: "nombre_producto", header: "Producto" },
    { field: "unidad", header: "Unidad" },
    { field: "cantidad", header: "Cantidad" },
    { field: "justificacion", header: "Justificación" },
  ];

  const {
    RequiAgg,
    setRequiAgg,
    obtener_centro_costo,
    centroCostoAgg,
    tipoRequiAgg,
    obtener_tipo_requisicion,
    filtar_tipo_requ,
    productos,
    guardar_requisiciones,
    eliminar_lista_producto,
    productosData,
    setProductosData,
    setProductoState,
    productoState,
  } = useRequisiciones();

  const { verEliminarRestaurar, authUsuario, setVerEliminarRestaurar } =
    useAuth();
  const { obtener_procesos, dataProcesos } = useProcesos();
  const [filteredData, setFilteredData] = useState(productosData);
  const [visibleColumns, setVisibleColumns] = useState(columns);
  const [editing, setEditing] = useState(false);
  const [counterId, setCounterId] = useState(1);

  const [detalle, setDetalle] = useState({
    id: 0,
    id_detalle: 0,
    id_unidad: 0,
    id_producto: 0,
    cantidad: "",
    justificacion: "",
  });

  useEffect(() => {
    setFilteredData(productosData);

    if (RequiAgg.id_proceso != 0) {
      obtener_centro_costo(RequiAgg.id_proceso);
    }
    if (RequiAgg.id_tipo_producto != 0) {
      filtar_tipo_requ(RequiAgg.id_tipo_producto);
    }
  }, [productosData]);

  const btn_cambio = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setRequiAgg({ ...RequiAgg, [e.target.name]: e.target.value });
    if (name === "id_proceso") {
      //ENVIAR POR PARAMETROS DEL ID DEL PROCESO
      obtener_centro_costo(e.target.value);
    }
    if (name === "id_centro") {
      const centro = centroCostoAgg.filter(
        (centro) => centro.id_centro == e.target.value
      )[0]?.consecutivo_centro;

      RequiAgg.consecutivo = centro;
    }
    if (name === "id_tipo_producto") {
      //ENVIAR EL ID DEL TIPO DE PRODUCTO POR PARAMETRO
      filtar_tipo_requ(e.target.value);
    }
    if (name === "fecha_requisicion") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Establecer horas a 0 para comparar solo las fechas

      if (selectedDate < currentDate) {
        console.error(
          "No se pueden seleccionar fechas anteriores al día de hoy"
        );
        return;
      }

      // Formatea la fecha como "dd/mm/yy"
      const formattedDate =
        ("0" + selectedDate.getDate()).slice(-2) +
        "-" +
        ("0" + (selectedDate.getMonth() + 1)).slice(-2) +
        "-" +
        selectedDate.getFullYear().toString().slice(-2);

      setRequiAgg({ ...RequiAgg, [name]: formattedDate });
    } else {
      setRequiAgg({ ...RequiAgg, [name]: value });
    }
  };

  useEffect(() => {
    obtener_procesos();
    obtener_tipo_requisicion();
  }, []);

  const filtar_detalle = (e) => {
    const { name, value } = e.target;

    setDetalle((prevDetalle) => {
      let updatedDetalle = {
        ...prevDetalle,
        [name]: name === "cantidad" ? +value : value,
      };
      if (name === "id_producto") {
        const productoSeleccionado = productos.find(
          (producto) => producto.id_producto === +value
        );
        if (productoSeleccionado) {
          updatedDetalle = {
            ...updatedDetalle,
            id_detalle: counterId,
            id_producto: productoSeleccionado.id_producto,
            nombre_producto: productoSeleccionado.nombre_producto,
            id_unidad: productoSeleccionado.id_unidad,
            unidad: productoSeleccionado.unidad,
          };
        }
      }
      return updatedDetalle;
    });
  };

  const guardar_producto = (e) => {
    e.preventDefault();
    if (detalle.id_producto && detalle.cantidad && detalle.justificacion) {
      if (editing) {
        // const index = productosData.findIndex(
        //   (item) => item.id_detalle === detalle.id_detalle
        // );
        // if (index !== -1) {
        // const updatedData = [...productosData];
        // updatedData[index] = {
        //   ...updatedData[index],
        //   ...detalle,
        // };
        console.log('detalle',detalle)

        const productos_actualizados = productosData.map((producto) =>
          producto.id_detalle === detalle.id_detalle ? detalle : producto
        );
        console.log('actualizados', productos_actualizados)

        setProductosData(productos_actualizados);
        // }
        //
        setEditing(false);
      } else {
        // Agrega un nuevo detalle
        setProductosData((prevData) => [
          ...prevData,
          { ...detalle, id_detalle: genLlaveAleatoria() },
        ]);
        // setCounterId((prev) => prev + 1);
      }

      setDetalle({
        id_unidad: 0,
        id_detalle: 0,
        id_producto: 0,
        nombre_producto: "",
        cantidad: 0,
        justificacion: "",
      });
    } else {
      console.error("Por favor, complete todos los campos requeridos");
    }
  };

  const editar_lista_producto = (rowData) => {
    setEditing(true);

    console.log(rowData.id_detalle)
    // Llena los campos de entrada con el detalle seleccionado
    setDetalle({
      id_detalle: rowData.id_detalle,
      id_unidad: rowData.id_unidad,
      id_producto: rowData.id_producto,
      nombre_producto: rowData.nombre_producto,
      unidad: rowData.unidad,
      cantidad: rowData.cantidad,
      justificacion: rowData.justificacion,
    });
  };

  const filtrar_columnas = (event) => {
    let columnas_seleccionadas = event.value;
    let columnas_ordenadas_seleccionadas = columns.filter((col) =>
      columnas_seleccionadas.some((sCol) => sCol.field === col.field)
    );
    setVisibleColumns(columnas_ordenadas_seleccionadas);
  };

  const guardar_requi = async (rowData) => {
    try {
      const formData = {
        id_empresa: authUsuario.id_empresa,
        id_proceso: RequiAgg.id_proceso,
        id_centro: RequiAgg.id_centro,
        id_tipo_producto: RequiAgg.id_tipo_producto,
        consecutivo: RequiAgg.consecutivo,
        fecha_requisicion: RequiAgg.fecha_requisicion,
        comentarios: RequiAgg.comentarios,
        equipo: RequiAgg.equipo,
        det_requisicion: productosData,
      };
      const exito = await guardar_requisiciones(formData);
      console.log(formData);

      if (exito) {
        // Realiza acciones adicionales si es necesario después de guardar
        console.log("Requisición guardada con éxito");
      } else {
        // Manejo de errores si la requisición no se guardó correctamente
        console.error("Error al guardar la requisición");
      }
    } catch (error) {
      console.error("Error al guardar la requisición:", error);

      if (error.response) {
        console.error("Detalles del error:", error.response.data);
      }
    }
  };

  const eliminar_producto = (e, producto) => {
    e.preventDefault();
    setProductoState(producto);
    setVerEliminarRestaurar(true);
  };

  //FUNCION QUE SE ACTIVA EN EL MODAL
  const eliminar_producto_table = () => {
    if (typeof productoState.id_detalle == "string") {
      //ESTE NO ESTA EN LA BASE DE DATOS
      const productos_filtrados = productosData.filter(
        (producto) => producto.id_detalle !== productoState.id_detalle
      );
      setProductosData(productos_filtrados);
    } else {
      //ESTA EN LA BASE DE DATOS
      const productos_actualizado = productosData.map((producto) =>
        producto.id_detalle === productoState.id_detalle
          ? (productoState.id_estado = 2)
          : producto
      );
      setProductosData(productos_actualizado);
    }

    setVerEliminarRestaurar(false);

    setDetalle({
      id: 0,
      id_unidad: 0,
      id_detalle: 0,
      id_producto: 0,
      nombre_producto: "",
      cantidad: 0,
      justificacion: "",
    });
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

  const columna_acciones = (rowData) => {
    return (
      <div className="text-center flex gap-x-3">
        <PButton
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          className="p-button-rounded p-mr-2"
          onClick={() => editar_lista_producto(rowData)}
        >
          {Edit_Icono}
        </PButton>
        <PButton
          tooltip="Eliminar"
          className="p-button-rounded p-button-danger p-mr-2"
          tooltipOptions={{ position: "top" }}
          onClick={(e) => eliminar_producto(e, rowData)}
        >
          {Trash_Icono}
        </PButton>
      </div>
    );
  };

  const main = () => (
    <>
      {verEliminarRestaurar && (
        <EliminarRestaurar
          tipo={"ELIMINAR"}
          funcion={(e) => eliminar_producto_table(e)}
        />
      )}
      <div className="w-5/6">
        <div className="flex justify-center gap-x-4 m-2 p-3">
          <h1 className="text-3xl">Agregar Requisiciones</h1>
          {Req_Icono}
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full flex flex-wrap gap-3">
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
          <div className="h-full flex justify-center items-center">
            <BLink url={"/compras/requisiciones"} tipo={"PENDIENTE"}>
              Pendientes
            </BLink>
          </div>
          <span className="p-input-icon-left sm:ml-auto md:ml-auto lg:ml-auto xl:ml-auto border rounded-md">
            <i className="pi pi-search" />
            <InputText className="h-10 pl-8 rounded-md" placeholder="Buscar" />
          </span>
        </div>
        <div className="bg-white border my-3 p-3 rounded-sm w-full">
          <div className="gap-x-4 m-2 p-3 flex flex-wrap gap-3">
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Procesos <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <Dropdown
                  disabled={RequiAgg.id_requisicion !== 0 && true}
                  value={RequiAgg.id_proceso}
                  onChange={(e) => btn_cambio(e)}
                  options={dataProcesos}
                  name="id_proceso"
                  optionLabel="proceso"
                  optionValue="id_proceso"
                  placeholder="Seleccione un Proceso"
                  filter
                  className="w-72 md:w-14rem"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Centro de Costos{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <Dropdown
                  disabled={RequiAgg.id_requisicion !== 0 && true}
                  value={RequiAgg.id_centro}
                  onChange={(e) => btn_cambio(e)}
                  options={centroCostoAgg}
                  name="id_centro"
                  optionLabel="centro_costo"
                  optionValue="id_centro"
                  placeholder="Seleccione un centro de Costos"
                  filter
                  className="w-72 md:w-14rem"
                />
              </div>
            </div>
            <div className="flex flex-col max-sm:col-span-2 max-lg:col-span-2">
              <label className="text-gray-600 pb-2 font-semibold">
                Fecha <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full h-10">
                <Calendar
                  value={RequiAgg.fecha_requisicion}
                  onChange={(e) => btn_cambio(e)}
                  name="fecha_requisicion"
                  showIcon
                  className="px-2 w-72 text-gray-500"
                  minDate={new Date()}
                />
              </div>
            </div>
            <div
              hidden={RequiAgg.id_requisicion == 0 && true}
              className="flex flex-col max-sm:col-span-2 max-lg:col-span-2"
            >
              <label className="text-gray-600 pb-2 font-semibold">
                No. Requisición{" "}
              </label>
              <div className="card flex justify-content-center w-full h-10 bg-gray-100">
                <InputText
                  value={RequiAgg.consecutivo}
                  className="bg-gray-100 w-72 px-2"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="gap-x-4 m-2 p-3 gap-3">
              <label className="text-gray-600 pb-2 font-semibold">
                Tipo de Requisiciones{" "}
                <span className="font-bold text-red-900">*</span>
              </label>
              <div className="card flex justify-content-center w-full">
                <Dropdown
                  disabled={RequiAgg.id_requisicion !== 0 && true}
                  value={RequiAgg.id_tipo_producto}
                  onChange={(e) => btn_cambio(e)}
                  options={tipoRequiAgg}
                  name="id_tipo_producto"
                  optionLabel="descripcion"
                  optionValue="id_tipo_producto"
                  placeholder="Seleccione Tipo de Requisición"
                  filter
                  className="md:w-14rem w-72"
                />
              </div>
            </div>
          </div>
          {RequiAgg.id_tipo_producto != 0 && (
            <div className="gap-x-4 m-2 p-3 flex flex-wrap gap-3">
              <div className="gap-x-4 gap-3">
                <label className="text-gray-600 pb-2 font-semibold">
                  Producto <span className="font-bold text-red-900">*</span>
                </label>
                <div className="card flex justify-content-center w-full">
                  <Dropdown
                    value={detalle.id_producto}
                    onChange={(e) => filtar_detalle(e)}
                    options={productos}
                    name="id_producto"
                    optionLabel="nombre_producto"
                    optionValue="id_producto"
                    placeholder="Seleccione"
                    filter
                    className="md:w-14rem w-72"
                  />
                </div>
              </div>
              <div className="gap-x-4 gap-3">
                <label className="text-gray-600 pb-2 font-semibold">
                  Unidad
                </label>
                <div className="card flex justify-content-center w-full h-10 bg-gray-100">
                  <InputText
                    value={detalle.unidad || ""}
                    name="id_unidad"
                    onChange={(e) => filtar_detalle(e)}
                    className="bg-gray-100 p-2 w-72"
                    disabled
                  />
                </div>
              </div>
              <div className="gap-x-4 gap-3">
                <label className="text-gray-600 pb-2 font-semibold">
                  Cantidad <span className="font-bold text-red-900">*</span>
                </label>
                <div className="card flex justify-content-center w-full h-10">
                  <InputText
                    value={detalle.cantidad}
                    onChange={(e) => filtar_detalle(e)}
                    name="cantidad"
                    type="number"
                    className="h-10 p-2 w-72"
                  />
                </div>
              </div>
              <div className="gap-x-4 gap-3">
                <label className="text-gray-600 pb-2 font-semibold">
                  Justificación{" "}
                  <span className="font-bold text-red-900">*</span>
                </label>
                <div className="card flex justify-content-center w-full h-10">
                  <InputText
                    value={detalle.justificacion}
                    name="justificacion"
                    onChange={(e) => filtar_detalle(e)}
                    className="h-10 p-2 w-72"
                  />
                </div>
              </div>
              <div className="mt-9">
                <Button tipo={"PRINCIPAL"} funcion={(e) => guardar_producto(e)}>
                  Guardar Producto
                </Button>
              </div>
            </div>
          )}
          <div className="card m-3">
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
                body={(rowData) => columna_acciones(rowData)}
              />
            </DataTable>
          </div>
          <div className="p-2 m-2">
            <label className="text-gray-600 pb-2 font-semibold">
              Observaciones <span className="font-bold text-red-900">*</span>
            </label>
            <Mention
              value={RequiAgg.comentarios}
              onChange={(e) => btn_cambio(e)}
              name="comentarios"
              className="w-full card border-gray-300"
            />
          </div>
          <div className="p-2 m-2">
            <Button tipo={"PRINCIPAL"} funcion={guardar_requi}>
              {RequiAgg.id_requisicion !== 0 ? "Actualizar" : "Guardar"}
            </Button>
            {/* no sirve */}
          </div>
        </div>
      </div>
    </>
  );
  return <>{main()}</>;
};

export default AgregarReq;
