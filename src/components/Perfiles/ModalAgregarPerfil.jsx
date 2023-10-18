import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import usePerfiles from "../../hooks/usePerfiles";



const ModalAgregarPerfil = ({visible, onClose}) => {
  const { PerfilesAgg, errors, setErrors, handleChangePerfiles } = usePerfiles();


  const footerContent = () => {
    <Button
      className="bg-primaryYellow p-2 mx-2 rounded-md px-3 hover:bg-yellow-500 font-semibold">Guardar</Button>
  }

  const handleClose=() => {
    onClose();
    setErrors({});
  }

  return (
    <Dialog
      header={<h1>Agregar Perfil</h1>}
      visible={visible}
      onHide={handleClose}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap sm:w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">Nombre<span className="font-bold text-red-00">*</span></label>
            <InputText
              value={PerfilesAgg.nombre}
              type="text"
              name="nombre"
              className={`border-1 h-10 rounded-md px-3 py-2 ${errors.nombre_perfil ? "border-red-500" : "border-gray-300"
                }`}
              onChange={(e) => handleChangePerfiles(e)}
            />
            {errors.nombre && (
              <div className="text-red-600 text-xs w-44">
                {errors.nombre}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalAgregarPerfil