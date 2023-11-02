import { Dialog } from "primereact/dialog";
import Button from "../../../Botones/Button";
import { InputText } from "primereact/inputtext";
import useProductos from "../../../../hooks/Basicos/useProductos";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";

const ModalAgregarProducto = ({ visible, onClose, onUpload }) => {


  const { errors, setErrors, productosAgg, setProductosAgg } = useProductos()


  const btn_cambio_producto = (e) => {
    const value = e.target.value;
    setProductosAgg({ ...productosAgg, [e.target.name]: e.target.name == "nombre_producto" ? value : value.replace(/\d/g, '') });
  };

  const btn_guardar = async () => {
    // const formData = {
    //   id_producto: productosAgg.id_producto,
    //   id_empresa: productosAgg.id_empresa,
    //   id_familia: productosAgg.id_familia,
    //   id_marca: productosAgg.id_marca,
    //   id_tipo_producto: productosAgg.id_tipo_producto,
    //   referencia: productosAgg.referencia,
    //   id_unidad: productosAgg.id_unidad,
    //   nombre_producto: productosAgg.nombre_producto,
    //   precio_costo: productosAgg.precio_costo,
    //   precio_venta: productosAgg.precio_venta,
    //   critico: productosAgg.critico,
    //   inventariable: productosAgg.inventariable,
    //   compuesto: productosAgg.compuesto,
    //   ficha: productosAgg.ficha,
    //   certificado: productosAgg.certificado,
    // }
  }

  const cerrar_modal = () => {
    onClose();
    setErrors({});
  };

  const footerContent = (
    <div>
      <Button
        tipo={'PRINCIPAL'}
        funcion={btn_guardar}
      > guardar
      </Button>
    </div>
  );


  return (
    <Dialog
      header={<h1>Editar Producto</h1>}
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Referencia <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              // value={productosAgg.referencia}
              type="number"
              name="referencia"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.referencia ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_producto(e)}
            />
            {errors.referencia && (
              <div className="text-red-600 text-xs">
                {errors.referencia}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Marca <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown filter name="marca" placeholder="Seleccone una marca" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.marca && (
              <div className="text-red-600 text-xs">
                {errors.marca}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Familia <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown filter name="familia" placeholder="Seleccone la Familia del Producto" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.familia && (
              <div className="text-red-600 text-xs">
                {errors.familia}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Nombre <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              // value={productosAgg.nombre_producto}
              type="text"
              name="nombre_producto"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.nombre_producto ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_producto(e)}
            />
            {errors.nombre_producto && (
              <div className="text-red-600 text-xs">
                {errors.nombre_producto}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Unidad <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown filter name="unidad" placeholder="Seleccone la Unidad de medida" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.unidad && (
              <div className="text-red-600 text-xs">
                {errors.unidad}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Precio del Costo <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              // value={productosAgg.precio_costo}
              type="number"
              name="precio_costo"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.precio_costo ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_producto(e)}
            />
            {errors.precio_costo && (
              <div className="text-red-600 text-xs">
                {errors.precio_costo}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Precio de Venta <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              // value={productosAgg.precio_venta}
              type="number"
              name="precio_costo"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.precio_venta ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_producto(e)}
            />
            {errors.precio_venta && (
              <div className="text-red-600 text-xs">
                {errors.precio_venta}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Tipo de Producto <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown name="tipo_producto" placeholder="Seleccone" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.tipo_producto && (
              <div className="text-red-600 text-xs">
                {errors.tipo_producto}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Estado Critico <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown name="critico" placeholder="Seleccone" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.critico && (
              <div className="text-red-600 text-xs">
                {errors.critico}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Inventariable <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown name="inventariable" placeholder="Seleccone" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.inventariable && (
              <div className="text-red-600 text-xs">
                {errors.inventariable}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Compuesto <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown name="compuesto" placeholder="Seleccone" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.compuesto && (
              <div className="text-red-600 text-xs">
                {errors.compuesto}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Ficha <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown name="ficha" placeholder="Seleccone" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.ficha && (
              <div className="text-red-600 text-xs">
                {errors.ficha}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Certificado <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown name="ficha" placeholder="Seleccone" className="w-full md:w-14rem" onChange={(e) => btn_cambio_producto(e)} />
            </div>
            {errors.certificado && (
              <div className="text-red-600 text-xs">
                {errors.certificado}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Foto del Producto <span className="font-bold text-red-900">*</span>
            </label>
            <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000} onUpload={onUpload} />
          </div>

        </div>
      </div>
    </Dialog>)
}

export default ModalAgregarProducto