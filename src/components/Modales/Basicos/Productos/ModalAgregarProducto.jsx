import { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import Button from "../../../Botones/Button";
import { InputText } from "primereact/inputtext";
import useProductos from "../../../../hooks/Basicos/useProductos";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";

import useMarcas from "../../../../hooks/Basicos/useMarcas";
import useFamiliaProd from "../../../../hooks/Basicos/useFamiliaProd";
import useUnidades from "../../../../hooks/Basicos/useUnidades";
import useTipoProd from "../../../../hooks/Basicos/useTipoProd";
import useAuth from "../../../../hooks/useAuth";

const ModalAgregarProducto = ({ visible, onClose, onUpload }) => {

  const { errors, setErrors, productosAgg, setProductosAgg, editar_producto, guardar_producto } = useProductos()
  const { dataMarcas, obtener_marcas } = useMarcas()
  const { dataFliaPro, obtener_familia_prod } = useFamiliaProd()
  const { dataUnidades, obtener_unidades } = useUnidades()
  const { dataTipoProf, obtener_tipo_producto } = useTipoProd()
  const { authUsuario } = useAuth()


  const btn_cambio_producto = (e) => {
    console.log(e.target.name);
    const value = e.target.value;
    setProductosAgg({ ...productosAgg, [e.target.name]: e.target.name == "descripcion" ? value.replace(/\d/g, '') : value });
  };

  const campos_vacios = () => {
    setProductosAgg({
      id_empresa: authUsuario.id_empresa,
      id_producto: 0,
      id_familia: 0,
      id_marca: 0,
      id_tipo_producto: 0,
      referencia: 0,
      id_unidad: 0,
      descripcion: "",
      foto: "",
      precio_costo: "",
      precio_venta: "",
      critico: false,
      inventariable: false,
      compuesto: false,
      ficha: false,
      certificado: false,
    });
  }

  const btn_guardar = async () => {
    const formData = {
      id_empresa: authUsuario.id_empresa,
      id_producto: productosAgg.id_producto,
      id_familia: productosAgg.id_familia,
      id_marca: productosAgg.id_marca,
      id_tipo_producto: productosAgg.id_tipo_producto,
      referencia: +productosAgg.referencia,
      id_unidad: productosAgg.id_unidad,
      descripcion: productosAgg.descripcion,
      precio_costo: +productosAgg.precio_costo,
      precio_venta: +productosAgg.precio_venta,
      critico: Boolean(productosAgg.critico),
      inventariable: Boolean(productosAgg.inventariable),
      compuesto: Boolean(productosAgg.compuesto),
      ficha: Boolean(productosAgg.ficha),
      certificado: Boolean(productosAgg.certificado),
      foto: "fotasa"
    }

    const errors = {};
    const regex = /^[a-zA-Z0-9\s]*$/;
    const codRegex = /^[0-9]*$/;

    if (!productosAgg.referencia) {
      errors.referencia = "La referencia es obligatoria";
    } else if (!codRegex.test(productosAgg.referencia)) {
      errors.referencia = "La referencia debe contener solo dígitos";
    }

    if (!regex.test(productosAgg.descripcion)) {
      errors.descripcion = "No se permiten caracteres especiales";
    } else if (productosAgg.descripcion.trim() === '') {
      errors.descripcion = "El Nombre es obligatorio";
    }

    if (productosAgg.id_marca == 0) {
      errors.marca = "Seleccione una opcion";

    }
    if (productosAgg.id_familia == 0) {
      errors.familia = "Seleccione una opcion";

    }
    if (productosAgg.id_tipo_producto == 0) {
      errors.tipo_producto = "Seleccione una opcion";

    }
    if (productosAgg.id_unidad == 0) {
      errors.unidad = "Seleccione una opcion";

    }
    if (productosAgg.precio_costo == 0) {
      errors.precio_costo = "El Precio Costo es obligatorio";

    }
    if (productosAgg.precio_venta == 0) {
      errors.precio_venta = "El Precio Venta es obligatorio";
      setErrors(errors);
      return
    }

    try {
      let response
      if (productosAgg.id_producto !== 0) {
        response = await editar_producto(formData)
      } else {
        response = await guardar_producto(formData);
      }

      if (response) {
        onClose();
        campos_vacios()
      }
    } catch (error) {
      // Maneja los errores si ocurren
      console.error("Error al guardar el usuario:", error.response.data.message);
    }

  }

  const cerrar_modal = () => {
    campos_vacios()
    onClose();
    setErrors({});
  };

  useEffect(() => {
    obtener_marcas()
    obtener_familia_prod()
    obtener_unidades()
    obtener_tipo_producto()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const footerContent = (
    <div className="mt-3">
      <Button
        tipo={'PRINCIPAL'}
        funcion={btn_guardar}
      > {productosAgg.id_producto !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );

  return (
    <Dialog
      header={productosAgg.id_producto !== 0 ? <h1>Editar Producto</h1> : <h1>Agregar Producto</h1>}
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
              value={productosAgg.referencia}
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
              Nombre <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={productosAgg.descripcion}
              type="text"
              name="descripcion"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.descripcion ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_producto(e)}
            />
            {errors.descripcion && (
              <div className="text-red-600 text-xs">
                {errors.descripcion}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Marca <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown
                value={productosAgg.id_marca} onChange={(e) => btn_cambio_producto(e)} options={dataMarcas}
                name="id_marca"
                optionLabel="marca"
                optionValue="id_marca"
                placeholder="Seleccione"
                filter className="w-full md:w-14rem"
              />
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
              <Dropdown value={productosAgg.id_familia} onChange={(e) => btn_cambio_producto(e)} options={dataFliaPro}
                name="id_familia"
                optionLabel="descripcion"
                optionValue="id_familia"
                placeholder="Seleccione"
                filter className="w-full md:w-14rem"
              />
            </div>
            {errors.familia && (
              <div className="text-red-600 text-xs">
                {errors.familia}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Tipo Producto <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown value={productosAgg.id_tipo_producto} onChange={(e) => btn_cambio_producto(e)} options={dataTipoProf}
                name="id_tipo_producto"
                optionLabel="descripcion"
                optionValue="id_tipo_producto"
                placeholder="Seleccione"
                filter className="w-full md:w-14rem" />
            </div>
            {errors.tipo_producto && (
              <div className="text-red-600 text-xs">
                {errors.tipo_producto}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Unidad Medida <span className="font-bold text-red-900">*</span>
            </label>
            <div className="card flex justify-content-center">
              <Dropdown value={productosAgg.id_unidad} onChange={(e) => btn_cambio_producto(e)} options={dataUnidades}
                name="id_unidad"
                optionLabel="unidad"
                optionValue="id_unidad"
                placeholder="Seleccione"
                filter className="w-full md:w-14rem" />
            </div>
            {errors.unidad && (
              <div className="text-red-600 text-xs">
                {errors.unidad}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Precio Costo <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={productosAgg.precio_costo}
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
              Precio Venta <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={productosAgg.precio_venta}
              type="number"
              name="precio_venta"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 col-span-2 gap-4 p-2 border rounded-md">
            <div className="flex gap-3 justify-between items-center">
              <label className="text-gray-600 pb-2 font-semibold">
                Critico <span className="font-bold text-red-900">*</span>
              </label>
              <label
                className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${productosAgg.critico == true ? "bg-primaryYellow" : "bg-gray-300"
                  }`}>
                <input
                  value={productosAgg.critico}
                  type="checkbox"
                  name="critico"
                  onChange={(e) => btn_cambio_producto(e)}
                  className="sr-only peer" />
                <span
                  className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
              </label>

              {errors.critico && (
                <div className="text-red-600 text-xs">
                  {errors.critico}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-between items-center">
              <label className="text-gray-600 pb-2 font-semibold">
                Inventariable <span className="font-bold text-red-900">*</span>
              </label>
              <label
                className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${productosAgg.inventariable == true ? "bg-primaryYellow" : "bg-gray-300"
                  }`}>
                <input
                  value={productosAgg.inventariable}
                  type="checkbox"
                  name="inventariable"
                  onChange={(e) => btn_cambio_producto(e)}
                  className="sr-only peer" />
                <span
                  className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
              </label>
              {errors.inventariable && (
                <div className="text-red-600 text-xs">
                  {errors.inventariable}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-between items-center">
              <label className="text-gray-600 pb-2 font-semibold">
                Compuesto <span className="font-bold text-red-900">*</span>
              </label>
              <label
                className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${productosAgg.compuesto == true ? "bg-primaryYellow" : "bg-gray-300"
                  }`}>
                <input
                  value={productosAgg.compuesto}
                  name="compuesto"
                  type="checkbox"
                  onChange={(e) => btn_cambio_producto(e)}
                  className="sr-only peer" />
                <span
                  className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
              </label>
              {errors.compuesto && (
                <div className="text-red-600 text-xs">
                  {errors.compuesto}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-between items-center">
              <label className="text-gray-600 pb-2 font-semibold">
                Ficha <span className="font-bold text-red-900">*</span>
              </label>
              <label
                className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${productosAgg.ficha == true ? "bg-primaryYellow" : "bg-gray-300"
                  }`}>
                <input
                  value={productosAgg.ficha}
                  name="ficha"
                  type="checkbox"
                  onChange={(e) => btn_cambio_producto(e)}
                  className="sr-only peer" />
                <span
                  className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
              </label>
              {errors.ficha && (
                <div className="text-red-600 text-xs">
                  {errors.ficha}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-between">
              <label className="text-gray-600 pb-2 font-semibold">
                Certificado <span className="font-bold text-red-900">*</span>
              </label>
              <label
                className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${productosAgg.certificado == true ? "bg-primaryYellow" : "bg-gray-300"
                  }`}>
                <input
                  value={productosAgg.certificado}
                  name="certificado"
                  type="checkbox"
                  onChange={(e) => btn_cambio_producto(e)}
                  className="sr-only peer" />
                <span
                  className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
              </label>
              {errors.certificado && (
                <div className="text-red-600 text-xs">
                  {errors.certificado}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between max-sm:col-span-2">
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