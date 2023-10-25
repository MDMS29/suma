
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

import useRoles from "../../hooks/useRoles";
import Button from "../Botones/Button";

// eslint-disable-next-line react/prop-types
const ModalPrinRoles = ({ visible, onClose }) => {

  const { errors, setErrors, rolAgg, setRolAgg, guardarRol, editarRol } = useRoles();

  const handleClose = () => {
    setRolAgg({ id_rol: 0, nombre: '', descripcion: '' })
    setErrors({ nombre: '', descripcion: '' })
    onClose()
  };

  const handleChangeRol = (e) => {
    const value = e.target.value;
    setRolAgg({ ...rolAgg, [e.target.name]: e.target.name == "nombre" ? value.replace(/\d/g, '') : value});
}
  const handleGuardar = async () => {

    if (rolAgg.nombre.trim() === '') {
      setErrors({ ...errors, nombre: 'Debe ingresar un nombre' })
      return
    }
    if (rolAgg.descripcion.trim() === '') {
      setErrors({ ...errors, descripcion: 'Debe ingresar una descripcion' })
      return
    }
    setErrors({ ...errors, nombre: '', descripcion: '' })

    let response
    try {
      if (rolAgg.id_rol !== 0) {
        response = await editarRol(rolAgg)
      } else {
        response = await guardarRol(rolAgg)
      }

      if (response) {
        setRolAgg({ id_rol: 0, nombre: '', descripcion: '' })
        onClose()
      }

    } catch (error) {
      console.log(error)
    }
  };

  // Botones de Atrás, Siguiente y Guardar del Modal
  const footerContent = (
    <div>
      <Button
        tipo="PRINCIPAL"
        funcion={handleGuardar}
      >
        {rolAgg.id_rol !== 0 ? 'Actualizar' : 'Guardar'}
      </Button>
    </div>
  );


  return (
    <Dialog
      header={<h1>{rolAgg.id_rol !== 0 ? 'Editar Rol' : 'Guardar Rol'}</h1>}
      visible={visible}
      onHide={handleClose}
      className="max-sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className=" gap-4">
        <div className="flex flex-col flex-grow mb-3">
          <label className="text-gray-600 pb-2 font-semibold">Nombre <span className="font-bold text-red-900">*</span></label>
          <InputText
            value={rolAgg.nombre}
            type="text"
            name="nombre"
            className={`border-1 h-10 rounded-md px-3 py-2 ${errors.nombre ? "border-red-500" : "border-gray-300"}`}
            onChange={(e) => handleChangeRol(e)}
          />
          {errors.nombre && (
            <div className="text-red-600 text-xs w-44">
              {errors.nombre}
            </div>
          )}
        </div>


        <div className="flex flex-col flex-grow">
          <label className="text-gray-600 pb-2 font-semibold">Descripcion <span className="font-bold text-red-900">*</span></label>
          <InputTextarea
            autoResize
            value={rolAgg.descripcion}
            name="descripcion"
            className={`border-1 p-1 rounded-md h-10 px-3 py-2 ${errors.descripcion ? "border-red-500" : "border-gray-300"}`}
            rows={5} cols={30}
            onChange={(e) => handleChangeRol(e)}
          />
          {errors.descripcion && (
            <div className="text-red-600 text-xs w-44">
              {errors.descripcion}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ModalPrinRoles;