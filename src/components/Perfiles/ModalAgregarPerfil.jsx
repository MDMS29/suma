import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";


const ModalAgregarPerfil = () => {
  return (
    <Dialog
      header={perfilesEdit.length !== 0 ? <h1>Editar Usuario</h1> : <h1>Agregar Usuario</h1>}
      visible={visible}
      onHide={handleClose}
      className="w-full sm:w-full md:w-1/2  lg:w-1/2  xl:w-1/2"
      footer={footerContent}
    >
      <div className="flex flex-col pt-3 flex-wrap sm:w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-gray-600 pb-2 font-semibold">Nombre completo <span className="font-bold text-red-00">*</span></label>
            <InputText
              type="text"
              name="nombre"
              className={"border-1 h-10 rounded-md px-3 py-2 border-gray-300"}
              
            />
            {/* {errors.nombre && (
              <div className="text-red-600 text-xs w-44">
                {errors.nombre}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalAgregarPerfil