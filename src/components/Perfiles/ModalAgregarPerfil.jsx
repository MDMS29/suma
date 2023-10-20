import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";

import { InputText } from "primereact/inputtext";
import usePerfiles from "../../hooks/usePerfiles";
import { useState, useEffect } from "react";

const ModalAgregarPerfil = ({ visible, onClose }) => {
  const {
    setPerfilesAgg,
    PerfilesAgg,
    errors,
    setErrors,
    modulosAgg,
    obtenerModulos,
    editarPerfil,
    modulosEdit,
    setModulosEdit,
    guardarPerfil
  } = usePerfiles();

  const [modulosSeleccionados, setModulosSeleccionados] = useState([]);

  useEffect(()=>{
    if(PerfilesAgg.id_perfil){
      setModulosSeleccionados(modulosEdit)
    }
  },[modulosEdit])

  const handleChangePerfiles = (e) => {
    setPerfilesAgg({ ...PerfilesAgg, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const formData = {
      id_perfil: PerfilesAgg.id_perfil,
      nombre_perfil: PerfilesAgg.nombre_perfil,
      modulos: modulosSeleccionados,
    };
    const regex = /^[a-zA-Z0-9\s]*$/;
    const errors = {};

    if (!regex.test(PerfilesAgg.nombre_perfil)) {
      errors.nombre_perfil = "No se permiten caracteres especiales";
    }

    if ([PerfilesAgg.nombre_perfil].includes(" ")) {
      errors.nombre_perfil = "Este campo es obligatorio";
      console.log("Este campo es obligatorio");
    }

    if (
      modulosSeleccionados.length === 0 ||
      modulosSeleccionados.filter((modulo) => modulo?.id_estado === 1)
        .length === 0
    ) {
      errors.modulos = "Debes seleccionar al menos un modulo";
    }

    try {
      let response;
      if (PerfilesAgg.id_perfil !== 0) {
        response = await editarPerfil(formData);
        onClose(); 
      } else {
        response = await guardarPerfil(formData);
        onClose(); 
      }

      if (response) {
        onClose(); 
        setPerfilesAgg({
          id_perfil: 0,
          nombre_perfil: ""
        });
        setModulosSeleccionados([]);
      }


    } catch (error) {
      console.error("Error al guardar el usuario:", error.response.data.message);
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    setPerfilesAgg({
      nombre_perfil: "",
    });
    setErrors({});
    setModulosEdit([])
  };

  useEffect(() => {
    obtenerModulos(modulosSeleccionados);
  }, []);


  const CheckboxChange = (rowData) => {
    const moduloId = rowData.id_modulo;

    if (modulosSeleccionados.find((modulo) => modulo.id_modulo == moduloId)) {
      if (modulosEdit.find((modulo) => modulo.id_modulo == moduloId)) {
        const [modulo] = modulosSeleccionados.filter(
          (modulo) => modulo.id_modulo == moduloId
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
          (modulo) => modulo.id_modulo !== moduloId
        );
        setModulosSeleccionados(modulos);
      }
    } else {
      setModulosSeleccionados([
        ...modulosSeleccionados,
        { id_modulo: moduloId, id_estado: 1 },
      ]);
    }
  };

  const fncChkModulo = (row) => {
    const modulo = modulosSeleccionados.filter((modulo) => modulo.id_modulo === row.id_modulo);
    // console.log(perfil)
    if (modulo) {
      return modulo[0]?.id_estado === 1;
    } else {
      return false;
    }
  };
  const footerContent = (
    <div>
      <Button
        onClick={handleGuardar}
        className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500 font-semibold"
      >
          {modulosEdit.length !== 0 ? 'Actualizar' : 'Guardar'}

      </Button>
    </div>
  );
  return (
    <Dialog
      header={modulosEdit.length !== 0 ? <h1>Editar Perfil</h1> : <h1>Agregar Perfil</h1>}
      visible={visible}
      onHide={handleClose}
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
              onChange={(e) => handleChangePerfiles(e)}
            />
            {errors.nombre_perfil && (
              <div className="text-red-600 text-xs ">
                {errors.nombre_perfil}
              </div>
            )}
            <div className="pt-4">
              <h1>Modulos</h1>
              <DataTable value={modulosAgg} className="custom-datatable pt-2">
                <Column field="nombre_modulo" header="Nombre del Módulo" />
                <Column
                  field="col1"
                  header="Seleccione"
                  body={(row) => (
                    <input
                      type="checkbox"
                      checked={fncChkModulo(row)}
                      onChange={() => CheckboxChange(row)}
                    />
                  )}
                  style={{ width: "3em" }}
                />
              </DataTable>
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
      </div>
    </Dialog>
  );
};

export default ModalAgregarPerfil;
