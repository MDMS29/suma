import { useLocation } from "react-router-dom";
import useFamiliaProd from "../../../../hooks/Basicos/useFamiliaProd"
import useAuth from "../../../../hooks/useAuth";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import Button from "../../../Botones/Button";


function ModalAgregarFliaPro({ visible, onClose }) {

  const {
    errors,
    setErrors,
    FliaProAgg,
    setFliaProAgg,
    guardar_flia_prod,
    editar_flia_pro
  } = useFamiliaProd();

  const { authUsuario } = useAuth();

  const cerrar_modal = () => {
    setFliaProAgg({
      id_familia: 0,
      id_empresa: authUsuario.id_empresa,
      referencia: "",
      descripcion: "",
    })
    setErrors({});
    onClose();
  }

  const btn_guardar = async () => {
    const formData = {
      id_familia: FliaProAgg.id_familia,
      id_empresa: authUsuario.id_empresa,
      referencia: FliaProAgg.referencia,
      descripcion: FliaProAgg.descripcion,
    };

    const regex = /^[a-zA-Z0-9\s]*$/;
    const errors = {};
    const refeRegex = /^[0-9]*$/;

    if (!refeRegex.test(FliaProAgg.referencia)) {
      errors.refePro = "La referencia debe contener solo dígitos";
      setErrors(errors);
    }

    if (!regex.test(FliaProAgg.descripcion)) {
      errors.fliaPro = "No se permiten caracteres especiales";
      setErrors(errors);
      return
    }

    if (FliaProAgg.descripcion.trim() === '') {
      errors.fliaPro = "Este campo es obligatorio"
      setErrors(errors);
      return
    }

    try {
      let response;
      if (FliaProAgg.id_familia !== 0) {
        response = await editar_flia_pro(formData);
      } else {
        response = await guardar_flia_prod(formData);
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

  const btn_cambio_flia_pro = (e) => {
    const value = e.target.value;
    setFliaProAgg({
      ...FliaProAgg,
      [e.target.name]: value,
    });
  };

  const footerContent = (
    <div>
      <Button tipo={"PRINCIPAL"} funcion={btn_guardar}>
        {" "}
        {FliaProAgg.id_familia !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );

  return (
    <Dialog
      header={
        FliaProAgg.id_familia !== 0 ? (
          <h1>Editar Familia de Productos</h1>
        ) : (
          <h1>Agregar Familia de Productos</h1>
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
              Referencia <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={FliaProAgg.referencia}
              type="number"
              name="referencia"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.refePro ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_flia_pro(e)}
            />
            {errors.refePro && (
              <div className="text-red-600 text-xs">{errors.refePro}</div>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Descripción <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={FliaProAgg.descripcion}
              type="text"
              name="descripcion"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.fliaPro ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_flia_pro(e)}
            />
            {errors.fliaPro && (
              <div className="text-red-600 text-xs">{errors.fliaPro}</div>
            )}

          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalAgregarFliaPro