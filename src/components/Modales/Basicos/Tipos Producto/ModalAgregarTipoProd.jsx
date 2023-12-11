import { InputText } from "primereact/inputtext";
import useTipoProd from "../../../../hooks/Basicos/useTipoProd";
import useAuth from "../../../../hooks/useAuth";
import { Dialog } from "primereact/dialog";
import Button from "../../../Botones/Button";

const ModalAgregarTipoProd = ({ visible, onClose }) => {
  const {
    errors,
    setErrors,
    TipoProdAgg,
    setTipoProdAgg,
    guardar_tipo_prod,
    editar_tipo_prod,
  } = useTipoProd();

  const { authUsuario } = useAuth();

  const cerrar_modal = () => {
    setTipoProdAgg({
      id_tipo_producto: 0,
      id_empresa: authUsuario.id_empresa,
      descripcion: "",
    });
    setErrors({});
    onClose();
  };

  const btn_guardar = async () => {
    const formData = {
      id_tipo_producto: TipoProdAgg.id_tipo_producto,
      id_empresa: authUsuario.id_empresa,
      descripcion: TipoProdAgg.descripcion,
    };
    const regex = /^[a-zA-Z0-9\s]*$/;
    const errors = {};

    if (!regex.test(TipoProdAgg.descripcion)) {
      errors.tipoprod = "No se permiten caracteres especiales";
      setErrors(errors);
      return
    }
    try {
      let response;
      if (TipoProdAgg.id_tipo_producto !== 0) {
        response = await editar_tipo_prod(formData);
        onClose();
      } else {
        response = await guardar_tipo_prod(formData);
        onClose();
      }

      if (response) {
        onClose();
        setErrors({});
      }
    } catch (error) {
      console.error(
        "Error al guardar el tipo de producto:",
        error.response.message
      );
    }
    setErrors({});
  };

  const btn_cambio_tipo_prod = (e) => {
    const value = e.target.value;
    setTipoProdAgg({
      ...TipoProdAgg,
      [e.target.name]: value.replace(/\d/g, ""),
    });
  };

  const footerContent = (
    <div>
      <Button tipo={"PRINCIPAL"} funcion={btn_guardar}>
        {" "}
        {TipoProdAgg.id_tipo_producto !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );

  return (
    <Dialog
      header={
        TipoProdAgg.id_tipo_producto !== 0 ? (
          <h1>Editar Tipo de Producto</h1>
        ) : (
          <h1>Agregar Tipo de Producto</h1>
        )
      }
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap w-full">
        <div className="grid gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Tipo de Producto <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={TipoProdAgg.descripcion}
              type="text"
              name="descripcion"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.tipoprod ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_tipo_prod(e)}
            />
            {errors.tipoprod && (
              <div className="text-red-600 text-xs">{errors.tipoprod}</div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAgregarTipoProd;
