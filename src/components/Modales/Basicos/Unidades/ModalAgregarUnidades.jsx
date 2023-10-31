import { Dialog } from "primereact/dialog";
import useUnidades from "../../../../hooks/Basicos/useUnidades";
import Button from "../../../Botones/Button";
import { InputText } from "primereact/inputtext";
import useAuth from "../../../../hooks/useAuth";

const ModalAgregarUnidades = ({ visible, onClose }) => {
  const {
    errors,
    setErrors,
    UnidadesAgg,
    setUnidadesAgg,
    guardar_unidad,
    editar_unidad,
  } = useUnidades();
  const { authUsuario } = useAuth();

  const cerrar_modal = () => {
    setUnidadesAgg({
      id_unidad: 0,
      id_empresa: authUsuario.id_empresa,
      unidad: "",
    });
    setErrors({});
    onClose();
  };

  const btn_guardar = async () => {
    const formData = {
      id_unidad: UnidadesAgg.id_unidad,
      id_empresa: authUsuario.id_empresa,
      unidad: UnidadesAgg.unidad,
    };

    if (UnidadesAgg.unidad.trim() === "") {
      errors.unidad = "Este campo es obligatorio";
      setErrors(errors);
      return;
    }

    try {
      let response;
      if (UnidadesAgg.id_unidad !== 0) {
        response = await editar_unidad(formData);
        onClose();
      } else {
        response = await guardar_unidad(formData);
        onClose();
      }

      if (response) {
        onClose();
        setErrors({});
      }
    } catch (error) {
      console.error(
        "Error al guardar la unidad de medida:",
        error.response.message
      );
    }
    setErrors({});
  };

  const btn_cambio_unidad = (e) => {
    const value = e.target.value;
    setUnidadesAgg({
      ...UnidadesAgg,
      [e.target.name]: value.replace(/\d/g, ""),
    });
  };

  const footerContent = (
    <div>
      <Button tipo={"PRINCIPAL"} funcion={btn_guardar}>
        {" "}
        {UnidadesAgg.id_unidad !== 0 ? "Actualizar" : "Guardar"}
      </Button>
    </div>
  );

  return (
    <Dialog
      header={
        UnidadesAgg.id_unidad !== 0 ? (
          <h1>Editar Unidad de Medida</h1>
        ) : (
          <h1>Agregar Unidad de medida</h1>
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
              Unidad de Medida <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={UnidadesAgg.unidad}
              type="text"
              name="unidad"
              className={`border-1 h-10 rounded-md px-3 py-2 ${
                errors.unidad ? "border-red-500" : "border-gray-300"
              }`}
              onChange={(e) => btn_cambio_unidad(e)}
              />
            {errors.unidad && (
              <div className="text-red-600 text-xs">{errors.unidad}</div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalAgregarUnidades;
