
import { Dialog } from "primereact/dialog";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import Button from "../../../Botones/Button";
import usePerfiles from "../../../../hooks/Configuracion/usePerfiles";


const ModalAgregarPerfil = ({ visible, onClose }) => {
  const {
    setPerfilesAgg,
    PerfilesAgg,
    errors,
    setErrors,
    modulosAgg,
    obtener_modulos,
    editar_perfil,
    modulosEdit,
    setModulosEdit,
    guardar_perfil
  } = usePerfiles();

  const [modulosSeleccionados, setModulosSeleccionados] = useState([]);

  useEffect(() => {
    if (PerfilesAgg.id_perfil) {
      setModulosSeleccionados(modulosEdit)
    }
  }, [modulosEdit])

  const btn_cambio_perfil = (e) => {
    const value = e.target.value;
    setPerfilesAgg({ ...PerfilesAgg, [e.target.name]: value.replace(/\d/g, '') });
  };

  const btn_guardar = async () => {
    const formData = {
      id_perfil: PerfilesAgg.id_perfil,
      nombre_perfil: PerfilesAgg.nombre_perfil,
      modulos: modulosSeleccionados,
    };
    const regex = /^[a-zA-Z0-9\s]*$/;
    const errors = {};

    if (PerfilesAgg.nombre_perfil.trim() === '') {
      errors.nombre_perfil = "Este campo es obligatorio"
      setErrors(errors);
      return
    }

    if (!regex.test(PerfilesAgg.nombre_perfil)) {
      errors.nombre_perfil = "No se permiten caracteres especiales";
      setErrors(errors);
      return
    }

    if (modulosSeleccionados.length === 0 || modulosSeleccionados.filter((modulo) => modulo?.id_estado === 1).length === 0) {
      errors.modulos = "Debes seleccionar al menos un modulo";
      setErrors(errors);
      return
    }

    try {
      let response;
      if (PerfilesAgg.id_perfil !== 0) {
        response = await editar_perfil(formData);
        onClose();
      } else {
        response = await guardar_perfil(formData);
        onClose();
      }

      if (response) {
        onClose();
        setErrors({});
        setModulosEdit([])
      }

    } catch (error) {
      console.error("Error al guardar el usuario:", error.response.message);
    }
    setErrors({});
  };

  const cerrar_modal = () => {
    onClose();
    setPerfilesAgg({
      id_perfil: 0,
      nombre_perfil: "",
    });
    setErrors({});
    setModulosEdit([])
  };

  useEffect(() => {
    obtener_modulos(modulosSeleccionados);
  }, []);


  const chk_modulo = (nombrePefil, idPerfil) => {
    const modulo_id = idPerfil;

    if (modulosSeleccionados.find((modulo) => modulo.id_modulo == modulo_id)) {
      if (modulosEdit.find((modulo) => modulo.id_modulo == modulo_id)) {
        const [modulo] = modulosSeleccionados.filter(
          (modulo) => modulo.id_modulo == modulo_id
        );
        if (modulo.id_estado == 1) {
          modulo.id_estado = 2;
        } else {
          modulo.id_estado = 1;
        }
        const modulosActualizados = modulosSeleccionados.map((moduloState) =>
          moduloState.id_modulo == modulo.id_modulo ? modulo : moduloState
        );
        setModulosSeleccionados(modulosActualizados);
      } else {
        const modulos = modulosSeleccionados.filter(
          (modulo) => modulo.id_modulo !== modulo_id
        );
        setModulosSeleccionados(modulos);
      }
    } else {
      setModulosSeleccionados([
        ...modulosSeleccionados,
        { id_modulo: modulo_id, id_estado: 1 },
      ]);
    }
  };

  const chk_modulo_seleccionado = (row) => {
    const modulo = modulosSeleccionados.filter((modulo) => modulo.id_modulo === row.id_modulo);
    if (modulo) {
      return modulo[0]?.id_estado === 1;
    } else {
      return false;
    }
  };

  const footerContent = (
    <div>
      <Button
        tipo={'PRINCIPAL'}
        funcion={btn_guardar}
      > {PerfilesAgg.id_perfil !== 0 ? 'Actualizar' : 'Guardar'}
      </Button>
    </div>
  );

  return (
    <Dialog
      header={PerfilesAgg.id_perfil !== 0 ? <h1>Editar Perfil</h1> : <h1>Agregar Perfil</h1>}
      visible={visible}
      onHide={cerrar_modal}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap w-full">
        <div className="grid gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">
              Nombre <span className="font-bold text-red-900">*</span>
            </label>
            <InputText
              value={PerfilesAgg.nombre_perfil}
              type="text"
              name="nombre_perfil"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.nombre_perfil ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => btn_cambio_perfil(e)}
            />
            {errors.nombre_perfil && (
              <div className="text-red-600 text-xs">
                {errors.nombre_perfil}
              </div>
            )}

            <div className="pl-2 pt-3 mt-3 border rounded-md">
              <h1>Modulos</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 mt-2 rounded-md overflow-auto h-48">
                {modulosAgg.map((modulo) => (
                  <div key={modulo.id}>
                    <label
                      className={`p-checkbox w-10 h-5 cursor-pointer relative rounded-full ${chk_modulo_seleccionado(modulo) ? "bg-primaryYellow" : "bg-gray-300"
                        }`}>
                      <input
                        type="checkbox"
                        checked={chk_modulo_seleccionado(modulo)}
                        className="sr-only peer"
                        onChange={() =>
                          chk_modulo(modulo.id_modulo, modulo.id_modulo)
                        }
                      />
                      <span
                        className={`w-2/5 h-4/5 bg-white absolute rounded-full left-0.5 top-0.5 peer-checked:left-5 duration-500`}></span>
                    </label>
                    <span className="ml-6">{modulo.nombre_modulo}</span>
                  </div>
                ))}
              </div>
            </div>
            <br />
            {errors.modulos && (
              <Message
                severity="warn"
                text="Debes seleccionar al menos un modulo"
                className="w-full"
              >
                {errors.modulos}
              </Message>
            )}

          </div>
        </div>
      </div>
    </Dialog>
  );

};

export default ModalAgregarPerfil;
