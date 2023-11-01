import { Dialog } from "primereact/dialog"
import useMarcas from "../../../../hooks/Basicos/useMarcas"
import Button from "../../../Botones/Button";
import { InputText } from "primereact/inputtext";



const ModalAgregarMarcas = ({ visible, onClose }) => {
    const { marcasAgg, setMarcasAgg, errors, setErrors, guardar_marca, editar_marca } = useMarcas()

        const cerrar_modal = () => {
        onClose();
        setMarcasAgg({
            id_marca: 0,
            marca: "",
        });
        setErrors({});
    };

    const btn_cambio_marca = (e) => {
        const value = e.target.value;
        setMarcasAgg({ ...marcasAgg, [e.target.name]: value.replace(/\d/g, '') });
    };

    const btn_guardar = async () => {
        const formData = {
            id_marca: marcasAgg.id_marca,
            marca: marcasAgg.marca
        }

        const regex = /^[a-zA-Z0-9\s]*$/;
        const errors = {};
        if (marcasAgg.marca.trim() === '') {
            errors.marca = "Este campo es obligatorio"
            setErrors(errors);
            return
        }
        if (!regex.test(marcasAgg.marca)) {
            errors.marca = "No se permiten caracteres especiales";
            setErrors(errors);
            return
        }

        try {
            let response;
            if (marcasAgg.id_marca !== 0) {
                response = await editar_marca(formData);
            } else {
                response = await guardar_marca(formData);
            }

            if (response) {
                onClose();
                setErrors({});
            }

        } catch (error) {
            console.error("Error al guardar la marca:", error);
        }
        setErrors({});
    }

    const footerContent = (
        <div>
            <Button
                tipo={'PRINCIPAL'}
                funcion={btn_guardar}
            > {marcasAgg.id_marca !== 0 ? 'Actualizar' : 'Guardar'}
            </Button>
        </div>
    );

    return (
        <Dialog
            header={marcasAgg.id_marca !==0 ? <h1>Editar Marca</h1> : <h1>Agregar Marca</h1>}
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
                            value={marcasAgg.marca}
                            type="text"
                            name="marca"
                            className={`border-1 h-10 rounded-md px-3 ${errors.marca ? "border-red-500" : "border-gray-300"
                                }`}
                            onChange={(e) => btn_cambio_marca(e)}
                        />
                        {errors.marca && (
                            <div className="text-red-600 text-xs">
                                {errors.marca}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ModalAgregarMarcas